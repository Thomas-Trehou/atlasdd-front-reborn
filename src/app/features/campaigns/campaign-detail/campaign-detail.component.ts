// src/app/features/campaigns/campaign-detail/campaign-detail.component.ts

import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CampaignNotesComponent} from '../campaign-notes/campaign-notes.component';
// MODIFICATION: Plus besoin d'importer Ogl5Character et CustomCharacter ici
import {Campaign, CampaignCreateUpdateRequest} from '../../../core/models/campaign/campaign';
import {CampaignService} from '../../../services/campaign/campaign.service';
import {UserService} from '../../../services/user/user.service';
import {UserLight} from '../../../core/models/user/user';
import {forkJoin, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { SelectCharacterModalComponent} from './select-character-modal/select-character-modal.component';
import {CharacterService} from '../../../services/character/character.service';
import {Ogl5CharacterCard} from '../../../core/models/character/ogl5-character';
import {CustomCharacterCard} from '../../../core/models/character/custom-character';

// SUPPRESSION: Le type unifié n'est plus nécessaire
// type UnifiedCharacter = (Ogl5Character | CustomCharacter) & { type: 'ogl' | 'custom' };

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CampaignNotesComponent, SelectCharacterModalComponent],
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
  availableFriends: UserLight[] = [];
  selectedFriendIdToAdd: number | null = null;
  private destroy$ = new Subject<void>();

  isModalOpen = false;
  userAvailableOglChars: Ogl5CharacterCard[] = [];
  userAvailableCustomChars: CustomCharacterCard[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UserService,
    private characterService: CharacterService
  ) {}

  /**
   * MODIFICATION: La méthode est ré-implémentée pour utiliser les méthodes existantes du service.
   * Ouvre la modale après avoir récupéré et filtré les personnages de l'utilisateur.
   */
  openCharacterModal(): void {
    if (!this.campaign) return;

    // 1. On récupère les IDs des personnages DÉJÀ dans la campagne
    const campaignOglCharIds = new Set(this.campaign.campaignOgl5CharacterSheets.map(c => c.id));
    const campaignCustomCharIds = new Set(this.campaign.campaignCustomCharacterSheets.map(c => c.id));

    // 2. On appelle le service pour récupérer TOUS les personnages de l'utilisateur
    forkJoin({
      ogl: this.characterService.getOgl5Characters(this.currentUserId),
      custom: this.characterService.getCustomCharacters(this.currentUserId)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (results) => {
        // 3. On filtre les listes pour ne garder que les personnages qui ne sont pas dans la campagne
        this.userAvailableOglChars = results.ogl.filter(
          char => !campaignOglCharIds.has(char.id)
        );
        this.userAvailableCustomChars = results.custom.filter(
          char => !campaignCustomCharIds.has(char.id)
        );

        // 4. On ouvre la modale avec les listes filtrées
        this.isModalOpen = true;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des personnages disponibles", err);
        alert("Impossible de charger vos personnages disponibles.");
      }
    });
  }

  /**
   * Ferme la modale.
   */
  onModalClose(): void {
    this.isModalOpen = false;
  }

  /**
   * Gère l'événement après l'ajout d'un personnage.
   * Ferme la modale et rafraîchit les données de la campagne.
   */
  onCharacterAdded(): void {
    this.isModalOpen = false;
    if (this.campaign) {
      this.loadCampaign(this.campaign.id); // Recharge les données pour voir le nouveau personnage
    }
  }

  /**
   * Détermine si l'utilisateur actuel (s'il est joueur) peut ajouter un personnage.
   * (Logique : un joueur ne peut avoir qu'un seul personnage à la fois, peu importe son type).
   */
  get canAddCharacter(): boolean {
    if (!this.campaign || this.isGameMaster) {
      return false;
    }
    // MODIFICATION: On vérifie si l'ID du joueur est présent dans l'une OU l'autre des listes.
    const hasOglChar = this.campaign.campaignOgl5CharacterSheets.some(c => c.owner.id === this.currentUserId);
    const hasCustomChar = this.campaign.campaignCustomCharacterSheets.some(c => c.owner.id === this.currentUserId);

    // Le joueur peut ajouter un personnage s'il n'en a ni OGL, ni Custom.
    return !hasOglChar && !hasCustomChar;
  }

  // ... (le reste du fichier ngOnInit, ngOnDestroy, loadCampaign, etc. reste identique)
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
          campaign.campaignOgl5CharacterSheets = campaign.campaignOgl5CharacterSheets || [];
          campaign.campaignCustomCharacterSheets = campaign.campaignCustomCharacterSheets || [];
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

  onFriendSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
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

  removeCharacter(characterId: number, characterType: 'ogl5' | 'custom'): void {
    if (!this.campaign || !confirm('Voulez-vous vraiment retirer ce personnage de la campagne ?')) {
      return;
    }

    const removeObs$ = characterType === 'ogl5'
      ? this.campaignService.removeOgl5Character(this.campaign.id, characterId)
      : this.campaignService.removeCustomCharacter(this.campaign.id, characterId);

    removeObs$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        alert('Personnage retiré avec succès.');
        this.loadCampaign(this.campaign!.id);
      },
      error: (err) => {
        console.error("Erreur lors du retrait du personnage", err);
        alert("Une erreur est survenue.");
      }
    });
  }

  navigateToAddCharacter(): void {
    if (!this.campaign) return;
    this.router.navigate(['/characters/select-for-campaign', this.campaign.id]);
    alert("Redirection vers la page de sélection de personnage (à implémenter).");
  }
}
