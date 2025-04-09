// content-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GameContent,
  RaceContent,
  BackgroundContent,
  ClassContent,
  isRaceContent,
  isBackgroundContent,
  isClassContent
} from '../../core/front-models/GameContent';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-content-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-card.component.html',
})
export class ContentCardComponent {
  @Input() content!: () => GameContent;
  @Input() contentTypeValue?: 'race' | 'background' | 'class' | 'unknown';
  private openSpecChoices: boolean[] = [];

  isSpecChoiceOpen(index: number): boolean {
    return this.openSpecChoices[index] === true;
  }

  toggleSpecChoice(index: number): void {
    this.openSpecChoices[index] = !this.openSpecChoices[index];
  }

  // Vérifier si le content est défini avant utilisation
  safeContent(): GameContent {
    if (!this.content) {
      console.warn("Content non défini");
      // Retourner un objet vide avec les propriétés minimales nécessaires
      return {
        imageUrl: '',
        alt: '',
        aria: '',
        name: '',
        description: ''
      } as GameContent;
    }

    // Vérifier si this.content est une fonction avant de l'appeler
    if (typeof this.content === 'function') {
      return this.content();
    } else {
      // Si this.content est déjà un objet GameContent, le retourner directement
      return this.content as GameContent;
    }
  }


  contentType(): 'race' | 'background' | 'class' | 'unknown' {
    if (this.contentTypeValue) {
      return this.contentTypeValue;
    }

    if (!this.content) {
      return 'unknown';
    }

    const currentContent = this.safeContent();

    if (isRaceContent(currentContent)) {
      return 'race';
    } else if (isBackgroundContent(currentContent)) {
      return 'background';
    } else if (isClassContent(currentContent)) {
      return 'class';
    }

    return 'unknown';
  }

  getRaceContent(): RaceContent | null {
    const content = this.safeContent();
    return isRaceContent(content) ? content : null;
  }


  // Helpers pour la partie Class
  getClassContent(): ClassContent | null {
    const content = this.safeContent();
    return isClassContent(content) ? content : null;
  }

  // Helpers pour la partie Background
  getBackgroundContent(): BackgroundContent | null {
    const content = this.safeContent();
    return isBackgroundContent(content) ? content : null;
  }


  protected readonly isRaceContent = isRaceContent;
  protected readonly isBackgroundContent = isBackgroundContent;
  protected readonly isClassContent = isClassContent;

}
