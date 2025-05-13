import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CharacterCardModel} from '../../core/models/character/character-card';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-character-card',
  imports: [
    NgClass
  ],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss'
})
export class CharacterCardComponent {
  @Input() character!: CharacterCardModel;

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
}


