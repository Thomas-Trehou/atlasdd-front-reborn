import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ContentPreview} from '../../../core/front-models/GameContentLight';
import {Router} from '@angular/router';
import {map} from 'rxjs';
import {ContentPreviewComponent} from '../../../shared/content-preview/content-preview.component';

@Component({
  selector: 'app-backgrounds',
  standalone: true,
  imports: [CommonModule, ContentPreviewComponent],
  templateUrl: './backgrounds.component.html',
  styleUrl: './backgrounds.component.scss'
})
export class BackgroundsComponent implements OnInit {
  backgrounds: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    fetch('/assets/data/backgrounds.json')
      .then(response => response.json())
      .then(data => {
        this.backgrounds = data;
      });
  }

  navigateToDetail(index: number) {  // On utilise l'index au lieu d'un id
    this.router.navigate(['/sanctuary/backgrounds', index]);
  }
}

