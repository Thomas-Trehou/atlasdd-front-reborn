import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CharacterCardComponent} from '../../../shared/character-card/character-card.component';
import {CharacterCardModel} from '../../../core/models/character/character-card';
import {CharacterService} from '../../../services/character/character.service';
import {Router} from '@angular/router';
import {catchError, of} from 'rxjs';

@Component({
  selector: 'app-character-list',
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit {
  characters: CharacterCardModel[] = [];
  loading = true;
  error: string | null = null;

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
        })
      )
      .subscribe({
        next: (characters) => {
          this.characters = characters;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  navigateToDetail(id: number, type: 'ogl5' | 'custom'): void {
    this.router.navigate(['/characters', type, id]);
  }

  navigateToCreateOgl5(): void {
    this.router.navigate(['/characters/create/ogl5']);
  }

  navigateToCreateCustom(): void {
    this.router.navigate(['/characters/create/custom']);
  }
}

