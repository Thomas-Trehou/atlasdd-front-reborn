import {Component, EventEmitter, Input, Output} from '@angular/core'; // <-- Ajout de EventEmitter et Output
import {CharacterCardModel} from '../../core/models/character/character-card';
import {NgClass, NgIf} from '@angular/common'; // <-- Ajout de NgIf pour le bouton

@Component({
  selector: 'app-character-card',
  standalone: true, // Assurez-vous que c'est bien standalone
  imports: [
    NgClass,
    NgIf // <-- Ajout de NgIf aux imports
  ],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss'
})
export class CharacterCardComponent {
  @Input() character!: CharacterCardModel;
  @Input() editMode = false; // <-- NOUVEAU : Reçoit l'état du composant parent
  @Output() deleteRequest = new EventEmitter<number>(); // <-- NOUVEAU : Émet un événement vers le parent

  getStatusLabel(status: string): string {
    switch (status) {
      case 'VIVANT':
        return 'Vivant';
      case 'MORT':
        return 'Mort';
      default:
        return status;
    }
  }

  // NOUVELLE MÉTHODE appelée par le clic sur le bouton supprimer
  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation(); // Très important: empêche la navigation en cliquant sur le bouton
    this.deleteRequest.emit(this.character.id); // Émet l'ID du personnage
  }
}
