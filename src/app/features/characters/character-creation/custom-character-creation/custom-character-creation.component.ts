import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CharacterService} from '../../../../services/character/character.service';
import {UserService} from '../../../../services/user/user.service';
import {CustomCharacterCreateRequest} from '../../../../core/models/character/custom-character';
import {Skill} from "../../../../core/models/option/skill";
import {ArmorCategory} from "../../../../core/enums/armor-category";
import {SpellcasterType} from '../../../../core/enums/SpellcasterType';

@Component({
  selector: 'app-custom-character-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-character-creation.component.html',
  styleUrl: './custom-character-creation.component.scss'
})
export class CustomCharacterCreationComponent implements OnInit {

  creationForm!: FormGroup;
  skillsFromOptions: Skill[] = [];
  isLoading = true;

  // CHANGEMENT : Remplacé par armorCategoryOptions pour contenir les paires [clé, valeur]
  armorCategoryOptions: [string, string][] = [];

  public spellcasterTypeOptions: [string, string][] = [];
  public spellcastingAbilityOptions: string[] = [];

  private spellcastingAbilityLabels = [
    'Intelligence',
    'Sagesse',
    'Charisme',
  ]

  private spellcasterTypeLabels: { [key: string]: string } = {
    [SpellcasterType.NON_CASTER]: 'Non-lanceur de sorts',
    [SpellcasterType.FULL_CASTER]: 'Lanceur de sorts complet',
    [SpellcasterType.HALF_CASTER]: 'Demi-lanceur de sorts',
    [SpellcasterType.THIRD_CASTER]: 'Tiers-lanceur de sorts'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private characterService: CharacterService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // CHANGEMENT : On utilise Object.entries() pour récupérer les paires clé/valeur
    this.armorCategoryOptions = Object.entries(ArmorCategory);
    this.spellcasterTypeOptions = Object.keys(SpellcasterType).map(key => [key, this.spellcasterTypeLabels[key]]);
    this.spellcastingAbilityOptions = this.spellcastingAbilityLabels;

    this.initForm();
    this.isLoading = true;

    this.characterService.getAllSkills().subscribe({
      next: (skills) => {
        this.skillsFromOptions = skills;
        const initialSkills = skills.map(skill => ({ ...skill, isProficient: false }));
        this.creationForm.get('skills')?.setValue(initialSkills);

        this.isLoading = false;
        this.listenToWisdomChanges();
        this.updatePassivePerception();
      },
      error: (err) => {
        console.error("Erreur lors du chargement des compétences", err);
        this.isLoading = false;
      }
    });
  }

  // ... le reste du fichier .ts est identique
  private initForm(): void {
    this.creationForm = this.fb.group({
      // ... autres champs
      name: ['Héros Custom', [Validators.required, Validators.minLength(2)]],
      level: [1, Validators.required],
      experience: [0],
      armorClass: [10],
      initiative: [0],
      inspiration: [0],
      hitPoints: [10],
      maxHitPoints: [10],
      speed: [30],
      shield: ['NONE'],
      alignment: ['LOYAL_BON', Validators.required],
      strength: [10, Validators.required],
      dexterity: [10, Validators.required],
      constitution: [10, Validators.required],
      intelligence: [10, Validators.required],
      wisdom: [10, Validators.required],
      charisma: [10, Validators.required],
      status: ['VIVANT'],
      userId: [null],
      race: this.fb.group({
        name: ['', Validators.required],
        speed: ['', Validators.required],
        languages: ['', Validators.required],
        traits: ['', Validators.required]
      }),
      background: this.fb.group({
        name: ['', Validators.required],
        masteredTools: ['', Validators.required],
        startingEquipment: ['', Validators.required],
        backgroundFeature: ['', Validators.required]
      }),
      classe: this.fb.group({
        name: ['', Validators.required],
        spellcasterType: [SpellcasterType.NON_CASTER, Validators.required],
        spellcastingAbility: ['Aucune', Validators.required],
        hitDice: ['', Validators.required],
        startingHitPoints: [8, Validators.required],
        startingEquipment: ['', Validators.required]
      }),
      armor: this.fb.group({
        name: ['', Validators.required],
        armorCategory: ['', Validators.required],
        armorClass: [10, Validators.required],
        strengthMinimum: [0, Validators.required],
        stealthDisadvantage: [false, Validators.required],
        weight: [0, Validators.required],
        cost: ['', Validators.required],
        properties: ['', Validators.required]
      }),
      preparedSpellIds: [[]],
      skills: [[]],
      weapons: this.fb.array(
        [this.createWeaponGroup(), this.createWeaponGroup()],
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)]
      ),
    });
  }

  get weapons(): FormArray {
    return this.creationForm.get('weapons') as FormArray;
  }

  createWeaponGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      weaponRange: ['', Validators.required],
      cost: ['', Validators.required],
      damageDice: ['', Validators.required],
      damageType: ['', Validators.required],
      weight: [0, Validators.required],
      properties: ['', Validators.required]
    });
  }

  addWeapon(): void {
    if (this.weapons.length >= 2) {
      alert("Vous ne pouvez pas équiper plus de deux armes.");
      return;
    }
    this.weapons.push(this.createWeaponGroup());
  }

  removeWeapon(index: number): void {
    if (this.weapons.length <= 2) {
      alert("Vous devez équiper au moins deux armes.");
      return;
    }
    this.weapons.removeAt(index);
  }

  isSkillProficient(skillId: number): boolean {
    const skills = this.creationForm.get('skills')?.value || [];
    const skill = skills.find((s: any) => s.id === skillId);
    return skill ? skill.isProficient : false;
  }

  toggleSkillProficiency(skillId: number): void {
    const skillsControl = this.creationForm.get('skills');
    if (!skillsControl) return;

    const skills = [...skillsControl.value];
    const skillIndex = skills.findIndex((s: any) => s.id === skillId);

    if (skillIndex > -1) {
      skills[skillIndex].isProficient = !skills[skillIndex].isProficient;
      skillsControl.setValue(skills);
      skillsControl.markAsDirty();
    }
  }


  onSubmit(): void {
    if (this.creationForm.invalid) {
      alert("Le formulaire est invalide. Veuillez vérifier que vous avez bien renseigné les deux armes.");
      return;
    }

    const currentUser = this.userService.currentUser;
    if (!currentUser) {
      alert("Utilisateur non connecté.");
      return;
    }

    const formValues = this.creationForm.getRawValue();
    const proficientSkills = formValues.skills
      .filter((skill: any) => skill.isProficient)
      .map((skill: any) => ({ id: skill.id, expert: false }));

    const payload: CustomCharacterCreateRequest = {
      ...formValues,
      userId: currentUser.id,
      skills: proficientSkills,
      spellSlots: {
        slots: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
        slotsUsed: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 }
      }
    };

    this.characterService.createCustomCharacter(payload).subscribe({
      next: (newCharacter) => {
        alert('Personnage créé avec succès !');
        this.router.navigate(['/characters/detail', 'custom', newCharacter.id]);
      },
      error: (err) => {
        console.error("Erreur lors de la création du personnage", err);
        alert("Une erreur est survenue : " + err.message);
      }
    });
  }

  private listenToWisdomChanges(): void {
    const wisdomControl = this.creationForm.get('wisdom');
    if (wisdomControl) {
      wisdomControl.valueChanges.subscribe(() => this.updatePassivePerception());
    }
  }

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
