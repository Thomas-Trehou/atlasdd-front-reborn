import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Ogl5Character, Ogl5CharacterUpdateRequest} from '../../../../core/models/character/ogl5-character';
import {CharacterService} from '../../../../services/character/character.service';
import {SKILL_ABILITY_MAPPINGS_BY_ID} from '../../../../core/utils/SkillAbilityMapping';
import {ShieldType} from '../../../../core/enums/shield-type';
import { Alignment } from '../../../../core/enums/alignment';
import {Subscription} from 'rxjs';
import {CharacterSheetSpellsTabComponent} from '../character-sheet-spells-tab/character-sheet-spells-tab.component';
import {SkillProficiencyLevel} from '../../../../core/enums/skill-proficiency-level';
import {Skill} from '../../../../core/models/option/skill';

@Component({
  selector: 'app-ogl5-character-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CharacterSheetSpellsTabComponent
  ],
  templateUrl: './ogl5-character-sheet.component.html',
  styleUrls: ['./ogl5-character-sheet.component.scss']
})
export class Ogl5CharacterSheetComponent implements OnInit {
  @Input() character!: Ogl5Character;
  @Output() characterUpdated = new EventEmitter<Ogl5Character>();
  @ViewChild(CharacterSheetSpellsTabComponent) private spellsTabComponent!: CharacterSheetSpellsTabComponent;

  characterForm!: FormGroup;
  isEditMode: boolean = false;
  allSkills: Skill[] = [];
  private skillAbilityMappings = SKILL_ABILITY_MAPPINGS_BY_ID;
  activeTab: 'general' | 'spells' = 'general';
  originalCharacterData: any = null;
  ShieldType = ShieldType;
  private subscriptions: Subscription[] = [];


  spellLevels = [
    {num: 1, key: '1'},
    {num: 2, key: '2'},
    {num: 3, key: '3'},
    {num: 4, key: '4'},
    {num: 5, key: '5'},
    {num: 6, key: '6'},
    {num: 7, key: '7'},
    {num: 8, key: '8'},
    {num: 9, key: '9'}
  ];


  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService
) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllSkills();

    const levelControl = this.characterForm.get('level');
    if (levelControl) {
      levelControl.valueChanges.subscribe(() => {
        setTimeout(() => this.spellsTabComponent?.updateSpellSlotValidators(), 0);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnChanges(): void {
    if (this.character && this.characterForm) {
      this.characterForm.patchValue(this.character);
    }
  }

  private initForm(): void {

    let currentShield: ShieldType;

    if (typeof this.character.shield === 'number') {
      switch (this.character.shield) {
        case 0: currentShield = ShieldType.NONE; break;
        case 2: currentShield = ShieldType.NORMAL; break;
        case 3: currentShield = ShieldType.MAGIC_1; break;
        case 4: currentShield = ShieldType.MAGIC_2; break;
        case 5: currentShield = ShieldType.MAGIC_3; break;
        default: currentShield = ShieldType.NONE;
      }
    } else if (this.character.shield === null || this.character.shield === undefined) {
      currentShield = ShieldType.NONE;
    } else {
      currentShield = ShieldType.NONE;
    }
    let alignmentKey = this.character.alignment;

    if (typeof alignmentKey === 'string' && Object.keys(Alignment).includes(alignmentKey)) {
    }
    else if (alignmentKey) {
      const entries = Object.entries(Alignment);
      const found = entries.find(([_, val]) => val === alignmentKey);
      if (found) {
        alignmentKey = Alignment[found[0] as keyof typeof Alignment];
      }
    }

    this.characterForm = this.fb.group({
      id: [this.character.id],
      name: [{value: this.character.name, disabled: !this.isEditMode}],
      level: [{
        value: this.character.level,
        disabled: !this.isEditMode
      }, [
        Validators.required,
        Validators.min(1),
        Validators.max(20)
      ]],
      experience: [{value: this.character.experience, disabled: !this.isEditMode}],
      armorClass: [{value: this.character.armorClass, disabled: !this.isEditMode}],
      initiative: [{value: this.character.initiative, disabled: !this.isEditMode}],
      inspiration: [{value: this.character.inspiration, disabled: !this.isEditMode}],
      hitPoints: [{value: this.character.hitPoints, disabled: !this.isEditMode}],
      maxHitPoints: [{value: this.character.maxHitPoints, disabled: !this.isEditMode}],
      bonusHitPoints: [{value: this.character.bonusHitPoints, disabled: !this.isEditMode}],
      speed: [{value: this.character.speed, disabled: !this.isEditMode}],
      passivePerception: [{value: this.character.passivePerception, disabled: !this.isEditMode}],
      shield: [{value: currentShield, disabled: !this.isEditMode}],
      twoWeaponsFighting: [{value: this.character.twoWeaponsFighting, disabled: !this.isEditMode}],
      alignment: [{value: alignmentKey, disabled: !this.isEditMode}],
      strength: [{value: this.character.strength, disabled: !this.isEditMode}],
      dexterity: [{value: this.character.dexterity, disabled: !this.isEditMode}],
      constitution: [{value: this.character.constitution, disabled: !this.isEditMode}],
      intelligence: [{value: this.character.intelligence, disabled: !this.isEditMode}],
      wisdom: [{value: this.character.wisdom, disabled: !this.isEditMode}],
      charisma: [{value: this.character.charisma, disabled: !this.isEditMode}],
      strengthSavingThrowBonus: [{value: this.character.strengthSavingThrowBonus, disabled: !this.isEditMode}],
      dexteritySavingThrowBonus:[{value: this.character.dexteritySavingThrowBonus, disabled: !this.isEditMode}],
      constitutionSavingThrowBonus: [{value: this.character.constitutionSavingThrowBonus, disabled: !this.isEditMode}],
      intelligenceSavingThrowBonus: [{value: this.character.intelligenceSavingThrowBonus, disabled: !this.isEditMode}],
      wisdomSavingThrowBonus: [{value: this.character.wisdomSavingThrowBonus, disabled: !this.isEditMode}],
      charismaSavingThrowBonus: [{value: this.character.charismaSavingThrowBonus, disabled: !this.isEditMode}],
      status: [{value: this.character.status, disabled: !this.isEditMode}],
      spellSlots: [{value: this.character.spellSlots, disabled: !this.isEditMode}],
      raceId: [this.character.race.id],
      backgroundId: [this.character.background.id],
      classId: [this.character.classe.id],
      skills: [this.character.skills],
      preparedSpellIds: [this.character.preparedSpells.map(spell => spell.id)],
      weaponIds: [this.character.weapons.map(weapon => weapon.id)],
      armorId: [this.character.armor ? this.character.armor.id : null]
    });

    this.spellLevels.forEach(level => {
      this.characterForm.addControl(
        'spellSlots' + level.key,
        this.fb.control(this.character.spellSlots.slotsUsed[level.key as keyof typeof this.character.spellSlots.slotsUsed])
      );
    });
  }

  enterEditMode(): void {
    this.isEditMode = true;

    this.characterForm.get('level')?.enable();

    this.spellLevels.forEach(level => {
      const control = this.characterForm.get('spellSlots' + level.key);
      if (control) {
        control.enable();
      }
    });

    this.originalCharacterData = { ...this.character };

    Object.keys(this.characterForm.controls).forEach(key => {
      const control = this.characterForm.get(key);
      control?.enable();

      if (key === 'shield' || key === 'alignment') {
        const characterValue = this.character[key];
        console.log(`Original ${key} value:`, characterValue, typeof characterValue);

        let formValue: any = characterValue;

        if (key === 'shield' && characterValue !== null) {
          if (typeof characterValue === 'number') {
            const isValidValue = Object.values(ShieldType).includes(characterValue);
            formValue = isValidValue ? characterValue : ShieldType.NONE;
          }
          else if (typeof characterValue === 'string') {
            const strValue = String(characterValue);

            if (Object.keys(ShieldType).includes(strValue)) {
              switch (strValue) {
                case 'NONE': formValue = ShieldType.NONE; break;
                case 'NORMAL': formValue = ShieldType.NORMAL; break;
                case 'MAGIC_1': formValue = ShieldType.MAGIC_1; break;
                case 'MAGIC_2': formValue = ShieldType.MAGIC_2; break;
                case 'MAGIC_3': formValue = ShieldType.MAGIC_3; break;
                default: formValue = ShieldType.NONE;
              }
            }

            else if (!isNaN(Number(characterValue))) {
              const numValue = Number(characterValue);
              formValue = Object.values(ShieldType).includes(numValue) ? numValue : ShieldType.NONE;
            }
            else {
              const entries = Object.entries(ShieldType);
              for (const [key, val] of entries) {
                if (val === characterValue) {
                  const safeKey = key as keyof typeof ShieldType;
                  formValue = ShieldType[safeKey];
                  break;
                }
              }

              if (formValue === characterValue) {
                formValue = ShieldType.NONE;
              }
            }
          }
        }


        if (key === 'alignment' && characterValue) {
          if (typeof characterValue === 'string' && !Object.keys(Alignment).includes(characterValue)) {
            const entries = Object.entries(Alignment);
            const found = entries.find(([_, val]) => val === characterValue);
            if (found) formValue = Alignment[found[0] as keyof typeof Alignment];
          }
        }

        control?.setValue(formValue);
        console.log(`Set ${key} to:`, formValue, typeof formValue);
      }
    });
  }

  cancelEdit(): void {
    if (this.originalCharacterData) {
      this.character = this.originalCharacterData;
      this.originalCharacterData = null;
    }

    this.isEditMode = false;
  }

  saveChanges(): void {
    if (this.characterForm.valid) {
      const formValues = this.characterForm.getRawValue();

      const updatedSlotsUsed: { [key: string]: number } = {};
      this.spellLevels.forEach(level => {
        const controlName = 'spellSlots' + level.key;
        if (formValues[controlName] !== undefined && formValues[controlName] !== null) {
          updatedSlotsUsed[level.key] = formValues[controlName];
        }
      });

      const updateRequest: Ogl5CharacterUpdateRequest = {
        ...formValues,
        spellSlots: {
          ...this.character.spellSlots,
          slotsUsed: updatedSlotsUsed
        },
        skills: formValues.skills
      };

      this.spellLevels.forEach(level => {
        delete (updateRequest as any)['spellSlots' + level.key];
      });

      if (updateRequest.shield !== undefined) {
        updateRequest.shield = ShieldType[updateRequest.shield] as any;
      }

      this.characterService.updateOgl5Character(updateRequest.id, updateRequest).subscribe({
        next: (updatedCharacter) => {
          this.character = updatedCharacter;
          this.characterUpdated.emit(updatedCharacter);
          this.originalCharacterData = null;
          this.isEditMode = false;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du personnage', err);
        }
      });
    }
  }

  getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  getAbilityModifierText(score: number): string {
    const modifier = this.getAbilityModifier(score);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  getModifierText(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
  }

  loadAllSkills(): void {
    this.characterService.getAllSkills().subscribe({
      next: (skills) => {
        this.allSkills = skills.map(skill => ({
          ...skill,
          abilityType: this.getAbilityKeyForSkill(skill.id)
        })) as Skill[];
      },
      error: (err) => {
        console.error('Erreur lors du chargement des compétences', err);
      }
    });
  }

  // Obtenir la caractéristique associée à une compétence à partir du mapping
  getAbilityKeyForSkill(skillId: number): 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma' {
    const abilityType = this.skillAbilityMappings[skillId] || 'dexterity';
    return abilityType as 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
  }


  // Obtenir l'abréviation de la caractéristique associée
  getAbilityAbbreviation(abilityType: string): string {
    const abbreviations: { [key: string]: string } = {
      'strength': 'FOR',
      'dexterity': 'DEX',
      'constitution': 'CON',
      'intelligence': 'INT',
      'wisdom': 'SAG',
      'charisma': 'CHA'
    };

    return abbreviations[abilityType] || abilityType;
  }

  getSkillModifierTextById(skillId: number): string {
    const abilityKey = this.getAbilityKeyForSkill(skillId);
    const abilityScore = this.character[abilityKey as keyof Ogl5Character] as number;
    const abilityModifier = this.getAbilityModifier(abilityScore);

    let modifier = abilityModifier;
    const level = this.getSkillProficiencyLevel(skillId);

    if (level !== SkillProficiencyLevel.NONE) {
      const proficiencyBonus = this.getProficiencyBonus();
      if (level === SkillProficiencyLevel.EXPERT) {
        modifier += proficiencyBonus * 2;
      } else {
        modifier += proficiencyBonus;
      }
    }

    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  getProficiencyBonus(): number {
    return Math.floor((this.character.level - 1) / 4) + 2;
  }

  getShieldDisplayName(shieldValue: ShieldType | string | null): string {
    if (typeof shieldValue === 'string') {
      shieldValue = ShieldType[shieldValue as keyof typeof ShieldType];
    }

    switch (shieldValue as ShieldType) {
      case ShieldType.NONE:
        return 'Aucun';
      case ShieldType.NORMAL:
        return 'Normal (+2)';
      case ShieldType.MAGIC_1:
        return 'Magique +1 (+3)';
      case ShieldType.MAGIC_2:
        return 'Magique +2 (+4)';
      case ShieldType.MAGIC_3:
        return 'Magique +3 (+5)';
      default:
        console.warn('Type de bouclier inconnu:', shieldValue);
        return 'Inconnu';
    }
  }

  getAlignmentOptions(): Array<keyof typeof Alignment> {
    return Object.keys(Alignment).filter(key =>
      isNaN(Number(key))
    ) as Array<keyof typeof Alignment>;
  }
  getAlignmentDisplayValue(alignmentKey: string | null): string {
    if (!alignmentKey) return '';

    if (Object.prototype.hasOwnProperty.call(Alignment, alignmentKey)) {
      return Alignment[alignmentKey as keyof typeof Alignment];
    }

    const entries = Object.entries(Alignment);
    const found = entries.find(([_, val]) => val === alignmentKey);

    return found ? found[1] : alignmentKey;
  }

  getSkillProficiencyLevel(skillId: number): SkillProficiencyLevel {
    const skill = this.character.skills.find(s => s.id === skillId);
    if (!skill) return SkillProficiencyLevel.NONE;

    if (skill.expert) return SkillProficiencyLevel.EXPERT;
    return SkillProficiencyLevel.PROFICIENT;
  }

  cycleSkillProficiency(skillId: number): void {
    if (!this.isEditMode) return;

    const currentLevel = this.getSkillProficiencyLevel(skillId);
    let newLevel: SkillProficiencyLevel;

    switch (currentLevel) {
      case SkillProficiencyLevel.NONE:
        newLevel = SkillProficiencyLevel.PROFICIENT;
        break;
      case SkillProficiencyLevel.PROFICIENT:
        newLevel = SkillProficiencyLevel.EXPERT;
        break;
      case SkillProficiencyLevel.EXPERT:
        newLevel = SkillProficiencyLevel.NONE;
        break;
      default:
        newLevel = SkillProficiencyLevel.NONE;
    }

    this.updateSkillProficiency(skillId, newLevel);
  }

  private updateSkillProficiency(skillId: number, level: SkillProficiencyLevel): void {
    let updatedSkills = [...this.character.skills];

    if (level === SkillProficiencyLevel.NONE) {
      updatedSkills = updatedSkills.filter(skill => skill.id !== skillId);
    } else {
      const existingSkillIndex = updatedSkills.findIndex(skill => skill.id === skillId);

      if (existingSkillIndex > -1) {
        updatedSkills[existingSkillIndex] = {
          ...updatedSkills[existingSkillIndex],
          expert: level === SkillProficiencyLevel.EXPERT
        };
      } else {
        const skillData = this.allSkills.find(s => s.id === skillId);
        if (skillData) {
          updatedSkills.push({
            ...skillData,
            expert: level === SkillProficiencyLevel.EXPERT
          });
        }
      }
    }

    this.character = { ...this.character, skills: updatedSkills };
    this.characterForm.patchValue({ skills: updatedSkills });
  }

  getSkillStatusText(skillId: number): string {
    const level = this.getSkillProficiencyLevel(skillId);
    switch (level) {
      case SkillProficiencyLevel.EXPERT:
        return 'Expert';
      case SkillProficiencyLevel.PROFICIENT:
        return 'Maîtrisé';
      default:
        return '';
    }
  }

  getSkillStatusClass(skillId: number): string {
    const level = this.getSkillProficiencyLevel(skillId);
    switch (level) {
      case SkillProficiencyLevel.EXPERT:
        return 'text-purple-600 font-bold';
      case SkillProficiencyLevel.PROFICIENT:
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  }

}
