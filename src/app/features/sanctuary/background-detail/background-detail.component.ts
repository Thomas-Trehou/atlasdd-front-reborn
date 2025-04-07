import {Component, OnInit, signal} from '@angular/core';
import {ContentType} from '../../../core/utils/ContentType';
import {ActivatedRoute} from '@angular/router';
import {ContentCardComponent} from '../../../shared/content-card/content-card.component';

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
      const index = Number(params['id']); // Convertit en nombre
      fetch('/assets/data/backgrounds.json')
        .then(response => response.json())
        .then(backgroundsData => {
          this.content.set(backgroundsData[index]);
        });
    });
  }
}
