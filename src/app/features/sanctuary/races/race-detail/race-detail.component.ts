import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContentCardComponent} from '../../../../shared/content-card/content-card.component';
import {ContentType} from '../../../../core/utils/ContentType';

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
      const raceIndex = params['id']; // Récupère l'index textuel (pas besoin de conversion)

      fetch('/assets/data/races.json')
        .then(response => response.json())
        .then(racesData => {
          // Trouve la race dont l'index correspond à celui dans l'URL
          const raceContent = racesData.find((race: any) => race.index === raceIndex);

          if (raceContent) {
            this.content.set(raceContent);
          } else {
            // Gestion d'erreur si la race n'est pas trouvée
            console.error(`Race avec l'index "${raceIndex}" non trouvée`);
            // Option: rediriger vers la liste des races ou une page d'erreur
          }
        });
    });
  }
}





