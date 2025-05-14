import {BaseDto} from '../base';
import {ShieldType} from '../../enums/shield-type';
import {Alignment} from '../../enums/alignment';
import {UserLight} from '../user/user';
import {CustomRace} from '../option/race';
import {Background} from '../option/background';
import {CustomClass} from '../option/classe';
import {Skill} from '../option/skill';
import {Spell} from '../option/spell';
import {Weapon} from '../option/weapon';
import {Armor} from '../option/armor';

interface CustomCharacterDto extends BaseDto {


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
  owner: UserLight;
  userId: number;

  race: CustomRace;
  raceId: number;

  background: Background;
  backgroundId: number;

  classe: CustomClass;
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

export type CustomCharacterCreateRequest = Omit<CustomCharacterDto, 'id' | 'createdAt' | 'updatedAt' | 'owner' | 'raceId' | 'backgroundId' | 'classId' | 'skills' | 'preparedSpells' | 'weaponIds' | 'armorId'>;

export type CustomCharacterUpdateRequest = Omit<CustomCharacterDto, 'createdAt' | 'updatedAt' | 'owner' | 'raceId' | 'backgroundId' | 'classId' | 'skills' | 'preparedSpells' | 'weaponIds' | 'armorId'>;

export type CustomCharacter = Omit<CustomCharacterDto, 'userId' | 'raceId' | 'backgroundId' | 'classId' | 'skillIds' | 'preparedSpellIds' | 'weaponIds' | 'armorId'>;

export type CustomCharacterCard = Pick<CustomCharacterDto, 'id' | 'name' | 'level' | 'classe' | 'race' |'status'>
