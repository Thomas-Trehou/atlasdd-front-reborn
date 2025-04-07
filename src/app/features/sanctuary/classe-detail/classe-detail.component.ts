import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContentType} from '../../../core/utils/ContentType';
import {ContentCardComponent} from '../../../shared/content-card/content-card.component';

@Component({
  selector: 'app-classe-detail',
  imports: [
    ContentCardComponent
  ],
  templateUrl: './classe-detail.component.html',
  styleUrl: './classe-detail.component.scss'
})
export class ClasseDetailComponent implements OnInit {
  content = signal<any>(null);
  contentType = signal<ContentType>('class');

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const index = Number(params['id']); // Convertit en nombre
      fetch('/assets/data/classes.json')
        .then(response => response.json())
        .then(classesData => {
          this.content.set(classesData[index]);
        });
    });
  }
}
