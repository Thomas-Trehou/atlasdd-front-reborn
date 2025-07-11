import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  message?: string;
  isError = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.message = undefined;
    this.isError = false;

    try {
      // On récupère le message directement depuis la réponse de l'API
      const successMessage = await this.userService.forgotPassword(this.forgotPasswordForm.value);
      this.message = successMessage;
    } catch (error: any) {
      // Pour la sécurité, on affiche un message générique en cas d'erreur (ex: 400, 500)
      // qui est volontairement le même que celui du succès pour ne pas révéler d'information.
      this.message = "Si un utilisateur avec cet e-mail existe, un lien de réinitialisation a été envoyé.";
      console.error("Erreur lors de la demande de réinitialisation", error);
    } finally {
      this.isLoading = false;
    }
  }
}
