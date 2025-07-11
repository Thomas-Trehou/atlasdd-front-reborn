import { Injectable } from '@angular/core';
import {ForgotPasswordRequest, ResetPasswordRequest, UserLight, UserUpdateRequest} from '../../core/models/user/user';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom, map} from 'rxjs';
import { environment } from '../../../environments/environment';
import {Invitation} from '../../core/models/user/invitation';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser?: UserLight;
  private userUrl: string;
  private invitationUrl: string;

  constructor(private http: HttpClient) {
    this.userUrl = environment.API_URL + environment.API_RESOURCES.USERS;
    this.invitationUrl = environment.API_URL + environment.API_RESOURCES.FRIENDS_INVITES;
  }

  /**
   * NOUVEAU: Met à jour le profil d'un utilisateur (pseudo ou mot de passe).
   * @param userId L'ID de l'utilisateur à mettre à jour.
   * @param payload Les données à mettre à jour (ex: { pseudo: 'nouveau' } ou { password: '...' }).
   * @returns L'objet UserLight mis à jour.
   */
  async updateUserProfile(userId: number, payload: UserUpdateRequest): Promise<UserLight> {
    const endpoint = `${this.userUrl}/${userId}/profile`;
    // On utilise PATCH car c'est une mise à jour partielle.
    const obs = this.http.patch<UserLight>(endpoint, payload);
    return lastValueFrom(obs);
  }

  async getUserFriends(userId: number): Promise<UserLight[]> {
    // Plus besoin d'ajouter les headers manuellement, l'intercepteur s'en charge
    const endpoint = `${this.userUrl}/${userId}/friends`;
    const obs = this.http.get<UserLight[]>(endpoint);
    return lastValueFrom(obs);
  }

  /**
   * Recherche un utilisateur par son slug.
   */
  async searchUserBySlug(slug: string): Promise<UserLight> {
    // L'endpoint exact peut varier selon votre configuration API
    const endpoint = `${this.userUrl}/search/${slug}`;
    return lastValueFrom(this.http.get<UserLight>(endpoint));
  }

  /**
   * Envoie une invitation d'ami.
   */
  async sendFriendInvitation(senderId: number, receiverId: number): Promise<void> {
    const endpoint = `${this.invitationUrl}/${senderId}/to/${receiverId}`;
    return lastValueFrom(this.http.post<void>(endpoint, {}));
  }

  /**
   * Récupère toutes les invitations en attente pour l'utilisateur courant.
   */
  async getPendingInvitations(userId: number): Promise<Invitation[]> {
    // Cet endpoint est une supposition basée sur votre besoin
    const endpoint = `${this.invitationUrl}/${userId}/pending`;
    return lastValueFrom(this.http.get<Invitation[]>(endpoint));
  }

  /**
   * Accepte une invitation d'ami.
   */
  async acceptInvitation(invitationId: number, accepterId: number): Promise<void> {
    const endpoint = `${this.invitationUrl}/${invitationId}/accept/${accepterId}`;
    return lastValueFrom(this.http.patch<void>(endpoint, {}));
  }

  /**
   * Refuse une invitation d'ami.
   */
  async declineInvitation(invitationId: number, declinerId: number): Promise<void> {
    const endpoint = `${this.invitationUrl}/${invitationId}/decline/${declinerId}`;
    return lastValueFrom(this.http.delete<void>(endpoint));
  }

  /**
   * Annule une invitation envoyée.
   */
  async cancelInvitation(invitationId: number, senderId: number): Promise<void> {
    const endpoint = `${this.invitationUrl}/${invitationId}/cancel/${senderId}`;
    return lastValueFrom(this.http.delete<void>(endpoint));
  }

  /**
   * Envoie une demande de réinitialisation de mot de passe.
   * @param payload L'objet contenant l'email de l'utilisateur.
   * @returns Une promesse avec le message de succès de l'API.
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<string> {
    const endpoint = `${this.userUrl}/forgot-password`;
    const obs = this.http.post(endpoint, payload, { responseType: 'text' });
    return lastValueFrom(obs);
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur avec un token.
   * @param payload L'objet contenant le token et le nouveau mot de passe.
   * @returns Une promesse avec le message de succès de l'API.
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<string> { // MODIFIÉ: Le type de retour est maintenant Promise<string>
    const endpoint = `${this.userUrl}/reset-password`;
    const obs = this.http.post(endpoint, payload, { responseType: 'text' });
    return lastValueFrom(obs);
  }

}
