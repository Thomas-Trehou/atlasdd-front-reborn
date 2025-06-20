import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterCardComponent } from '../../../shared/character-card/character-card.component';
import { CharacterCardModel } from '../../../core/models/character/character-card';
import { CharacterService } from '../../../services/character/character.service';
import { Router } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit {
  ogl5Characters: CharacterCardModel[] = [];
  customCharacters: CharacterCardModel[] = [];

  visibleOgl5Characters: CharacterCardModel[] = [];
  visibleCustomCharacters: CharacterCardModel[] = [];

  showAllOgl5 = false;
  showAllCustom = false;

  loading = true;
  error: string | null = null;
  isEditMode = false;

  readonly initialDisplayCount = 8;

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    this.error = null;
    this.characterService.getAllCharacters()
      .pipe(
        catchError(error => {
          this.error = 'Impossible de charger vos personnages. Veuillez réessayer.';
          console.error('Erreur lors du chargement des personnages:', error);
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (allCharacters) => {
          const sortByDate = (a: CharacterCardModel, b: CharacterCardModel) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

          this.ogl5Characters = allCharacters
            .filter(c => c.type === 'ogl5')
            .sort(sortByDate);

          this.customCharacters = allCharacters
            .filter(c => c.type === 'custom')
            .sort(sortByDate);

          this.visibleOgl5Characters = this.ogl5Characters.slice(0, this.initialDisplayCount);
          this.visibleCustomCharacters = this.customCharacters.slice(0, this.initialDisplayCount);
        }
      });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  handleDeleteCharacter(characterId: number, characterType: 'ogl5' | 'custom'): void {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer ce personnage ? Cette action est irréversible.');

    if (confirmation) {
      // Il n'est plus nécessaire de chercher le personnage, nous connaissons son type !
      this.error = null;

      const deleteRequest = characterType === 'ogl5'
        ? this.characterService.deleteOgl5Character(characterId)
        : this.characterService.deleteCustomCharacter(characterId);

      deleteRequest.subscribe({
        next: () => {
          // La logique de mise à jour des listes reste la même
          if (characterType === 'ogl5') {
            this.ogl5Characters = this.ogl5Characters.filter(c => c.id !== characterId);
            this.visibleOgl5Characters = this.visibleOgl5Characters.filter(c => c.id !== characterId);
          } else {
            this.customCharacters = this.customCharacters.filter(c => c.id !== characterId);
            this.visibleCustomCharacters = this.visibleCustomCharacters.filter(c => c.id !== characterId);
          }
        },
        error: (err) => {
          this.error = `Erreur lors de la suppression du personnage. Veuillez réessayer.`;
          console.error('Erreur de suppression:', err);
        }
      });
    }
  }

  showMoreOgl5(): void {
    this.showAllOgl5 = true;
    this.visibleOgl5Characters = this.ogl5Characters;
  }

  showMoreCustom(): void {
    this.showAllCustom = true;
    this.visibleCustomCharacters = this.customCharacters;
  }

  navigateToDetail(id: number, type: 'ogl5' | 'custom'): void {
    if (this.isEditMode) return;
    this.router.navigate(['/characters/detail', type, id]);
  }

  navigateToCreateOgl5(): void {
    this.router.navigate(['/characters/create/ogl5']);
  }

  navigateToCreateCustom(): void {
    this.router.navigate(['/characters/create/custom']);
  }
}
