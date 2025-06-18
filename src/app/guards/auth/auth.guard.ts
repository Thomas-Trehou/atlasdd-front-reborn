import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.token) return true;

  try {
    await authService.checkLocalStorageToken();

    if (authService.token) {
      return true;
    }

    return router.navigate(['/user/login']);

  } catch (error) {
    console.error('Auth Guard Error:', error); // Optionnel : pour le débogage
    return router.navigate(['/user/login']);
  }
};


