import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
import {ContentPreviewComponent} from '../../../shared/content-preview/content-preview.component';

@Component({
  selector: 'app-races',
  standalone: true,
  imports: [CommonModule, ContentPreviewComponent],
  templateUrl: './races.component.html',
  styleUrl: './races.component.scss'
})
export class RacesComponent implements OnInit {
  races: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    fetch('/assets/data/races.json')
      .then(response => response.json())
      .then(data => {
        this.races = data;
      });
  }

  navigateToDetail(index: string) {  // On utilise l'index au lieu d'un id
    this.router.navigate(['/sanctuary/races', index]);
  }
}


