import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si le token est déjà en mémoire, autoriser l'accès
  if (authService.token) return true;

  // Essayer de récupérer le token du localStorage
  await authService.checkLocalStorageToken();

  // Vérifier à nouveau si le token est présent
  if (authService.token) return true;

  // Rediriger vers la page de connexion
  return router.navigate(['/signin']);
};

