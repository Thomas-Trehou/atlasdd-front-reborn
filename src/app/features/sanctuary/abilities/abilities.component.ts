import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ability} from '../../../core/front-models/Ability';

@Component({
  selector: 'app-abilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abilities.component.html',
  styleUrl: './abilities.component.scss'
})
export class AbilitiesComponent implements OnInit {
  abilities: Ability[] = [];
  expandedSkills: Record<string, boolean> = {};

  ngOnInit() {
    fetch('/assets/data/abilities.json')
      .then(response => response.json())
      .then(data => {
        this.abilities = data;
      });
  }

  toggleSkill(abilityIndex: string, skillIndex: string): void {
    const key = `${abilityIndex}-${skillIndex}`;
    this.expandedSkills[key] = !this.expandedSkills[key];
  }

  isSkillExpanded(abilityIndex: string, skillIndex: string): boolean {
    const key = `${abilityIndex}-${skillIndex}`;
    return !!this.expandedSkills[key];
  }
}


