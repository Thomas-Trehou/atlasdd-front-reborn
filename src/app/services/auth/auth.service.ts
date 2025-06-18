import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment.development';
import {SignInRequest, UserCreateRequest, UserLight, UserLightAuth} from '../../core/models/user/user';
import { lastValueFrom, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token?: string;
  private url: string;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {
    this.url = environment.API_URL + environment.API_RESOURCES.USERS;
  }

  async checkLocalStorageToken(): Promise<void> {
    const tokenLocalStorage = this.localStorageService.getItem(environment.LOCAL_STORAGE.TOKEN);
    if (tokenLocalStorage) {
      this.token = tokenLocalStorage;
      await this.refreshUserProfile();
    }
  }

  async login(email: string, password: string): Promise<void> {
    const obs = this.http
      .post<UserLightAuth>(this.url + '/signin', { email, password } as SignInRequest)
      .pipe(
        tap(response => {
          this.token = response.token;
          this.localStorageService.setItem(environment.LOCAL_STORAGE.TOKEN, response.token);
          this.userService.currentUser = response;
        }),
        map(() => undefined)
      );
    return lastValueFrom(obs);
  }

  async refreshUserProfile(): Promise<void> {
    if (!this.token) throw new Error('Aucun jeton de connexion');

    const obs = this.http
      .get<UserLight>(this.url + '/me')
      .pipe(
        tap(response => {
          this.userService.currentUser = response;
        }),
        map(() => undefined)
      );

    try {
      await lastValueFrom(obs);
    } catch (error) {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        console.warn('Token invalide ou expiré. Déconnexion...');
        this.logout();
      }
      throw error;
    }
  }

  logout(): void {
    this.token = undefined;
    this.userService.currentUser = undefined;
    this.localStorageService.clear();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async signup(pseudo: string, slug: string, email: string, password: string): Promise<void> {
    const obs = this.http
      .post<UserLight>(this.url + '/signup', {
        pseudo,
        slug,
        email,
        password
      } as UserCreateRequest)
      .pipe(
        map(() => undefined) // On ne stocke pas de token car l'utilisateur n'est pas encore vérifié
      );

    return lastValueFrom(obs);
  }

  async verifyMail(token: string): Promise<string> {
    const finalUrl = this.url + '/verify?token=' + token;
    console.log('%cSERVICE: Tentative d\'appel réseau à l\'URL :', 'color: orange; font-weight: bold;', finalUrl);
    return lastValueFrom(this.http.get(finalUrl, { responseType: 'text' }));
  }

}
