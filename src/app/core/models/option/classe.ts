import {BaseDto} from '../base';
import {Spell} from './spell';
import {SpellcasterType} from '../../enums/SpellcasterType';

interface ClassDto extends BaseDto{

  name: string;
  spellcasterType: SpellcasterType;
  spellcastingAbility: string;
  hitDice: string;
  startingHitPoints: number;
  startingEquipment: string;
  classSpells: Spell[];
}

export type ClassCreateRequest = Omit<ClassDto, 'id' | 'createdAt' | 'updatedAt' | 'classSpells'>;

export type Ogl5Class = Omit<ClassDto , 'spellcasterType' | 'spellcastingAbility'>;

export type CustomClass = Omit<ClassDto, 'classSpells'>;
