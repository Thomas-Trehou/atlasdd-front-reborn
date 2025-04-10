import {Component, OnInit, signal} from '@angular/core';
import {ContentType} from '../../../../core/utils/ContentType';
import {ActivatedRoute} from '@angular/router';
import {ContentCardComponent} from '../../../../shared/content-card/content-card.component';

@Component({
  selector: 'app-background-detail',
  imports: [
    ContentCardComponent
  ],
  templateUrl: './background-detail.component.html',
  styleUrl: './background-detail.component.scss'
})
export class BackgroundDetailComponent implements OnInit {
  content = signal<any>(null);
  contentType = signal<ContentType>('background');

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const backgroundIndex = params['id']; // Utilise l'index textuel directement
      fetch('/assets/data/backgrounds.json')
        .then(response => response.json())
        .then(backgroundsData => {
          // Recherche du background par son index textuel
          const backgroundContent = backgroundsData.find((bg: any) => bg.index === backgroundIndex);

          if (backgroundContent) {
            this.content.set(backgroundContent);
          } else {
            console.error(`Background avec l'index "${backgroundIndex}" non trouvé`);
            // Option : redirection vers la liste des backgrounds
          }
        });
    });
  }
}

