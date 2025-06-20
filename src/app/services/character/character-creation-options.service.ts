import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Ogl5Race } from '../../core/models/option/race';
import { Ogl5Class } from '../../core/models/option/classe';
import { Background } from '../../core/models/option/background';
import { Skill } from '../../core/models/option/skill';
import { Spell } from '../../core/models/option/spell';
import { Weapon } from '../../core/models/option/weapon';
import { Armor } from '../../core/models/option/armor';
import {environment} from '../../../environments/environment';

export interface CharacterCreationData {
  races: Ogl5Race[];
  classes: Ogl5Class[];
  backgrounds: Background[];
  skills: Skill[];
  spells: Spell[];
  weapons: Weapon[];
  armors: Armor[];
}

@Injectable({
  providedIn: 'root'
})
export class CharacterCreationOptionsService {

  constructor(private http: HttpClient) { }

  getAllSpells() {

  }

  /**
   * Charge toutes les données nécessaires à la création de personnage en un seul appel.
   */
  loadAllCreationData(): Observable<CharacterCreationData> {
    return forkJoin({
      races: this.http.get<Ogl5Race[]>(`${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/races`),
      classes: this.http.get<Ogl5Class[]>(`${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/classes`),
      backgrounds: this.http.get<Background[]>(`${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/backgrounds`),
      skills: this.http.get<Skill[]>(`${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/skills`),
      spells: this.http.get<Spell[]>(`${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/spells`),
      weapons: this.http.get<Weapon[]>(`${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/weapons`),
      armors: this.http.get<Armor[]>(`${environment.API_URL}${environment.API_RESOURCES.CHARACTER_OPTIONS}/armors`),
    });
  }
}
