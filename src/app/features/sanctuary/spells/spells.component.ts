// src/app/features/sanctuary/spells/spells.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpellsService } from '../../../services/spells.service';
import { Spell } from '../../../core/models/option/spell';
import { SpellCardComponent } from './spell-card/spell-card.component';

@Component({
  selector: 'app-spells',
  standalone: true,
  imports: [CommonModule, FormsModule, SpellCardComponent],
  templateUrl: './spells.component.html',
  styleUrls: ['./spells.component.scss']
})
export class SpellsComponent implements OnInit {
  spells: Spell[] = [];
  filteredSpells: Spell[] = [];
  searchQuery: string = '';
  selectedClass: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Liste des classes disponibles pour le filtre
  classes: string[] = ['Barde', 'Clerc', 'Druide', 'Ensorceleur', 'Magicien', 'Occultiste', 'Paladin', 'Rôdeur'];

  // Niveaux de sorts pour le filtre
  spellLevels: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  selectedLevel: string = '';

  constructor(private spellsService: SpellsService) { }

  ngOnInit(): void {
    this.loadAllSpells();
  }

  loadAllSpells(): void {
    this.isLoading = true;
    this.spellsService.getAllSpells().subscribe({
      next: (data) => {
        this.spells = data;
        this.filteredSpells = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Impossible de charger les sorts. Veuillez réessayer plus tard.";
        this.isLoading = false;
        console.error('Erreur lors du chargement des sorts :', error);
      }
    });
  }

  filterByClass(className: string): void {
    this.selectedClass = className;
    this.applyFilters();
  }

  filterByLevel(level: string): void {
    this.selectedLevel = level;
    this.applyFilters();
  }

  searchSpells(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.isLoading = true;

    // Commencer avec tous les sorts
    let result = [...this.spells];

    // Appliquer le filtre de recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(spell =>
        spell.name.toLowerCase().includes(query) ||
        spell.description.toLowerCase().includes(query)
      );
    }

    // Appliquer le filtre de classe
    if (this.selectedClass) {
      result = result.filter(spell =>
        spell.classes.toLowerCase().includes(this.selectedClass.toLowerCase())
      );
    }

    // Appliquer le filtre de niveau
    if (this.selectedLevel) {
      result = result.filter(spell => spell.level === this.selectedLevel);
    }

    this.filteredSpells = result;
    this.isLoading = false;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedClass = '';
    this.selectedLevel = '';
    this.filteredSpells = this.spells;
  }
}
