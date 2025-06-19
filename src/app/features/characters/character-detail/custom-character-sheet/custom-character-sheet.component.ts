import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomCharacter, CustomCharacterUpdateRequest} from '../../../../core/models/character/custom-character';
import {CharacterService} from '../../../../services/character/character.service';
import {Alignment} from '../../../../core/enums/alignment';
import {ShieldType} from '../../../../core/enums/shield-type';
import {Skill} from "../../../../core/models/option/skill";
import {SkillProficiencyLevel} from "../../../../core/enums/skill-proficiency-level";
import {SKILL_ABILITY_MAPPINGS_BY_ID} from "../../../../core/utils/SkillAbilityMapping";
import {Ogl5Character} from '../../../../core/models/character/ogl5-character';
import {CharacterSheetSpellsTabComponent} from '../character-sheet-spells-tab/character-sheet-spells-tab.component';
import {ArmorCategory} from '../../../../core/enums/armor-category';
import {Subscription} from 'rxjs';
// NOTE : Il n'y a pas de CharacterSheetSpellsTabComponent pour l'instant comme demandé.

@Component({
  selector: 'app-custom-character-sheet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CharacterSheetSpellsTabComponent],
  templateUrl: './custom-character-sheet.component.html',
  styleUrls: ['./custom-character-sheet.component.scss']
})
export class CustomCharacterSheetComponent implements OnInit {
  @Input() character!: CustomCharacter;
  @Output() characterUpdated = new EventEmitter<CustomCharacter>();
  @ViewChild(CharacterSheetSpellsTabComponent) private spellsTabComponent!: CharacterSheetSpellsTabComponent;

  characterForm!: FormGroup;
  isEditMode = false;
  activeTab: 'general' | 'spells' = 'general';
  private subscriptions: Subscription[] = [];

  // Exposer les enums au template
  ShieldType = ShieldType;
  Alignment = Alignment;

  // Pour la gestion des compétences
  allSkills: Skill[] = [];
  private skillAbilityMappings = SKILL_ABILITY_MAPPINGS_BY_ID;
  armorCategoryOptions: [string, string][] = [];

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


  constructor(private fb: FormBuilder, private characterService: CharacterService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllSkills();
    this.armorCategoryOptions = Object.entries(ArmorCategory);

    const levelControl = this.characterForm.get('level');
    if (levelControl) {
      const sub = levelControl.valueChanges.subscribe(() => { // On stocke la souscription
        setTimeout(() => this.spellsTabComponent?.updateSpellSlotValidators(), 0);
      });
      this.subscriptions.push(sub); // On l'ajoute au tableau pour qu'elle soit détruite plus tard
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
    this.characterForm = this.fb.group({
      id: [this.character.id],
      name: [this.character.name, Validators.required],
      level: [this.character.level, [Validators.required, Validators.min(1)]],
      experience: [this.character.experience],
      armorClass: [this.character.armorClass],
      initiative: [this.character.initiative],
      inspiration: [this.character.inspiration],
      hitPoints: [this.character.hitPoints],
      maxHitPoints: [this.character.maxHitPoints],
      bonusHitPoints: [this.character.bonusHitPoints],
      speed: [this.character.speed],
      passivePerception: [this.character.passivePerception],
      shield: [this.character.shield],
      twoWeaponsFighting: [this.character.twoWeaponsFighting],
      alignment: [this.character.alignment],
      strength: [this.character.strength],
      dexterity: [this.character.dexterity],
      constitution: [this.character.constitution],
      intelligence: [this.character.intelligence],
      wisdom: [this.character.wisdom],
      charisma: [this.character.charisma],
      strengthSavingThrowBonus: [this.character.strengthSavingThrowBonus],
      dexteritySavingThrowBonus:[this.character.dexteritySavingThrowBonus],
      constitutionSavingThrowBonus: [this.character.constitutionSavingThrowBonus],
      intelligenceSavingThrowBonus: [this.character.intelligenceSavingThrowBonus],
      wisdomSavingThrowBonus: [this.character.wisdomSavingThrowBonus],
      charismaSavingThrowBonus: [this.character.charismaSavingThrowBonus],
      status: [this.character.status],
      spellSlots: [this.character.spellSlots],
      preparedSpellIds: [this.character.preparedSpells.map(spell => spell.id)],

      // FormGroups imbriqués pour les objets custom
      race: this.fb.group({
        name: [this.character.race.name, Validators.required],
        speed: [this.character.race.speed],
        languages: [this.character.race.languages],
        traits: [this.character.race.traits]
      }),
      background: this.fb.group({
        name: [this.character.background.name, Validators.required],
        masteredTools: [this.character.background.masteredTools],
        startingEquipment: [this.character.background.startingEquipment],
        backgroundFeature: [this.character.background.backgroundFeature]
      }),
      classe: this.fb.group({
        name: [this.character.classe.name, Validators.required],
        hitDice: [this.character.classe.hitDice],
        startingHitPoints: [this.character.classe.startingHitPoints],
        startingEquipment: [this.character.classe.startingEquipment]
      }),
      armor: this.fb.group({
        name: [this.character.armor.name, Validators.required],
        armorCategory: [this.character.armor.armorCategory],
        armorClass: [this.character.armor.armorClass],
        strengthMinimum: [this.character.armor.strengthMinimum],
        stealthDisadvantage: [this.character.armor.stealthDisadvantage],
        weight: [this.character.armor.weight],
        cost: [this.character.armor.cost],
        properties: [this.character.armor.properties]
      }),

      // FormArray pour les armes
      weapons: this.fb.array(
        this.character.weapons.map(weapon => this.createWeaponGroup(weapon))
      ),

      // Gestion des compétences (similaire à OGL5)
      skills: [this.character.skills]
    });

    this.spellLevels.forEach(level => {
      this.characterForm.addControl(
        'spellSlots' + level.key,
        this.fb.control(this.character.spellSlots.slotsUsed[level.key as keyof typeof this.character.spellSlots.slotsUsed])
      );
    });

    // Désactiver tous les contrôles par défaut
    this.characterForm.disable();
  }

  createWeaponGroup(weapon: any): FormGroup {
    return this.fb.group({
      name: [weapon.name, Validators.required],
      weaponRange: [weapon.weaponRange], // Note: le nom peut varier, adaptez si besoin
      cost: [weapon.cost],
      damageDice: [weapon.damageDice],
      damageType: [weapon.damageType],
      weight: [weapon.weight],
      properties: [weapon.properties]
    });
  }

  get weapons(): FormArray {
    return this.characterForm.get('weapons') as FormArray;
  }

  enterEditMode(): void {
    this.isEditMode = true;
    this.characterForm.enable();

    this.spellLevels.forEach(level => {
      const control = this.characterForm.get('spellSlots' + level.key);
      if (control) {
        control.enable();
      }
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.initForm(); // Réinitialise le formulaire avec les données originales
  }

  saveChanges(): void {
    if (this.characterForm.invalid) {
      alert("Le formulaire contient des erreurs.");
      return;
    }

    const formValues = this.characterForm.getRawValue();

    const updatedSlotsUsed: { [key: string]: number } = {};
    this.spellLevels.forEach(level => {
      const controlName = 'spellSlots' + level.key;
      if (formValues[controlName] !== undefined && formValues[controlName] !== null) {
        updatedSlotsUsed[level.key] = formValues[controlName];
      }
    });

    // La requête d'update attend l'objet complet avec les sous-objets mis à jour
    const updateRequest: CustomCharacterUpdateRequest = {
      ...this.character, // On part de l'objet original pour garder les champs non modifiables (createdAt, etc.)
      ...formValues,
      spellSlots: {
        ...this.character.spellSlots,
        slotsUsed: updatedSlotsUsed
      },// On écrase avec les nouvelles valeurs du formulaire
    };

    this.spellLevels.forEach(level => {
      delete (updateRequest as any)['spellSlots' + level.key];
    });

    this.characterService.updateCustomCharacter(this.character.id, updateRequest).subscribe({
      next: (updatedCharacter) => {
        this.character = updatedCharacter;
        this.characterUpdated.emit(updatedCharacter);
        this.isEditMode = false;
        this.characterForm.disable();
      },
      error: (err) => console.error("Erreur lors de la mise à jour", err)
    });
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

  /**
   * Reçoit la liste mise à jour des sorts préparés depuis le composant enfant
   * et met à jour l'état du personnage et le formulaire.
   */
  onPreparedSpellsChange(newPreparedSpells: any[]): void {
    // 1. Mettre à jour l'objet character local (de manière immuable)
    this.character = {
      ...this.character,
      preparedSpells: newPreparedSpells
    };

    // 2. Mettre à jour le contrôle de formulaire avec les nouveaux IDs
    this.characterForm.patchValue({
      preparedSpellIds: newPreparedSpells.map(spell => spell.id)
    });

    // 3. Marquer le formulaire comme "modifié"
    this.characterForm.markAsDirty();
  }

}
