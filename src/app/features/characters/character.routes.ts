import {Routes} from '@angular/router';
import {CharacterListComponent} from './character-list/character-list.component';
import {CharacterDetailComponent} from './character-detail/character-detail.component';
import {
  Ogl5CharacterCreationComponent
} from './character-creation/ogl5-character-creation/ogl5-character-creation.component';
import {
  CustomCharacterCreationComponent
} from './character-creation/custom-character-creation/custom-character-creation.component';

export const CHARACTER_ROUTES: Routes = [
  {path: 'list', component: CharacterListComponent},
  { path: 'create/ogl5', component: Ogl5CharacterCreationComponent },
  { path: 'create/custom', component: CustomCharacterCreationComponent},
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
