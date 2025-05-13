import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import {Ogl5Character, Ogl5CharacterUpdateRequest} from '../../../../core/models/character/ogl5-character';
import {CharacterService} from '../../../../services/character/character.service';
import {SKILL_ABILITY_MAPPINGS_BY_ID} from '../../../../core/utils/SkillAbilityMapping';

@Component({
  selector: 'app-ogl5-character-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './ogl5-character-sheet.component.html',
  styleUrls: ['./ogl5-character-sheet.component.scss']
})
export class Ogl5CharacterSheetComponent implements OnInit {
  @Input() character!: Ogl5Character;
  @Output() characterUpdated = new EventEmitter<Ogl5Character>();

  characterForm!: FormGroup;
  isEditMode: boolean = false;
  allSkills: any[] = [];
  private skillAbilityMappings = SKILL_ABILITY_MAPPINGS_BY_ID;

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllSkills();
  }

  ngOnChanges(): void {
    if (this.character && this.characterForm) {
      this.characterForm.patchValue(this.character);
    }
  }

  private initForm(): void {
    this.characterForm = this.fb.group({
      id: [this.character.id],
      name: [this.character.name],
      level: [this.character.level],
      experience: [this.character.experience],
      armorClass: [this.character.armorClass],
      initiative: [this.character.initiative],
      inscription: [this.character.inscription],
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
      status: [this.character.status],
      // IDs des relations (ces champs ne seront pas édités directement)
      raceId: [this.character.race.id],
      backgroundId: [this.character.background.id],
      classId: [this.character.classe.id],
      // Pour les tableaux d'IDs, nous gérerons cela séparément
      skillIds: [this.character.skills.map(skill => skill.id)],
      preparedSpellIds: [this.character.preparedSpells.map(spell => spell.id)],
      weaponIds: [this.character.weapons.map(weapon => weapon.id)],
      armorId: [this.character.armor ? this.character.armor.id : null]
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (!this.isEditMode) {
      // Si on quitte le mode édition, on sauvegarde les changements
      this.saveChanges();
    }
  }

  saveChanges(): void {
    if (this.characterForm.valid) {
      const updateRequest: Ogl5CharacterUpdateRequest = {
        ...this.characterForm.value
      };

      this.characterService.updateOgl5Character(updateRequest.id, updateRequest).subscribe({
        next: (updatedCharacter) => {
          this.character = updatedCharacter;
          this.characterUpdated.emit(updatedCharacter);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du personnage', err);
        }
      });
    }
  }

  // Méthodes utilitaires pour manipuler les caractéristiques
  getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  getAbilityModifierText(score: number): string {
    const modifier = this.getAbilityModifier(score);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  // Récupérer toutes les compétences disponibles
  loadAllSkills(): void {
    this.characterService.getAllSkills().subscribe({
      next: (skills) => {
        this.allSkills = skills.map(skill => ({
          ...skill,
          abilityType: this.getAbilityKeyForSkill(skill.id)
        }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des compétences', err);
      }
    });
  }

  // Calculer le bonus de maîtrise en fonction du niveau
  get proficiencyBonus(): number {
    return Math.floor(2 + (this.character.level - 1) / 4);
  }

  // Vérifier si une compétence est maîtrisée
  isSkillProficient(skillId: number): boolean {
    return this.character.skills.some(skill => skill.id === skillId);
  }

  // Obtenir la caractéristique associée à une compétence à partir du mapping
  getAbilityKeyForSkill(skillId: number): string {
    return this.skillAbilityMappings[skillId] || 'dexterity'; // Valeur par défaut si non trouvée
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

  // Obtenir le nom complet de la caractéristique associée
  getAbilityNameForSkill(skillId: number): string {
    const abilityKey = this.getAbilityKeyForSkill(skillId);
    const abilityNames: { [key: string]: string } = {
      'strength': 'Force',
      'dexterity': 'Dextérité',
      'constitution': 'Constitution',
      'intelligence': 'Intelligence',
      'wisdom': 'Sagesse',
      'charisma': 'Charisme'
    };

    return abilityNames[abilityKey] || abilityKey;
  }

  // Obtenir le score de caractéristique associé à une compétence
  getAbilityScoreForSkill(abilityType: string): number {
    switch (abilityType) {
      case 'strength': return this.character.strength;
      case 'dexterity': return this.character.dexterity;
      case 'constitution': return this.character.constitution;
      case 'intelligence': return this.character.intelligence;
      case 'wisdom': return this.character.wisdom;
      case 'charisma': return this.character.charisma;
      default: return 10; // Valeur par défaut
    }
  }

  // Calculer le modificateur total d'une compétence
  getSkillModifier(skill: any): number {
    // Calculer le modificateur de caractéristique de base
    const abilityScore = this.getAbilityScoreForSkill(skill.abilityType);
    const abilityModifier = this.getAbilityModifier(abilityScore);

    // Ajouter le bonus de maîtrise si compétent
    if (this.isSkillProficient(skill.id)) {
      return abilityModifier + this.proficiencyBonus;
    }

    return abilityModifier;
  }

  // Méthode alternative qui prend directement l'ID de la compétence
  calculateSkillModifier(skillId: number): number {
    const abilityKey = this.getAbilityKeyForSkill(skillId);
    const abilityScore = this.getAbilityScoreForSkill(abilityKey);
    const abilityModifier = this.getAbilityModifier(abilityScore);

    // Ajouter le bonus de maîtrise si compétent
    if (this.isSkillProficient(skillId)) {
      return abilityModifier + this.proficiencyBonus;
    }

    return abilityModifier;
  }

  // Formater le texte du modificateur de compétence
  getSkillModifierText(skill: any): string {
    const modifier = this.getSkillModifier(skill);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  // Version alternative qui prend directement l'ID de compétence
  getSkillModifierTextById(skillId: number): string {
    const abilityKey = this.getAbilityKeyForSkill(skillId);
    const abilityScore = this.character[abilityKey as keyof Ogl5Character] as number;
    const abilityModifier = this.getAbilityModifier(abilityScore);

    let modifier = abilityModifier;
    if (this.isSkillProficient(skillId)) {
      modifier += this.getProficiencyBonus();
    }

    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  getProficiencyBonus(): number {
    return Math.floor((this.character.level - 1) / 4) + 2;
  }

  // Gérer la coche/décoche d'une compétence
  toggleSkillProficiency(skillId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    // Récupère les IDs de compétences actuels du formulaire
    const currentSkillIds = [...this.characterForm.get('skillIds')?.value || []];

    if (isChecked && !currentSkillIds.includes(skillId)) {
      // Ajoute l'ID de compétence
      currentSkillIds.push(skillId);
    } else if (!isChecked && currentSkillIds.includes(skillId)) {
      // Supprime l'ID de compétence
      const index = currentSkillIds.indexOf(skillId);
      currentSkillIds.splice(index, 1);
    }

    // Met à jour le formulaire
    this.characterForm.patchValue({ skillIds: currentSkillIds });
  }

}
