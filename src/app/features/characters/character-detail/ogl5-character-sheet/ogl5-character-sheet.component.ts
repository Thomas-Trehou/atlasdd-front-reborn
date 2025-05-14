import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import {Ogl5Character, Ogl5CharacterUpdateRequest} from '../../../../core/models/character/ogl5-character';
import {CharacterService} from '../../../../services/character/character.service';
import {SKILL_ABILITY_MAPPINGS_BY_ID} from '../../../../core/utils/SkillAbilityMapping';
import {ShieldType} from '../../../../core/enums/shield-type';
import { Alignment } from '../../../../core/enums/alignment';

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
  activeTab: 'general' | 'spells' = 'general';
  activeSpellTab: 'prepared' | 'class' = 'prepared';
  originalCharacterData: any = null;
  selectedSpellLevel: number = 0;
  expandedSpellIds: string[] = [];
  ShieldType = ShieldType;
  Alignment = Alignment;

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

    const alignmentKey = this.getAlignmentKeyFromValue(this.character.alignment);

    this.characterForm = this.fb.group({
      id: [this.character.id],
      name: [{value: this.character.name, disabled: !this.isEditMode}],
      level: [{value: this.character.level, disabled: !this.isEditMode}],
      experience: [{value: this.character.experience, disabled: !this.isEditMode}],
      armorClass: [{value: this.character.armorClass, disabled: !this.isEditMode}],
      initiative: [{value: this.character.initiative, disabled: !this.isEditMode}],
      inspiration: [{value: this.character.inspiration, disabled: !this.isEditMode}],
      hitPoints: [{value: this.character.hitPoints, disabled: !this.isEditMode}],
      maxHitPoints: [{value: this.character.maxHitPoints, disabled: !this.isEditMode}],
      bonusHitPoints: [{value: this.character.bonusHitPoints, disabled: !this.isEditMode}],
      speed: [{value: this.character.speed, disabled: !this.isEditMode}],
      passivePerception: [{value: this.character.passivePerception, disabled: !this.isEditMode}],
      shield: [{value: this.character.shield || ShieldType.NONE, disabled: !this.isEditMode}],
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

  enterEditMode(): void {
    this.originalCharacterData = JSON.parse(JSON.stringify(this.character));
    this.isEditMode = true;
    this.initForm();

    // Activer explicitement tous les contrôles (sauf ceux qui doivent rester désactivés)
    const excludedControls = ['raceId', 'backgroundId', 'classId', 'skillIds', 'preparedSpellIds', 'weaponIds', 'armorId'];

    Object.keys(this.characterForm.controls).forEach(controlName => {
      if (!excludedControls.includes(controlName)) {
        this.characterForm.get(controlName)?.enable();
        console.log(`Activation du contrôle ${controlName}: ${!this.characterForm.get(controlName)?.disabled}`);
      }
    });
  }


  cancelEdit(): void {
    // Restaurer les données originales
    if (this.originalCharacterData) {
      this.character = this.originalCharacterData;
      this.originalCharacterData = null;
    }

    // Quitter le mode édition
    this.isEditMode = false;
  }


  saveChanges(): void {
    if (this.characterForm.valid) {
      // Récupérer toutes les valeurs du formulaire
      const formValues = this.characterForm.getRawValue();

      // Créer l'objet de requête
      const updateRequest: Ogl5CharacterUpdateRequest = {
        ...formValues
      };

      // Convertir la valeur numérique du shield en chaîne de caractères correspondante
      if (updateRequest.shield !== undefined) {
        updateRequest.shield = ShieldType[updateRequest.shield] as any;
      }

      this.characterService.updateOgl5Character(updateRequest.id, updateRequest).subscribe({
        next: (updatedCharacter) => {
          this.character = updatedCharacter;
          this.characterUpdated.emit(updatedCharacter);

          // Effacer la sauvegarde temporaire
          this.originalCharacterData = null;

          // Sortir du mode édition
          this.isEditMode = false;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du personnage', err);
          // Optionnel : vous pourriez choisir de rester en mode édition en cas d'erreur
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

  getModifierText(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
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

  getSpellcastingAbility(): string {
    // Définition du type avec un index signature
    type SpellcastingAbilities = {
      [key: string]: string;
    };

    // Dictionnaire des attributs d'incantation par classe
    const spellcastingAbilities: SpellcastingAbilities = {
      'Magicien': 'Intelligence',
      'Clerc': 'Sagesse',
      'Paladin': 'Charisme',
      'Druide': 'Sagesse',
      'Barde': 'Charisme',
      'Ensorceleur': 'Charisme',
      'Sorcier': 'Charisme',
      'Rôdeur': 'Sagesse'
      // Ajouter d'autres classes selon besoin
    };

    // Récupérer le nom de la classe du personnage
    const className = this.character.classe.name;

    // Vérifier si la classe existe dans notre dictionnaire et retourner l'attribut correspondant
    return spellcastingAbilities[className] || 'Aucun';
  }


  calculateSpellSaveDC() {
    // Exemple de calcul: 8 + bonus de maîtrise + modificateur d'incantation
    // Logique à adapter selon vos règles
    return 'À implémenter';
  }

  calculateSpellAttackBonus() {
    // Exemple: modificateur d'incantation + bonus de maîtrise
    return 'À implémenter';
  }

  getSpellSlots(level: number) {
    // Récupérer les emplacements de sorts actuels par niveau
    return 5;
  }

  getMaxSpellSlots(level: number) {
    // Calculer le nombre max d'emplacements de sorts selon le niveau et la classe
    return 5;
  }

  getPreparedSpellsByLevel(level: number): any[] {
    if (!this.character.preparedSpells) {
      return [];
    }

    return this.character.preparedSpells.filter(spell =>
      spell.level === level.toString() || (level === 0 && spell.level === "0")
    );
  }

// Récupérer les sorts de classe par niveau
  getClassSpellsByLevel(level: number): any[] {
    if (!this.character.classe || !this.character.classe.classSpells) {
      return [];
    }

    return this.character.classe.classSpells.filter(spell =>
      spell.level === level.toString() || (level === 0 && spell.level === "0")
    );
  }

// Vérifier si un sort est déjà préparé
  isSpellPrepared(spell: any): boolean {
    if (!this.character.preparedSpells) {
      return false;
    }

    return this.character.preparedSpells.some(s => s.id === spell.id);
  }

// Ajouter un sort aux sorts préparés
  addToPrepared(spell: any): void {
    if (!this.character.preparedSpells) {
      this.character.preparedSpells = [];
    }

    // Vérifier si le sort n'est pas déjà préparé
    if (!this.isSpellPrepared(spell)) {
      // Ajouter le sort à la liste des sorts préparés (pour l'affichage)
      this.character.preparedSpells.push({...spell});

      // Mise à jour du contrôle preparedSpellIds du formulaire
      if (this.characterForm) {
        const currentIds = this.characterForm.get('preparedSpellIds')?.value || [];
        const updatedIds = [...currentIds, spell.id];

        // Mettre à jour le contrôle avec le nouvel ID
        this.characterForm.patchValue({
          preparedSpellIds: updatedIds
        });

        // Pour s'assurer que le formulaire est marqué comme modifié
        this.characterForm.markAsDirty();
      }
    }
  }


// Retirer un sort des sorts préparés
  removeFromPrepared(spell: any): void {
    if (!this.character.preparedSpells) {
      return;
    }

    // Filtrer le sort à retirer de l'affichage
    this.character.preparedSpells = this.character.preparedSpells.filter(s => s.id !== spell.id);

    // Mettre à jour le contrôle preparedSpellIds du formulaire
    if (this.characterForm) {
      const currentIds = this.characterForm.get('preparedSpellIds')?.value || [];
      const updatedIds = currentIds.filter((id: string) => id !== spell.id);

      // Mettre à jour le contrôle avec la liste filtrée d'IDs
      this.characterForm.patchValue({
        preparedSpellIds: updatedIds
      });

      // Marquer le formulaire comme modifié
      this.characterForm.markAsDirty();
    }
  }

// Ajouter un nouveau sort de classe
  addClassSpell(level: number): void {
    // Implémentez selon vos besoins, par exemple ouvrir un dialogue pour créer/sélectionner un sort
    console.log(`Ajouter un sort de niveau ${level} à la liste des sorts de classe`);

    // Exemple d'ouverture d'un dialogue
    // this.dialog.open(AddSpellComponent, { data: { level } });
  }

  toggleSpellDetails(spell: any): void {
    const index = this.expandedSpellIds.indexOf(spell.id);
    if (index === -1) {
      this.expandedSpellIds.push(spell.id);
    } else {
      this.expandedSpellIds.splice(index, 1);
    }
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

  getShieldDisplayName(shieldValue: ShieldType | string | null): string {
    // Si on reçoit un string (ex: "NORMAL")
    if (typeof shieldValue === 'string') {
      // Convertir en valeur numérique
      shieldValue = ShieldType[shieldValue as keyof typeof ShieldType];
    }

    // Maintenant utiliser la valeur numérique
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

  private getAlignmentKeyFromValue(value: string): string {
    const entries = Object.entries(Alignment);
    const found = entries.find(([_, val]) => val === value);
    return found ? found[0] : 'NEUTRE_PUR'; // Valeur par défaut
  }

  getAlignmentDisplayValue(alignmentKey: string | null): string {
    if (!alignmentKey) return '';

    // Vérifier si la clé existe dans l'enum
    if (Object.prototype.hasOwnProperty.call(Alignment, alignmentKey)) {
      return Alignment[alignmentKey as keyof typeof Alignment];
    }

    // Si la valeur est déjà la valeur d'affichage (ex: "Loyal Bon")
    // Tentative de retrouver la clé correspondante
    const entries = Object.entries(Alignment);
    const found = entries.find(([_, val]) => val === alignmentKey);

    return found ? found[1] : alignmentKey;
  }

}
