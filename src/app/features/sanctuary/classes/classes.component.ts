import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {ContentPreviewComponent} from '../../../shared/content-preview/content-preview.component';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    ContentPreviewComponent
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent implements OnInit {
  classes: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    fetch('/assets/data/classes.json')
      .then(response => response.json())
      .then(data => {
        this.classes = data;
      });
  }

  navigateToDetail(index: string) {  // On utilise l'index au lieu d'un id
    this.router.navigate(['/sanctuary/classes', index]);
  }
}

