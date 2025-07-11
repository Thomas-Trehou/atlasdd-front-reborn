import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {authGuard} from './guards/auth/auth.guard';
import {VerifyComponent} from './pages/verify/verify.component';

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
    path: 'verify-info',
    component: VerifyComponent
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
  },
  {
    path: 'sanctuary',
    loadChildren: () => import('./features/sanctuary/sanctuary.routes').then(m => m.SANCTUARY_ROUTES)
  },
  {
    path: 'characters',
    loadChildren: () => import('./features/characters/character.routes').then(m => m.CHARACTER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'campaigns',
    loadChildren: () => import('./features/campaigns/campaign.routes').then(m => m.CAMPAIGN_ROUTES),
    canActivate: [authGuard]
  }
];



