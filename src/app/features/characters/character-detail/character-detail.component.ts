import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ogl5CharacterSheetComponent } from './ogl5-character-sheet/ogl5-character-sheet.component';
//import { CustomCharacterSheetComponent } from './custom-character-sheet/custom-character-sheet.component';
import { CharacterNotesComponent } from './character-notes/character-notes.component';
import { Ogl5Character } from '../../../core/models/character/ogl5-character';
import { CustomCharacter } from '../../../core/models/character/custom-character';
import { Note } from '../../../core/models/note';
import { CharacterService } from '../../../services/character/character.service';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import {CharacterNoteService} from '../../../services/character/character-notes.service';
import {CustomCharacterSheetComponent} from './custom-character-sheet/custom-character-sheet.component';
import {ArmorCategory} from '../../../core/enums/armor-category';
import {UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [
    CommonModule,
    Ogl5CharacterSheetComponent,
    CustomCharacterSheetComponent,
    CharacterNotesComponent
  ],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent implements OnInit {
  characterId!: number;
  characterType: 'ogl5' | 'custom';
  character?: any;
  notes: Note[] = [];
  isLoading: boolean = true;
  loadError: boolean = false;
  private currentUserId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterService,
    private characterNoteService: CharacterNoteService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    const currentUser = this.userService.currentUser;
    if (!currentUser) {
      console.error("Accès non autorisé : utilisateur non connecté.");
      this.router.navigate(['/login']); // Redirige si pas connecté
      return;
    }
    this.currentUserId = currentUser.id;

    // Récupérer le type de personnage depuis les paramètres d'URL
    const typeParam = this.route.snapshot.paramMap.get('type');
    this.characterId = +this.route.snapshot.paramMap.get('id')!;

    if (typeParam !== 'ogl5' && typeParam !== 'custom') {
      console.error('Type de personnage non valide:', typeParam);
      // Rediriger vers la liste ou afficher une erreur
      this.loadError = true;
      this.isLoading = false;
      return;
    }

    this.characterType = typeParam;
    this.loadCharacterByType();
    this.loadNotes();
  }

  // NOUVEAU: Getter pour déterminer si l'utilisateur est le propriétaire
  /**
   * Vérifie si l'utilisateur actuellement connecté est le propriétaire du personnage affiché.
   * @returns {boolean} True si l'utilisateur est le propriétaire, sinon false.
   */
  get isOwner(): boolean {
    // On vérifie que toutes les données nécessaires sont chargées avant de comparer
    if (!this.character || !this.currentUserId) {
      return false;
    }
    return this.character.owner.id === this.currentUserId;
  }

  private loadCharacterByType(): void {
    let characterObs: Observable<any>;

    if (this.characterType === 'ogl5') {
      characterObs = this.characterService.getOgl5CharacterById(this.characterId);
    } else {
      characterObs = this.characterService.getCustomCharacterById(this.characterId);
    }

    characterObs.subscribe({
      next: (character) => {
        this.character = character;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du personnage', err);
        this.isLoading = false;
        this.loadError = true;
      }
    });
  }

  private loadNotes(): void {
    if (!this.characterType) {
      console.error('Type de personnage non défini');
      return;
    }

    this.characterNoteService.getCharacterNotes(this.characterId, this.characterType).subscribe({
      next: (notes) => {
        this.notes = notes;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notes', err);
      }
    });
  }


  get isOgl5(): boolean {
    return this.characterType === 'ogl5';
  }

  onCharacterUpdated(updatedCharacter: any): void {
    this.character = updatedCharacter;
  }



  onNotesUpdated(updatedNotes: Note[]): void {
    this.notes = updatedNotes;
  }
}
