// src/app/features/campaigns/campaign-detail/campaign-detail.component.ts

import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CampaignNotesComponent} from '../campaign-notes/campaign-notes.component';
import {Campaign, CampaignCreateUpdateRequest} from '../../../core/models/campaign/campaign';
import {CampaignService} from '../../../services/campaign/campaign.service';
import {UserService} from '../../../services/user/user.service';
import {UserLight} from '../../../core/models/user/user';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CampaignNotesComponent],
  templateUrl: './campaign-detail.component.html',
  styleUrl: './campaign-detail.component.scss'
})
export class CampaignDetailComponent implements OnInit, OnDestroy {
  campaign?: Campaign;
  campaignForm!: FormGroup;
  isEditMode = false;
  isLoading = true;
  currentUserId!: number;
  isGameMaster = false;

  /** Liste des amis qui ne sont pas encore dans la campagne. */
  availableFriends: UserLight[] = [];
  /** ID de l'ami sélectionné dans la liste déroulante pour l'ajout. */
  selectedFriendIdToAdd: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUser;
    if (!currentUser) {
      console.error("Utilisateur non connecté.");
      this.router.navigate(['/login']);
      return;
    }
    this.currentUserId = currentUser.id;

    const campaignIdParam = this.route.snapshot.paramMap.get('id');
    if (campaignIdParam) {
      this.loadCampaign(Number(campaignIdParam));
    } else {
      this.isLoading = false;
      console.error("ID de campagne manquant dans l'URL");
      this.router.navigate(['/campaigns']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCampaign(id: number): void {
    this.isLoading = true;
    this.campaignService.getCampaignById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (campaign) => {
          this.campaign = campaign;
          this.isGameMaster = this.campaign.gameMaster.id === this.currentUserId;
          this.initForm();
          this.isLoading = false;

          if (this.isGameMaster) {
            this.loadAvailableFriends();
          }
        },
        error: (err) => {
          console.error("Erreur lors du chargement de la campagne", err);
          this.isLoading = false;
          this.router.navigate(['/campaigns']);
        }
      });
  }

  async loadAvailableFriends(): Promise<void> {
    if (!this.campaign) return;

    try {
      const allFriends = await this.userService.getUserFriends(this.currentUserId);
      const playerIds = new Set(this.campaign.campaignPlayers.map(p => p.id));
      this.availableFriends = allFriends.filter(friend => !playerIds.has(friend.id));
    } catch (error) {
      console.error("Erreur lors de la récupération des amis", error);
      this.availableFriends = [];
    }
  }

  initForm(): void {
    if (!this.campaign) return;
    this.campaignForm = this.fb.group({
      name: [this.campaign.name, Validators.required],
      description: [this.campaign.description, Validators.required],
      gameMasterId: [this.campaign.gameMaster.id, Validators.required],
    });
    this.campaignForm.disable();
  }

  enterEditMode(): void {
    this.isEditMode = true;
    this.campaignForm.enable();
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.initForm();
  }

  saveChanges(): void {
    if (!this.campaignForm.valid || !this.campaign) return;

    const updateRequest: CampaignCreateUpdateRequest = this.campaignForm.getRawValue();

    this.campaignService.updateCampaign(this.campaign.id, updateRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedCampaign => {
        this.campaign = updatedCampaign;
        this.isGameMaster = this.campaign.gameMaster.id === this.currentUserId;
        this.isEditMode = false;
        this.initForm();
        alert('Modifications enregistrées avec succès !');
      });
  }

  deleteCampaign(): void {
    if (this.campaign && confirm("Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible.")) {
      this.campaignService.deleteCampaign(this.campaign.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          alert('Campagne supprimée.');
          this.router.navigate(['/campaigns']);
        });
    }
  }

  /**
   * Gère le changement de sélection dans la liste déroulante des amis.
   * @param event L'événement DOM du changement.
   */
  onFriendSelected(event: Event): void {
    // On indique à TypeScript que la cible de cet événement est un élément <select>
    const selectElement = event.target as HTMLSelectElement;
    // On récupère la valeur et on la convertit en nombre
    this.selectedFriendIdToAdd = Number(selectElement.value);
  }

  addPlayer(): void {
    if (!this.selectedFriendIdToAdd || !this.campaign) return;

    this.campaignService.addPlayerToCampaign(this.campaign.id, this.selectedFriendIdToAdd)
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedCampaign => {
        this.campaign = updatedCampaign;
        this.selectedFriendIdToAdd = null; // Réinitialiser la sélection
        this.loadAvailableFriends(); // Mettre à jour la liste des amis disponibles
        alert('Joueur ajouté avec succès !');
      });
  }

  removePlayer(playerId: number): void {
    if (!this.campaign || !confirm('Voulez-vous vraiment retirer ce joueur de la campagne ?')) return;

    this.campaignService.removePlayerFromCampaign(this.campaign.id, playerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedCampaign => {
        this.campaign = updatedCampaign;
        this.loadAvailableFriends(); // Mettre à jour la liste des amis disponibles
        alert('Joueur retiré avec succès !');
      });
  }
}
