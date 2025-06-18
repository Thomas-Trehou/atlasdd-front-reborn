import {Routes} from '@angular/router';
import {SigninComponent} from './components/signin/signin.component';
import {ProfileComponent} from './components/profile/profile.component';
import {authGuard} from '../../guards/auth/auth.guard';
import {SignupComponent} from './components/signup/signup.component';

export const USER_ROUTES: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: SigninComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard]}
];
