import {BaseDto} from '../base';
import {Spell} from './spell';

interface ClassDto extends BaseDto{

  name: string;
  hitDice: string;
  startingHitPoints: number;
  startingEquipment: string;
  classSpells: Spell[];
}

export type ClassCreateRequest = Omit<ClassDto, 'id' | 'createdAt' | 'updatedAt' | 'classSpells'>;

export type Ogl5Class = ClassDto;

export type CustomClass = Omit<ClassDto, 'classSpells'>;
