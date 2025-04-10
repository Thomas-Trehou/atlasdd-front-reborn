import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Armor } from '../../../core/front-models/Armors';

@Component({
  selector: 'app-armors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './armors.component.html',
  styleUrl: './armors.component.scss'
})
export class ArmorsComponent implements OnInit {
  armors: Armor[] = [];
  filteredArmors: Armor[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Armor[]>('assets/data/armors.json').subscribe({
      next: (data) => {
        this.armors = data;
        this.filteredArmors = data;
        this.extractCategories();
      },
      error: (err) => console.error('Erreur lors du chargement des armures:', err)
    });
  }

  extractCategories(): void {
    this.categories = [...new Set(this.armors.map(armor => armor.armor_category))];
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;

    if (category === null) {
      this.filteredArmors = this.armors;
    } else {
      this.filteredArmors = this.armors.filter(armor => armor.armor_category === category);
    }
  }
}

