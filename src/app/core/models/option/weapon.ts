import {BaseDto} from '../base';

interface WeaponDto extends BaseDto {

  index: string;
  name: string;
  weaponRange: string;
  cost?: string;
  damageDice: string;
  damageType: string;
  weight?: number;
  properties?: string;
}

export type WeaponCreateRequest = Omit<WeaponDto, 'id' | 'createdAt' | 'updatedAt'>

export type Weapon = WeaponDto;
