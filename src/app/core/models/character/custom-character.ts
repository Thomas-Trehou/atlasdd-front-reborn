import {BaseDto} from '../base';
import {ShieldType} from '../../enums/shield-type';
import {Alignment} from '../../enums/alignment';
import {UserLight} from '../user/user';
import {CustomRace, RaceCreateRequest} from '../option/race';
import {Background, BackgroundCreateRequest} from '../option/background';
import {ClassCreateRequest, CustomClass} from '../option/classe';
import {Skill} from '../option/skill';
import {Spell} from '../option/spell';
import {Weapon, WeaponCreateRequest} from '../option/weapon';
import {Armor, ArmorCreateRequest} from '../option/armor';
import {SpellSlots} from './spell-slots';

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

  spellSlots: SpellSlots;

  owner: UserLight;
  userId: number;

  race: CustomRace;
  raceCreateDTO: RaceCreateRequest;
  raceId: number;

  background: Background;
  backgroundCreateDTO: BackgroundCreateRequest;
  backgroundId: number;

  classe: CustomClass;
  classeCreateDTO: ClassCreateRequest;
  classId: number;

  skills: Skill[];
  skillIds: number[];

  preparedSpells: Spell[];
  preparedSpellIds: number[];

  weapons: Weapon[];
  weaponsCreateDTO: WeaponCreateRequest[];
  weaponIds: number[];

  armor: Armor;
  armorCreateDTO: ArmorCreateRequest;
  armorId: number;
}

export type CustomCharacterCreateRequest = Omit<CustomCharacterDto, 'id' | 'createdAt' | 'updatedAt' | 'owner' | 'raceId' | 'race' | 'backgroundId' | 'background' | 'classId' | 'classe' | 'skills' | 'preparedSpells' | 'weaponIds' | 'weapons' | 'armorId' | 'armor' >;

export type CustomCharacterUpdateRequest = Omit<CustomCharacterDto, 'createdAt' | 'updatedAt' | 'owner' | 'raceId' | 'raceCreateDTO' | 'backgroundId' | 'backgroundCreateDTO' | 'classId' | 'classeCreateDTO' | 'skillIds' | 'preparedSpells' | 'weaponIds' | 'weaponsCreateDTO' | 'armorId' |  'armorCreateDTO' >;

export type CustomCharacter = Omit<CustomCharacterDto, 'userId' | 'raceId' | 'raceCreateDTO' | 'backgroundId' | 'backgroundCreateDTO' | 'classId' | 'classeCreateDTO' | 'skillIds' | 'preparedSpellIds' | 'weaponIds' | 'weaponsCreateDTO' | 'armorId' |  'armorCreateDTO' >;

export type CustomCharacterCard = Pick<CustomCharacterDto, 'id' | 'name' | 'level' | 'classe' | 'race' | 'updatedAt' |'status'>
