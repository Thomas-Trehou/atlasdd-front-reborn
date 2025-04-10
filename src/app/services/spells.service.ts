import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Spell } from '../core/models/option/spell';


@Injectable({
  providedIn: 'root'
})
export class SpellsService {
  private apiUrl = 'http://localhost:8080/character-creation-options/spells';
  private cachedSpells: Spell[] | null = null;

  constructor(private http: HttpClient) { }

  getAllSpells(): Observable<Spell[]> {
    return this.http.get<Spell[]>(this.apiUrl);
  }

  // Utilise getAllSpells pour trouver un sort par son ID
  findSpellById(id: number): Observable<Spell | undefined> {
    return this.getAllSpells().pipe(
      map(spells => spells.find(spell => spell.id === id))
    );
  }

  // Utilise getAllSpells pour filtrer par classe
  findSpellsByClass(className: string): Observable<Spell[]> {
    return this.getAllSpells().pipe(
      map(spells => spells.filter(spell =>
        spell.classes.toLowerCase().includes(className.toLowerCase())
      ))
    );
  }

  // Utilise getAllSpells pour rechercher des sorts
  searchSpells(query: string): Observable<Spell[]> {
    const searchTerm = query.toLowerCase();
    return this.getAllSpells().pipe(
      map(spells => spells.filter(spell =>
        spell.name.toLowerCase().includes(searchTerm) ||
        spell.description.toLowerCase().includes(searchTerm)
      ))
    );
  }

  // Utilise getAllSpells pour filtrer par niveau
  findSpellsByLevel(level: string): Observable<Spell[]> {
    return this.getAllSpells().pipe(
      map(spells => spells.filter(spell => spell.level === level))
    );
  }
}
