import { Injectable } from '@angular/core';
import { UserLight } from '../../core/models/user/user';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser?: UserLight;
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.API_URL + environment.API_RESOURCES.USERS;
  }

  async getUserFriends(userId: number): Promise<UserLight[]> {
    // Plus besoin d'ajouter les headers manuellement, l'intercepteur s'en charge
    const endpoint = `${this.url}/${userId}/friends`;
    const obs = this.http.get<UserLight[]>(endpoint);
    return lastValueFrom(obs);
  }

  // Vous pouvez ajouter d'autres méthodes ici
  async getUserById(userId: number): Promise<UserLight> {
    const endpoint = `${this.url}/${userId}`;
    const obs = this.http.get<UserLight>(endpoint);
    return lastValueFrom(obs);
  }

  async getCurrentUserFriends(): Promise<UserLight[]> {
    if (!this.currentUser?.id) {
      throw new Error('Aucun utilisateur connecté');
    }
    return this.getUserFriends(this.currentUser.id);
  }
}
