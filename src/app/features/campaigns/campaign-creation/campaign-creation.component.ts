import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {CampaignService} from '../../../services/campaign/campaign.service';
import {UserService} from '../../../services/user/user.service';
import {CampaignCreateUpdateRequest} from '../../../core/models/campaign/campaign';

@Component({
  selector: 'app-campaign-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './campaign-creation.component.html',
  styleUrl: './campaign-creation.component.scss'
})
export class CampaignCreationComponent implements OnInit {
  campaignForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.campaignForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(75)]],
      description: ['', [Validators.required, Validators.maxLength(350)]]
    });
  }

  onSubmit(): void {
    if (this.campaignForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const currentUser = this.userService.currentUser;
    if (!currentUser || !currentUser.id) {
      console.error("Utilisateur non connecté");
      this.isSubmitting = false;
      return;
    }

    const request: CampaignCreateUpdateRequest = {
      ...this.campaignForm.value,
      gameMasterId: currentUser.id
    };

    this.campaignService.createCampaign(request).subscribe({
      next: (newCampaign) => {
        this.router.navigate(['/campaigns', newCampaign.id]);
      },
      error: (err) => {
        console.error("Erreur lors de la création de la campagne", err);
        this.isSubmitting = false;
        // Optionnel: afficher un message d'erreur à l'utilisateur
      }
    });
  }
}
