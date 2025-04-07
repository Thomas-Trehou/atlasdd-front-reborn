import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContentCardComponent} from '../../../shared/content-card/content-card.component';
import {ContentType} from '../../../core/utils/ContentType';

@Component({
  selector: 'app-race-detail',
  imports: [
    ContentCardComponent
  ],
  templateUrl: './race-detail.component.html',
  styleUrl: './race-detail.component.scss'
})
export class RaceDetailComponent implements OnInit {
  content = signal<any>(null);
  contentType = signal<ContentType>('race');

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const index = Number(params['id']); // Convertit en nombre
      fetch('/assets/data/races.json')
        .then(response => response.json())
        .then(racesData => {
          this.content.set(racesData[index]);
        });
    });
  }
}




