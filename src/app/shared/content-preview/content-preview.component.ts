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
  @Output() itemSelected = new EventEmitter<number>();  // On émet l'index

  onSelect(index: number) {
    this.itemSelected.emit(index);
  }
}

