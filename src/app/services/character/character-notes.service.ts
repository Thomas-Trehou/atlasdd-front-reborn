import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Note, NoteCreateRequest} from '../../core/models/note';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterNoteService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  // Méthode modifiée pour prendre en compte le type de personnage
  getCharacterNotes(characterId: number, characterType: 'ogl5' | 'custom'): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/character-notes/${characterType}/characters/${characterId}`);
  }

  // Méthode modifiée pour prendre en compte le type de personnage
  saveCharacterNotes(characterId: number, note: NoteCreateRequest, characterType: 'ogl5' | 'custom'): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/character-notes/${characterType}/characters/${characterId}`, note);
  }

  // Ces méthodes restent inchangées car les routes sont simples
  updateCharacterNote(noteId: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/character-notes/${noteId}`, note);
  }

  deleteCharacterNote(noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/character-notes/${noteId}`);
  }
}
