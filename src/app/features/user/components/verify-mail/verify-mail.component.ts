import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../../services/auth/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-verify-mail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './verify-mail.component.html',
  styleUrl: './verify-mail.component.scss'
})
export class VerifyMailComponent implements OnInit {

  verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  errorMessage?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      const token = params['token'];

      if (token) {
        this.verifyToken(token);
      } else {
        this.verificationStatus = 'error';
        this.errorMessage = "Aucun jeton de vérification n'a été fourni dans l'URL. Le lien est peut-être corrompu.";
      }
    });
  }

  private async verifyToken(token: string): Promise<void> {
    this.verificationStatus = 'loading';

    try {
      const responseMessage = await this.authService.verifyMail(token);

      if (responseMessage === 'Compte vérifié avec succès') {
        this.verificationStatus = 'success';
      } else {
        this.verificationStatus = 'error';
        this.errorMessage = responseMessage;
      }

    } catch (e: any) {
      this.verificationStatus = 'error';
      this.errorMessage = "Une erreur de communication avec le serveur est survenue.";
    }
  }

}
