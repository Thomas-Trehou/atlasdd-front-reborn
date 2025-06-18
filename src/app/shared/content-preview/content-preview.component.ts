import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-content-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-preview.component.html',
  styleUrl: './content-preview.component.scss'
})
export class ContentPreviewComponent {
  @Input() items: any[] = [];
  @Input() routePrefix: string = '';
  // Modifier pour émettre une chaîne (l'index textuel) au lieu d'un nombre
  @Output() itemSelected = new EventEmitter<string>();

  // Modifier pour prendre l'item complet ou son index textuel
  onSelect(item: any) {
    // Si item est l'élément complet
    if (typeof item === 'object' && item.index) {
      this.itemSelected.emit(item.index);
    }
    // Si item est l'index textuel directement
    else if (typeof item === 'string') {
      this.itemSelected.emit(item);
    }
    // Rétrocompatibilité avec l'ancienne approche si nécessaire
    else if (typeof item === 'number') {
      // Récupérer l'index textuel à partir de l'index numérique
      const selectedItem = this.items[item];
      if (selectedItem && selectedItem.index) {
        this.itemSelected.emit(selectedItem.index);
      }
    }
  }
}


