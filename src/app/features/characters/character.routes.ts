import {Routes} from '@angular/router';
import {CharacterListComponent} from './character-list/character-list.component';
import {CharacterDetailComponent} from './character-detail/character-detail.component';

export const CHARACTER_ROUTES: Routes = [
  {path: 'list', component: CharacterListComponent},
  {
    path: 'detail/:type/:id',
    component: CharacterDetailComponent
  },
  {
    path: 'detail/:id',
    redirectTo: 'list',
    pathMatch: 'full'
  }
]
