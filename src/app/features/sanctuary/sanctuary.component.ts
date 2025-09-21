import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContentPreviewComponent } from '../../shared/content-preview/content-preview.component';

interface NavigationItem {
  name: string;
  path: string;
  imageUrl: string;
  alt: string;
  aria: string;
}

@Component({
  selector: 'app-sanctuary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sanctuary.component.html'
})
export class SanctuaryComponent {
  sanctuaryOptions: NavigationItem[] = [
    {
      name: 'Classes',
      path: '/sanctuary/classes',
      imageUrl: 'assets/images/sanctuary/classes-logo-2.webp',
      alt: 'Classes de personnages de D&D',
      aria: 'Naviguer vers les classes'
    },
    {
      name: 'Races',
      path: '/sanctuary/races',
      imageUrl: 'assets/images/sanctuary/races-logo-2.webp',
      alt: 'Différentes races de D&D',
      aria: 'Naviguer vers les races'
    },
    {
      name: 'Historiques et Origines',
      path: '/sanctuary/backgrounds',
      imageUrl: 'assets/images/sanctuary/background-logo.webp',
      alt: 'Historiques de personnages',
      aria: 'Naviguer vers les historiques'
    },
    {
      name: 'Caractéristiques et Abilités',
      path: '/sanctuary/abilities',
      imageUrl: 'assets/images/sanctuary/caracteristiques-logo.webp',
      alt: 'Les Armures',
      aria: 'Naviguer vers les armures et bouclier'
    },
    {
      name: 'Armes et Propriétés',
      path: '/sanctuary/weapons',
      imageUrl: 'assets/images/sanctuary/equipements-logo.webp',
      alt: 'Les Armes ',
      aria: 'Naviguer vers les armes'
    },
    {
      name: 'Armures et Bouclier',
      path: '/sanctuary/armors',
      imageUrl: 'assets/images/sanctuary/equipements-logo-2.webp',
      alt: 'Les Armures',
      aria: 'Naviguer vers les armures et bouclier'
    },
    {
      name: 'Conditions',
      path: '/sanctuary/conditions',
      imageUrl: 'assets/images/sanctuary/alterations-logo.webp',
      alt: 'Altérations d\'état et conditions',
      aria: 'Naviguer vers les conditions et altérations d\'état'
    },
    {
      name: 'Dons',
      path: '/sanctuary/talents',
      imageUrl: 'assets/images/sanctuary/dons-logo-2.webp',
      alt: 'Talents et compétences spéciales',
      aria: 'Naviguer vers les talents'
    },
    {
      name: 'Sorts',
      path: '/sanctuary/spells',
      imageUrl: 'assets/images/sanctuary/sorts-logo-3.webp',
      alt: 'Les sorts',
      aria: 'Naviguer vers les sorts'
    }
  ];

  constructor(private router: Router) {}

  onSelect(item: NavigationItem): void {
    this.router.navigate([item.path]);
  }
}
