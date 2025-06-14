import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterCreationOptionsService, CharacterCreationData } from '../../../../services/character/character-creation-options.service';
import { CharacterService } from '../../../../services/character/character.service';
import { Ogl5CharacterCreateRequest } from '../../../../core/models/character/ogl5-character';
import { Skill } from '../../../../core/models/option/skill';
import { SkillProficiencyLevel } from '../../../../core/enums/skill-proficiency-level';
import {SpellSlots} from '../../../../core/models/character/spell-slots';
import {Ogl5Race} from '../../../../core/models/option/race';

@Component({
  selector: 'app-ogl5-character-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ogl5-character-creation.component.html',
  styleUrl: './ogl5-character-creation.component.scss'
})
export class Ogl5CharacterCreationComponent implements OnInit {

  creationForm!: FormGroup;
  options: CharacterCreationData = {
    races: [], classes: [], backgrounds: [], skills: [], spells: [], weapons: [], armors: []
  };
  isLoading = true;
  private lastSelectedRace: Ogl5Race | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private optionsService: CharacterCreationOptionsService,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.optionsService.loadAllCreationData().subscribe({
      next: (data) => {
        this.options = data;
        // Initialiser le Form Control 'skills' avec toutes les compétences possibles
        const initialSkills = this.options.skills.map(skill => ({ ...skill, expert: false, isProficient: false }));
        this.creationForm.get('skills')?.setValue(initialSkills);
        this.isLoading = false;
        this.listenToRaceSelection();
        this.listenToClassAndConstitutionChanges();
        this.listenToWisdomChanges();

        // On appelle les méthodes une première fois pour initialiser les valeurs
        this.updateHitPoints();
        this.updatePassivePerception();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des options de création", err);
        this.isLoading = false;
      }
    });
  }

  private initForm(): void {
    this.creationForm = this.fb.group({
      name: ['Nouveau Héros', [Validators.required, Validators.minLength(2)]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      experience: [0, Validators.required],
      armorClass: [10, Validators.required],
      initiative: [0, Validators.required],
      inspiration: [0, Validators.required],
      hitPoints: [10, Validators.required],
      maxHitPoints: [10, Validators.required],
      bonusHitPoints: [0],
      speed: [30, Validators.required],
      passivePerception: [10, Validators.required],
      shield: ['NONE', Validators.required],
      twoWeaponsFighting: [false],
      alignment: ['LOYAL_BON', Validators.required],
      strength: [10, Validators.required],
      dexterity: [10, Validators.required],
      constitution: [10, Validators.required],
      intelligence: [10, Validators.required],
      wisdom: [10, Validators.required],
      charisma: [10, Validators.required],
      status: ['VIVANT', Validators.required],
      userId: [3, Validators.required], // Mettez l'ID de l'utilisateur connecté
      raceId: [null, Validators.required],
      backgroundId: [null, Validators.required],
      classId: [null, Validators.required],
      armorId: [null, Validators.required],
      weapon1Id: [null, Validators.required],
      weapon2Id: [null, Validators.required],
      preparedSpellIds: [[]],
      skills: [[]],
    });
  }

  // --- Méthodes copiées et adaptées de Ogl5CharacterSheetComponent ---
  getAbilityModifierText(score: number): string {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  /**
   * Vérifie si une compétence est marquée comme maîtrisée dans le formulaire.
   */
  isSkillProficient(skillId: number): boolean {
    const skills = this.creationForm.get('skills')?.value || [];
    const skill = skills.find((s: any) => s.id === skillId);
    return skill ? skill.isProficient : false;
  }

  /**
   * Alterne l'état de maîtrise (proficient) d'une compétence.
   */
  toggleSkillProficiency(skillId: number): void {
    const skillsControl = this.creationForm.get('skills');
    if (!skillsControl) return;

    const skills = [...skillsControl.value];
    const skillIndex = skills.findIndex((s: any) => s.id === skillId);

    if (skillIndex > -1) {
      // Inverse simplement la valeur de 'isProficient'
      skills[skillIndex].isProficient = !skills[skillIndex].isProficient;
      skillsControl.setValue(skills);
      skillsControl.markAsDirty();
    }
  }

  onSubmit(): void {
    if (this.creationForm.invalid) {
      alert("Le formulaire contient des erreurs.");
      return;
    }

    const formValues = this.creationForm.getRawValue();

    // La logique pour filtrer les compétences reste la même
    const proficientSkills = formValues.skills.filter((skill: any) => skill.isProficient);

    // --- MODIFICATION ---
    // 1. Définir la structure par défaut pour les emplacements de sorts
    const defaultSpellSlots: SpellSlots = {
      slots: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      slotsUsed: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 }
    };

    // --- MODIFICATION ---
    // 1. Construire le payload en se basant sur les valeurs du formulaire
    const payload: Ogl5CharacterCreateRequest = {
      ...formValues,
      skills: proficientSkills.map(({ id, expert }: Skill) => ({ id, expert: false })), // On s'assure que 'expert' est toujours false
      spellSlots: defaultSpellSlots,
      // 2. Créer manuellement le tableau weaponIds
      weaponIds: [formValues.weapon1Id, formValues.weapon2Id].filter(id => id !== null)
    };

    // 3. Supprimer les contrôles temporaires du payload final
    delete (payload as any).weapon1Id;
    delete (payload as any).weapon2Id;
    // --- FIN DE LA MODIFICATION ---

    this.characterService.createOgl5Character(payload).subscribe({
      next: (newCharacter) => {
        alert('Personnage créé avec succès !');
        this.router.navigate(['/characters/detail', 'ogl5', newCharacter.id]);
      },
      error: (err) => {
        console.error("Erreur lors de la création du personnage", err);
        alert("Une erreur est survenue : " + err.message);
      }
    });
  }

  private listenToRaceSelection(): void {
    const raceIdControl = this.creationForm.get('raceId');
    if (raceIdControl) {
      raceIdControl.valueChanges.subscribe(raceId => {
        if (raceId) {
          // Le `+` convertit la valeur (qui peut être une chaîne) en nombre
          const selectedRace = this.options.races.find(r => r.id === +raceId);
          if (selectedRace) {
            this.applyRaceBonuses(selectedRace);
          }
        }
      });
    }
  }

  private applyRaceBonuses(newRace: Ogl5Race): void {
    // 1. Récupérer les valeurs actuelles des caractéristiques depuis le formulaire
    const currentScores = {
      strength: this.creationForm.get('strength')?.value,
      dexterity: this.creationForm.get('dexterity')?.value,
      constitution: this.creationForm.get('constitution')?.value,
      intelligence: this.creationForm.get('intelligence')?.value,
      wisdom: this.creationForm.get('wisdom')?.value,
      charisma: this.creationForm.get('charisma')?.value,
    };

    // 2. Si une race était déjà sélectionnée, on soustrait ses bonus pour revenir aux scores de base
    if (this.lastSelectedRace) {
      currentScores.strength -= this.lastSelectedRace.strengthBonus;
      currentScores.dexterity -= this.lastSelectedRace.dexterityBonus;
      currentScores.constitution -= this.lastSelectedRace.constitutionBonus;
      currentScores.intelligence -= this.lastSelectedRace.intelligenceBonus;
      currentScores.wisdom -= this.lastSelectedRace.wisdomBonus;
      currentScores.charisma -= this.lastSelectedRace.charismaBonus;
    }

    // 3. On ajoute les bonus de la nouvelle race aux scores (qui sont maintenant "de base")
    const newScores = {
      strength: currentScores.strength + newRace.strengthBonus,
      dexterity: currentScores.dexterity + newRace.dexterityBonus,
      constitution: currentScores.constitution + newRace.constitutionBonus,
      intelligence: currentScores.intelligence + newRace.intelligenceBonus,
      wisdom: currentScores.wisdom + newRace.wisdomBonus,
      charisma: currentScores.charisma + newRace.charismaBonus,
    };

    // On récupère la vitesse de la race. La propriété speed est un string dans la RaceDto.
    // On la convertit en nombre, avec une valeur par défaut de 30 si invalide.
    const newSpeed = Number(newRace.speed) || 30;

    // 4. Mettre à jour le formulaire avec les nouvelles valeurs
    this.creationForm.patchValue({
      ...newScores,
      speed: newSpeed // On met à jour la vitesse en même temps
    });

    // 5. Mémoriser la race qui vient d'être appliquée pour la prochaine fois
    this.lastSelectedRace = newRace;
  }

  /**
   * Met en place les écouteurs pour la classe et la constitution.
   */
  private listenToClassAndConstitutionChanges(): void {
    const classIdControl = this.creationForm.get('classId');
    const constitutionControl = this.creationForm.get('constitution');

    if (classIdControl) {
      classIdControl.valueChanges.subscribe(() => this.updateHitPoints());
    }
    if (constitutionControl) {
      constitutionControl.valueChanges.subscribe(() => this.updateHitPoints());
    }
  }

  /**
   * Calcule et met à jour les points de vie en fonction de la classe et de la constitution.
   */
  private updateHitPoints(): void {
    const classId = this.creationForm.get('classId')?.value;
    const constitution = this.creationForm.get('constitution')?.value;

    if (!classId || constitution === null) {
      return; // Ne fait rien si la classe n'est pas choisie ou si la constitution est nulle
    }

    const selectedClass = this.options.classes.find(c => c.id === +classId);
    if (!selectedClass) {
      return;
    }

    // La propriété s'appelle startingHitPoints dans le modèle Ogl5Class
    const baseHp = selectedClass.startingHitPoints;
    const constitutionModifier = Math.floor((constitution - 10) / 2);

    const totalHp = baseHp + constitutionModifier;

    this.creationForm.patchValue({
      hitPoints: totalHp,
      maxHitPoints: totalHp
    });
  }

  /**
   * Met en place l'écouteur pour la sagesse.
   */
  private listenToWisdomChanges(): void {
    const wisdomControl = this.creationForm.get('wisdom');
    if (wisdomControl) {
      wisdomControl.valueChanges.subscribe(() => this.updatePassivePerception());
    }
  }

  /**
   * Calcule et met à jour la perception passive.
   */
  private updatePassivePerception(): void {
    const wisdom = this.creationForm.get('wisdom')?.value;
    if (wisdom === null) return;

    const wisdomModifier = Math.floor((wisdom - 10) / 2);
    const passivePerception = 10 + wisdomModifier;

    this.creationForm.patchValue({
      passivePerception: passivePerception
    });
  }
}
