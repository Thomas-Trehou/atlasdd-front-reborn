import { Injectable } from '@angular/core';
import {UserLight} from '../../core/models/user/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser?: UserLight

  private url: string;

  constructor( private http: HttpClient) {
    this.url = "http://localhost:8080";
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  async getUserFriends(userId: number): Promise<UserLight[]> {
    const headers = this.getAuthHeaders();
    const options = { headers };

    const endpoint = `${this.url}/users/${userId}/friends`;
    const obs = this.http.get<UserLight[]>(endpoint, options);
    return lastValueFrom(obs);
  }


}
