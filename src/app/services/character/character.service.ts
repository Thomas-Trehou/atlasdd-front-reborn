import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, forkJoin, map, throwError} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import {CharacterCardModel} from '../../core/models/character/character-card';
import {
  Ogl5Character,
  Ogl5CharacterCard,
  Ogl5CharacterCreateRequest,
  Ogl5CharacterUpdateRequest
} from '../../core/models/character/ogl5-character';
import {
  CustomCharacter,
  CustomCharacterCard,
  CustomCharacterUpdateRequest
} from '../../core/models/character/custom-character';
import {Skill} from '../../core/models/option/skill';
import {Armor} from '../../core/models/option/armor';
import {Weapon} from '../../core/models/option/weapon';


@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {}

  /**
   * Récupère tous les personnages (OGL5 et Custom) du joueur connecté
   * @returns Observable avec un tableau de CharacterCardModel
   */
  getAllCharacters(): Observable<CharacterCardModel[]> {
    // Obtient l'ID de l'utilisateur connecté à partir du service utilisateur
    const currentUser = this.userService.currentUser;

    if (!currentUser || !currentUser.id) {
      return throwError(() => new Error('Utilisateur non connecté ou ID utilisateur manquant'));
    }

    const userId = currentUser.id;

    return forkJoin({
      ogl5: this.getOgl5Characters(userId),
      custom: this.getCustomCharacters(userId)
    }).pipe(
      map(results => {
        // Transforme les résultats en CharacterCardModel avec le type approprié
        const ogl5Characters = results.ogl5.map(char => ({
          id: char.id,
          name: char.name,
          level: char.level,
          // Convertit l'objet classe en chaîne de caractères (nom de la classe)
          classe: typeof char.classe === 'string' ? char.classe : char.classe.name || 'Inconnu',
          // Convertit l'objet race en chaîne de caractères (nom de la race)
          race: typeof char.race === 'string' ? char.race : char.race.name || 'Inconnu',
          status: char.status,
          updatedAt:char.updatedAt,
          type: 'ogl5' as const
        }));

        const customCharacters = results.custom.map(char => ({
          id: char.id,
          name: char.name,
          level: char.level,
          // Convertit l'objet classe en chaîne de caractères (nom de la classe)
          classe: typeof char.classe === 'string' ? char.classe : char.classe.name || 'Inconnu',
          // Convertit l'objet race en chaîne de caractères (nom de la race)
          race: typeof char.race === 'string' ? char.race : char.race.name || 'Inconnu',
          status: char.status,
          updatedAt:char.updatedAt,
          type: 'custom' as const
        }));

        // Combine les deux tableaux
        return [...ogl5Characters, ...customCharacters] as CharacterCardModel[];
      })
    );
  }

  /**
   * Récupère les personnages OGL5 d'un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Observable avec un tableau de Ogl5CharacterCard
   */
  getOgl5Characters(userId: number): Observable<Ogl5CharacterCard[]> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.OGL5_CHARACTER}/users/${userId}`;
    return this.http.get<Ogl5CharacterCard[]>(url);
  }

  /**
   * Récupère les personnages Custom d'un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Observable avec un tableau de CustomCharacterCard
   */
  getCustomCharacters(userId: number): Observable<CustomCharacterCard[]> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.CUSTOMS_CHARACTER}/users/${userId}`;
    return this.http.get<CustomCharacterCard[]>(url);
  }

  /**
   * Récupère un personnage OGL5 complet par son ID
   * @param characterId ID du personnage
   * @returns Observable avec les détails du personnage OGL5
   */
  getOgl5CharacterById(characterId: number): Observable<Ogl5Character> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.OGL5_CHARACTER}/${characterId}`;
    return this.http.get<Ogl5Character>(url);
  }

  /**
   * Récupère un personnage Custom complet par son ID
   * @param characterId ID du personnage
   * @returns Observable avec les détails du personnage Custom
   */
  getCustomCharacterById(characterId: number): Observable<CustomCharacter> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.CUSTOMS_CHARACTER}/${characterId}`;
    return this.http.get<CustomCharacter>(url);
  }

  updateOgl5Character(characterId: number, character: Ogl5CharacterUpdateRequest): Observable<Ogl5Character> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.OGL5_CHARACTER}/${characterId}`;
    return this.http.patch<Ogl5Character>(url, character);
  }

  updateCustomCharacter(characterId: number, character: CustomCharacterUpdateRequest): Observable<CustomCharacter> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.CUSTOMS_CHARACTER}/${characterId}`;
    return this.http.patch<CustomCharacter>(url, character);
  }

  getAllSkills(): Observable<Skill[]> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/skills`;
    return this.http.get<Skill[]>(url);
  }

  getAllArmors(): Observable<Armor[]> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/armors`;
    return this.http.get<Armor[]>(url);
  }

  getAllWeapons(): Observable<Weapon[]> {
    const url = `${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/weapons`;
    return this.http.get<Weapon[]>(url)
  }

  /**
   * Crée une nouvelle fiche de personnage OGL5.
   */
  createOgl5Character(characterData: Ogl5CharacterCreateRequest): Observable<Ogl5Character> {
    return this.http.post<Ogl5Character>(`${environment.API_URL}${environment.API_RESOURCES.OGL5_CHARACTER}`, characterData); // Adaptez l'endpoint de création
  }

  /**
   * Crée une nouvelle fiche de personnage OGL5.
   */
  deleteOgl5Character(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL}${environment.API_RESOURCES.OGL5_CHARACTER}/${id}`);
  }



  /**
   * Récupère un personnage par son ID et son type
   * @param characterId ID du personnage
   * @param type Type du personnage ('ogl5' ou 'custom')
   * @returns Observable avec les détails du personnage
   */
  getCharacterById(characterId: number, type: 'ogl5' | 'custom'): Observable<any> {
    if (type === 'ogl5') {
      return this.getOgl5CharacterById(characterId);
    } else {
      return this.getCustomCharacterById(characterId);
    }
  }
}
