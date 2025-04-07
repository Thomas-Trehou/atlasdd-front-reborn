import {Routes} from '@angular/router';
import {RacesComponent} from './races/races.component';
import {ClassesComponent} from './classes/classes.component';
import {BackgroundsComponent} from './backgrounds/backgrounds.component';
import {RaceDetailComponent} from './race-detail/race-detail.component';
import {ClasseDetailComponent} from './classe-detail/classe-detail.component';
import {BackgroundDetailComponent} from './background-detail/background-detail.component';

export const SANCTUARY_ROUTES: Routes = [
  { path: 'races', component: RacesComponent },
  { path: 'races/:id', component: RaceDetailComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'classes/:id', component: ClasseDetailComponent },
  { path: 'backgrounds', component: BackgroundsComponent },
  { path: 'backgrounds/:id', component: BackgroundDetailComponent },
];
