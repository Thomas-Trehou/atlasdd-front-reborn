import {BaseDto} from '../base';
import {ShieldType} from '../../enums/shield-type';
import {Alignment} from '../../enums/alignment';
import {UserLight} from '../user/user';
import {Ogl5Race} from '../option/race';
import {Background} from '../option/background';
import {Ogl5Class} from '../option/classe';
import {Skill} from '../option/skill';
import {Spell} from '../option/spell';
import {Weapon} from '../option/weapon';
import {Armor} from '../option/armor';
import {SpellSlots} from './spell-slots';

interface Ogl5CharacterDto extends BaseDto {

  name: string;
  level: number;
  experience: number;
  armorClass: number;
  initiative: number;
  inspiration: number;
  hitPoints: number;
  maxHitPoints: number;
  bonusHitPoints: number;
  speed: number;
  passivePerception: number;

  shield: ShieldType;

  twoWeaponsFighting: boolean;

  alignment: Alignment;

  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  strengthSavingThrowBonus: number;
  dexteritySavingThrowBonus: number;
  constitutionSavingThrowBonus: number;
  intelligenceSavingThrowBonus: number;
  wisdomSavingThrowBonus: number;
  charismaSavingThrowBonus: number;

  status: string;

  spellSlots: SpellSlots;

  owner: UserLight;
  userId: number;

  race: Ogl5Race;
  raceId: number;

  background: Background;
  backgroundId: number;

  classe: Ogl5Class;
  classId: number;

  skills: Skill[];
  skillIds: number[];

  preparedSpells: Spell[];
  preparedSpellIds: number[];

  weapons: Weapon[];
  weaponIds: number[];

  armor: Armor;
  armorId: number;
}

export type Ogl5CharacterCreateRequest = Omit<Ogl5CharacterDto, 'id' | 'createdAt' | 'updatedAt' | 'owner' | 'race' | 'background' | 'classe' | 'skills' | 'preparedSpells' | 'weapons' | 'armor'>;

export type Ogl5CharacterUpdateRequest = Omit<Ogl5CharacterDto, 'createdAt' | 'updatedAt' | 'owner' | 'race' | 'background' | 'classe' | 'skillIds' | 'preparedSpells' | 'weapons' | 'armor'>;

export type Ogl5Character = Omit<Ogl5CharacterDto, 'userId' | 'raceId' | 'backgroundId' | 'classId' | 'skillIds' | 'preparedSpellIds' | 'weaponIds' | 'armorId'>;

export type Ogl5CharacterCard = Pick<Ogl5CharacterDto, 'id' | 'name' | 'level' | 'classe' | 'race' |'status'>
