import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Ogl5CharacterCard} from '../../../../core/models/character/ogl5-character';
import {CustomCharacterCard} from '../../../../core/models/character/custom-character';
import {CampaignService} from '../../../../services/campaign/campaign.service';

@Component({
  selector: 'app-select-character-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-character-modal.component.html',
  styleUrls: ['./select-character-modal.component.scss']
})
export class SelectCharacterModalComponent {
  // --- Entrées (données reçues du parent) ---
  @Input() campaignId!: number;
  @Input() availableOglChars: Ogl5CharacterCard[] = [];
  @Input() availableCustomChars: CustomCharacterCard[] = [];

  // --- Sorties (événements envoyés au parent) ---
  @Output() closeModal = new EventEmitter<void>();
  @Output() characterAdded = new EventEmitter<void>();

  // --- État interne de la modale ---
  step: 'typeSelection' | 'characterSelection' = 'typeSelection';
  selectedType: 'ogl5' | 'custom' | null = null;
  selectedCharacterId: number | null = null;
  isAdding = false;

  constructor(private campaignService: CampaignService) {}

  /**
   * Passe à l'étape de sélection du personnage après le choix du type.
   */
  selectCharacterType(type: 'ogl5' | 'custom'): void {
    this.selectedType = type;
    this.step = 'characterSelection';
  }

  /**
   * Met à jour l'ID du personnage sélectionné dans la liste déroulante.
   */
  onCharacterSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCharacterId = Number(selectElement.value);
  }

  /**
   * Confirme l'ajout du personnage sélectionné à la campagne.
   */
  confirmSelection(): void {
    if (!this.selectedCharacterId || !this.selectedType || this.isAdding) {
      return;
    }

    this.isAdding = true;
    const addObs$ = this.selectedType === 'ogl5'
      ? this.campaignService.addOgl5Character(this.campaignId, this.selectedCharacterId)
      : this.campaignService.addCustomCharacter(this.campaignId, this.selectedCharacterId);

    addObs$.subscribe({
      next: () => {
        alert('Personnage ajouté avec succès !');
        this.isAdding = false;
        this.characterAdded.emit(); // Notifie le parent que l'ajout est terminé
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout du personnage", err);
        alert("Une erreur est survenue.");
        this.isAdding = false;
      }
    });
  }

  /**
   * Ferme la modale et réinitialise son état.
   */
  close(): void {
    this.closeModal.emit();
    // Réinitialise l'état pour la prochaine ouverture
    setTimeout(() => {
      this.step = 'typeSelection';
      this.selectedType = null;
      this.selectedCharacterId = null;
    }, 300); // Délai pour l'animation de fermeture
  }
}
