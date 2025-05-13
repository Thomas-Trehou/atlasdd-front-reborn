// guards/auth/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { environment } from '../../../environments/environment.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);

  // Récupération du token depuis le localStorage
  const token = localStorageService.getItem(environment.LOCAL_STORAGE.TOKEN);

  // Si un token existe, l'ajouter à l'en-tête d'autorisation
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
