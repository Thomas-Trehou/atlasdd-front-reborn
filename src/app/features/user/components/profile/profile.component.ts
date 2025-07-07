import {Component, OnInit, ViewChild} from '@angular/core';
import {UserLight} from '../../../../core/models/user/user';
import {UserService} from '../../../../services/user/user.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CustomDatePipe} from '../../../../core/utils/DatePipe';
import {SearchFriendsComponent} from '../search-friends/search-friends.component';
import {ManageInvitationsComponent} from '../manage-invitations/manage-invitations.component';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf,
    CustomDatePipe,
    NgForOf,
    RouterLink,
    SearchFriendsComponent,
    ManageInvitationsComponent,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  @ViewChild(ManageInvitationsComponent) manageInvitationsComponent!: ManageInvitationsComponent;

  user?: UserLight;
  userFriends: UserLight[] = [];
  loading: boolean = false;
  errorMessage?: string;

  isEditMode = false;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  updateError?: string;

  // NOUVEAU: Propriétés pour gérer l'affichage des mots de passe
  showPassword = false;
  showPasswordConfirm = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  // ... (le reste du fichier .ts est inchangé, il n'y a rien d'autre à ajouter ici)
  ngOnInit(): void {
    this.user = this.userService.currentUser;
    if (!this.user) {
      this.router.navigate(['/user/login']);
      return;
    }
    this.loadUserFriends();
    this.initForms();
  }

  private initForms(): void {
    if (!this.user) return;

    this.profileForm = this.fb.group({
      pseudo: [this.user.pseudo, [
        Validators.required,
        Validators.maxLength(35),
        Validators.pattern('^[a-zA-Z0-9_-]*$')
      ]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).*$')
      ]],
      passwordConfirm: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    if (password && passwordConfirm && password.value !== passwordConfirm.value) {
      return { mismatch: true };
    }
    return null;
  }

  enterEditMode(): void {
    this.isEditMode = true;
    this.updateError = undefined;
    this.profileForm.patchValue({ pseudo: this.user?.pseudo });
    this.passwordForm.reset();
  }

  cancelEdit(): void {
    this.isEditMode = false;
  }

  async saveProfile(): Promise<void> {
    if (!this.user || this.profileForm.invalid) return;

    this.updateError = undefined;
    const { pseudo } = this.profileForm.value;

    try {
      const updatedUser = await this.userService.updateUserProfile(this.user.id, { pseudo });
      this.user = updatedUser;
      this.userService.currentUser = updatedUser; // Mettre à jour l'utilisateur dans le service
      this.isEditMode = false;
      alert('Pseudo mis à jour avec succès !');
    } catch (error: any) {
      this.updateError = error.error?.message || 'Erreur lors de la mise à jour du pseudo.';
      console.error(error);
    }
  }

  async savePassword(): Promise<void> {
    if (!this.user || this.passwordForm.invalid) return;

    this.updateError = undefined;
    const { password } = this.passwordForm.value;

    try {
      await this.userService.updateUserProfile(this.user.id, { password });
      this.isEditMode = false;
      alert('Mot de passe mis à jour avec succès !');
    } catch (error: any) {
      this.updateError = error.error?.message || 'Erreur lors de la mise à jour du mot de passe.';
      console.error(error);
    }
  }

  async loadUserFriends(): Promise<void> {
    if (!this.user?.id) return;

    try {
      this.loading = true;
      this.userFriends = await this.userService.getUserFriends(this.user.id);
    } catch (error) {
      console.error('Erreur lors du chargement des amis:', error);
      this.errorMessage = 'Impossible de charger la liste des amis';
    } finally {
      this.loading = false;
    }
  }

  onInvitationsChanged(): void {
    if (this.manageInvitationsComponent) {
      this.manageInvitationsComponent.loadInvitations();
    }
  }
}
