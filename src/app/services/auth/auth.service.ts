import { Injectable } from '@angular/core';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../user/user.service';
import {environment} from '../../../environments/environment.development';
import {SignInRequest, UserLight, UserLightAuth} from '../../core/models/user/user';
import {lastValueFrom, map, tap} from 'rxjs';

interface LoginHttp {
  token: string;
}

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

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    const obs = this.http
      .get<UserLight>(this.url + '/profile', { headers })
      .pipe(
        tap(response => {
          this.userService.currentUser = response;
        }),
        map(() => undefined)
      );
    return lastValueFrom(obs);
  }

  logout(): void {
    this.token = undefined;
    this.userService.currentUser = undefined;
    this.localStorageService.removeItem(environment.LOCAL_STORAGE.TOKEN);
  }
}

