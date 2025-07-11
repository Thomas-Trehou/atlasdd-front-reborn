import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'
import { Campaign, CampaignCard, CampaignCreateUpdateRequest } from '../../core/models/campaign/campaign';
import { Note, NoteCreateRequest } from '../../core/models/note';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = `${environment.API_URL}/campaigns`;
  private noteApiUrl = `${environment.API_URL}/campaign-notes`;

  constructor(private http: HttpClient) {}

  // == REQUÊTES POUR LES CAMPAGNES ==

  /** POST: Crée une nouvelle campagne */
  createCampaign(campaign: CampaignCreateUpdateRequest): Observable<Campaign> {
    return this.http.post<Campaign>(this.apiUrl, campaign);
  }

  /** GET: Récupère toutes les campagnes d'un utilisateur */
  getCampaignsForUser(userId: number): Observable<CampaignCard[]> {
    return this.http.get<CampaignCard[]>(`${this.apiUrl}/users/${userId}`);
  }

  /** GET: Récupère une campagne par son ID */
  getCampaignById(campaignId: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/${campaignId}`);
  }

  /** PATCH: Met à jour les informations générales d'une campagne */
  updateCampaign(campaignId: number, campaignUpdate: CampaignCreateUpdateRequest): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.apiUrl}/${campaignId}`, campaignUpdate);
  }

  /** DELETE: Supprime une campagne */
  deleteCampaign(campaignId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${campaignId}`);
  }

  // == GESTION DES JOUEURS ==

  /** PATCH: Ajoute un joueur à une campagne */
  addPlayerToCampaign(campaignId: number, userId: number): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.apiUrl}/${campaignId}/add-player/${userId}`, {});
  }

  /** PATCH: Retire un joueur d'une campagne */
  removePlayerFromCampaign(campaignId: number, userId: number): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.apiUrl}/${campaignId}/remove-player/${userId}`, {});
  }

  // == GESTION DES PERSONNAGES ==

  /** POST: Ajoute un personnage OGL5 à une campagne */
  addOgl5Character(campaignId: number, characterId: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${campaignId}/add-ogl5-character/${characterId}`, {});
  }

  /** DELETE: Retire un personnage OGL5 d'une campagne */
  removeOgl5Character(campaignId: number, characterId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${campaignId}/remove-ogl5-character/${characterId}`);
  }

  /** POST: Ajoute un personnage Custom à une campagne */
  addCustomCharacter(campaignId: number, characterId: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.apiUrl}/${campaignId}/add-custom-character/${characterId}`, {});
  }

  /** DELETE: Retire un personnage Custom d'une campagne */
  removeCustomCharacter(campaignId: number, characterId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${campaignId}/remove-custom-character/${characterId}`);
  }

  // == GESTION DES NOTES DE CAMPAGNE ==

  /** GET: Récupère les notes d'un utilisateur pour une campagne */
  getNotesForCampaign(campaignId: number, userId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.noteApiUrl}/campaigns/${campaignId}/users/${userId}`);
  }

  /** POST: Ajoute une note à une campagne pour un utilisateur */
  addNoteToCampaign(campaignId: number, userId: number, note: NoteCreateRequest): Observable<Note> {
    return this.http.post<Note>(`${this.noteApiUrl}/campaigns/${campaignId}/users/${userId}`, note);
  }

  /** PATCH: Met à jour une note */
  updateNote(noteId: number, note: Partial<NoteCreateRequest>): Observable<Note> {
    return this.http.patch<Note>(`${this.noteApiUrl}/${noteId}`, note);
  }

  /** DELETE: Supprime une note */
  deleteNote(noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.noteApiUrl}/${noteId}`);
  }
}
