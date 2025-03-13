import {BaseDto} from '../base';
import {Spell} from './spell';

interface RaceDto extends BaseDto {

  name: string;
  speed: string;
  languages: string;
  traits: string;
  strengthBonus: number;
  dexterityBonus: number;
  constitutionBonus: number;
  intelligenceBonus: number;
  wisdomBonus: number;
  charismaBonus: number;
  raceSpells: Spell[];
}

export type RaceCreateRequest = Pick<RaceDto, 'name' | 'speed' | 'languages' | 'traits'>;

export type Ogl5Race = RaceDto;

export type CustomRace = Pick<RaceDto,'id' | 'name' | 'speed' | 'languages' | 'traits' | 'createdAt' | 'updatedAt'>;
