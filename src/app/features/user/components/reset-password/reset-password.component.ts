// src/app/features/user/components/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  message?: string;
  isError = false;
  showPassword = false;
  showPasswordConfirm = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).*$')
      ]],
      passwordConfirm: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.isError = true;
      this.message = "Token de réinitialisation manquant ou invalide. Veuillez refaire une demande.";
    }
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    return password && passwordConfirm && password.value === passwordConfirm.value ? null : { mismatch: true };
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid || !this.token) {
      return;
    }

    this.isLoading = true;
    this.message = undefined;
    this.isError = false;

    try {
      const payload = {
        token: this.token,
        newPassword: this.resetPasswordForm.value.password
      };
      // MODIFIÉ: La méthode retourne maintenant le message de succès.
      const successMessage = await this.userService.resetPassword(payload);
      this.message = successMessage; // On utilise directement le message de l'API.

      setTimeout(() => this.router.navigate(['/user/login']), 3000);
    } catch (error: any) {
      this.isError = true;
      this.message = error.error?.message || "Une erreur est survenue. Le token est peut-être expiré.";
      console.error("Erreur lors de la réinitialisation", error);
    } finally {
      this.isLoading = false;
    }
  }
}
