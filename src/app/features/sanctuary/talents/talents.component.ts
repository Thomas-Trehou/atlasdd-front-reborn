import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Talent} from '../../../core/front-models/Talents';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-talents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './talents.component.html',
  styleUrl: './talents.component.scss'
})
export class TalentsComponent implements OnInit {
  talents: Talent[] = [];
  filteredTalents: Talent[] = [];
  selectedTalent: Talent | null = null;
  searchTerm: string = '';

  // Pour sauvegarder les choix de l'utilisateur
  selectedChoices: { [talentName: string]: string[] } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Talent[]>('assets/data/talents.json').subscribe({
      next: (data) => {
        this.talents = data;
        this.filteredTalents = [...data];

        // Initialiser les choix sélectionnés
        this.talents.forEach(talent => {
          this.selectedChoices[talent.name] = [];
        });
      },
      error: (err) => console.error('Erreur lors du chargement des talents:', err)
    });
  }

  selectTalent(talent: Talent): void {
    this.selectedTalent = talent;
  }

  clearSelection(): void {
    this.selectedTalent = null;
  }

  toggleChoiceSelection(talentName: string, choice: string): void {
    if (!this.selectedChoices[talentName]) {
      this.selectedChoices[talentName] = [];
    }

    const index = this.selectedChoices[talentName].indexOf(choice);
    if (index === -1) {
      this.selectedChoices[talentName].push(choice);
    } else {
      this.selectedChoices[talentName].splice(index, 1);
    }
  }

  isChoiceSelected(talentName: string, choice: string): boolean {
    return this.selectedChoices[talentName]?.includes(choice) || false;
  }

  searchTalents(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;

    if (!term) {
      this.filteredTalents = [...this.talents];
      return;
    }

    this.filteredTalents = this.talents.filter(
      talent => talent.name.toLowerCase().includes(term) ||
        talent.description.toLowerCase().includes(term) ||
        talent.choices.some(choice => choice.toLowerCase().includes(term))
    );
  }

  // Compter combien de choix sont sélectionnés pour un talent
  countSelectedChoices(talentName: string): number {
    return this.selectedChoices[talentName]?.length || 0;
  }
}
