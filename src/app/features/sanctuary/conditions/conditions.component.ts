import {Component, OnInit} from '@angular/core';
import {Condition} from '../../../core/front-models/Conditions';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-conditions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conditions.component.html',
  styleUrl: './conditions.component.scss'
})
export class ConditionsComponent implements OnInit {
  conditions: Condition[] = [];
  selectedCondition: Condition | null = null;
  searchTerm: string = '';
  filteredConditions: Condition[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Condition[]>('assets/data/conditions.json').subscribe({
      next: (data) => {
        this.conditions = data;
        this.filteredConditions = data;
      },
      error: (err) => console.error('Erreur lors du chargement des altérations d\'état:', err)
    });
  }

  selectCondition(condition: Condition): void {
    this.selectedCondition = condition;
  }

  clearSelection(): void {
    this.selectedCondition = null;
  }

  searchConditions(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;

    if (!term) {
      this.filteredConditions = this.conditions;
      return;
    }

    this.filteredConditions = this.conditions.filter(
      condition => condition.name.toLowerCase().includes(term) ||
        condition.description.toLowerCase().includes(term)
    );
  }
}

