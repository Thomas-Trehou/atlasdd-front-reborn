// src/app/features/sanctuary/spells/spell-card/spell-card.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Spell } from '../../../../core/models/option/spell';

@Component({
  selector: 'app-spell-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spell-card.component.html',
  styleUrls: ['./spell-card.component.scss']
})
export class SpellCardComponent {
  @Input() spell!: Spell;
  isExpanded: boolean = false;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  getSpellLevelText(spell: Spell): string {
    if (spell.level === '0') {
      return `Sortilège de ${spell.school}`;
    }
    return `Niveau ${spell.level} - ${spell.school}`;
  }

  getClassesArray(classesString: string): string[] {
    return classesString.split(', ').filter(c => c !== 'Aucun' && c !== '');
  }
}
