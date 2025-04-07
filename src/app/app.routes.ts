import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'user',  // Déplacé dans son propre chemin
    loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
  },
  {
    path: 'sanctuary',
    loadChildren: () => import('./features/sanctuary/sanctuary.routes').then(m => m.SANCTUARY_ROUTES)
  }
];



