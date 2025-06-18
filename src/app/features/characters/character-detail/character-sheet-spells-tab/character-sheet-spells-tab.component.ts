import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControlContainer, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Ogl5Character } from '../../../../core/models/character/ogl5-character';
import { SpellcasterType } from '../../../../core/enums/SpellcasterType';
import { SpellSlotsService } from '../../../../services/character/spell-slots.service';
import { SpellSlotLevels } from '../../../../core/models/character/spell-slots';

@Component({
  selector: 'app-character-sheet-spells-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './character-sheet-spells-tab.component.html',
  styleUrl: './character-sheet-spells-tab.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]],
    },
  ]
})
export class CharacterSheetSpellsTabComponent implements OnInit{
  @Input() character!: Ogl5Character;
  @Input() isEditMode: boolean = false;
  @Output() preparedSpellsChanged = new EventEmitter<any[]>();

  public parentForm!: FormGroup;

  activeSpellTab: 'prepared' | 'class' = 'prepared';
  selectedSpellLevel: number = 0;
  expandedSpellIds: string[] = [];
  spellcasterType!: SpellcasterType;

  spellLevels = [
    { num: 1, key: '1' }, { num: 2, key: '2' }, { num: 3, key: '3' },
    { num: 4, key: '4' }, { num: 5, key: '5' }, { num: 6, key: '6' },
    { num: 7, key: '7' }, { num: 8, key: '8' }, { num: 9, key: '9' }
  ];

  constructor(
    private parentContainer: ControlContainer,
    private spellSlotsService: SpellSlotsService
  ) {}

  ngOnInit(): void {
    this.parentForm = this.parentContainer.control as FormGroup;
    this.spellcasterType = this.determineSpellcasterType();
  }

  getSpellcastingAbility(): string {
    const spellcastingAbilities: { [key: string]: string } = {
      'Magicien': 'Intelligence', 'Clerc': 'Sagesse', 'Paladin': 'Charisme',
      'Druide': 'Sagesse', 'Barde': 'Charisme', 'Ensorceleur': 'Charisme',
      'Sorcier': 'Charisme', 'Rodeur': 'Sagesse'
    };
    return spellcastingAbilities[this.character.classe.name] || 'Aucun';
  }

  calculateSpellSaveDC(): number {
    const ability = this.getSpellcastingAbility();
    const proficiencyBonus = Math.floor((this.character.level - 1) / 4) + 2;
    let modifier = 0;
    if (ability === 'Intelligence') modifier = Math.floor((this.character.intelligence - 10) / 2);
    if (ability === 'Sagesse') modifier = Math.floor((this.character.wisdom - 10) / 2);
    if (ability === 'Charisme') modifier = Math.floor((this.character.charisma - 10) / 2);
    return 8 + modifier + proficiencyBonus;
  }

  calculateSpellAttackBonus(): number {
    return this.calculateSpellSaveDC() - 8;
  }

  getPreparedSpellsByLevel(level: number): any[] {
    return this.character.preparedSpells
      ?.filter(spell => parseInt(spell.level, 10) === level)
      .sort((a, b) => a.name.localeCompare(b.name)) || [];
  }

  getClassSpellsByLevel(level: number): any[] {
    return this.character.classe.classSpells
      ?.filter(spell => parseInt(spell.level, 10) === level)
      .sort((a, b) => a.name.localeCompare(b.name)) || [];
  }

  isSpellPrepared(spell: any): boolean {
    return this.character.preparedSpells?.some(s => s.id === spell.id);
  }

  addToPrepared(spell: any): void {
    if (!this.isSpellPrepared(spell)) {
      const newPreparedSpells = [...this.character.preparedSpells, { ...spell }];
      this.preparedSpellsChanged.emit(newPreparedSpells);
    }
  }

  removeFromPrepared(spell: any): void {
    const newPreparedSpells = this.character.preparedSpells.filter(s => s.id !== spell.id);
    this.preparedSpellsChanged.emit(newPreparedSpells);
  }

  toggleSpellDetails(spell: any): void {
    const index = this.expandedSpellIds.indexOf(spell.id);
    if (index === -1) this.expandedSpellIds.push(spell.id);
    else this.expandedSpellIds.splice(index, 1);
  }

  // --- Logique pour les emplacements de sorts (spell slots) ---

  private determineSpellcasterType(): SpellcasterType {
    if (!this.character.classe) return SpellcasterType.NON_CASTER;

    // Logique pour déterminer le type de lanceur en fonction de la classe
    switch (this.character.classe.name) {
      case 'Magicien':
      case 'Ensorceleur':
      case 'Barde':
      case 'Druide':
      case 'Clerc':
      case 'Occultiste':
        return SpellcasterType.FULL_CASTER;

      case 'Paladin':
      case 'Rôdeur':
      case 'Artificier':
        return SpellcasterType.HALF_CASTER;

      case 'Roublard arcanique':
      case 'Guerrier eldritch knight':
        return SpellcasterType.THIRD_CASTER;

      default:
        return SpellcasterType.NON_CASTER;
    }
  }

  getTotalSlots(spellLevel: string): number {
    // On récupère la valeur du niveau directement depuis le formulaire du parent
    const currentLevel = this.parentForm.get('level')?.value || this.character.level;
    const spellSlots = this.spellSlotsService.calculateSpellSlots(this.spellcasterType, currentLevel);
    return spellSlots[spellLevel as keyof SpellSlotLevels] || 0;
  }

  getUsedSlots(level: string): number {
    return this.character.spellSlots.slotsUsed[level as keyof typeof this.character.spellSlots.slotsUsed];
  }

  getSlotArray(level: string): number[] {
    const maxSlots = this.getTotalSlots(level);
    return Array.from({ length: maxSlots }, (_, i) => i);
  }

  getSpellSlotsFormValue(level: string): number {
    return this.parentForm.get('spellSlots' + level)?.value || 0;
  }

  toggleSpellSlot(level: string, clickedPosition: number): void {
    const control = this.parentForm.get('spellSlots' + level);
    if (!control) return;
    const currentValue = control.value || 0;
    control.setValue(clickedPosition <= currentValue ? clickedPosition - 1 : clickedPosition);
  }

  hasAdditionalAttributes(spell: any): boolean {
    return !!(
      spell.archetype ||
      (spell.domains && spell.domains.length) ||
      (spell.oaths && spell.oaths.length) ||
      (spell.circles && spell.circles.length) ||
      (spell.patrons && spell.patrons.length)
    );
  }

  addClassSpell(level: number): void {
    console.log(`Fonction indisponible`);
  }

  updateSpellSlotValidators(): void {
    this.spellLevels.forEach(level => {
      const control = this.parentForm.get('spellSlots' + level.key);
      if (control) {
        const maxSlots = this.getTotalSlots(level.key);

        // Mettre à jour uniquement le validateur maximum
        control.setValidators([
          Validators.min(0),
          Validators.max(maxSlots)
        ]);

        // Appliquer les nouveaux validateurs
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

}
