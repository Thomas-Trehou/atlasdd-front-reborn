import {ArmorCategory} from '../../enums/armor-category';
import {BaseDto} from '../base';

interface ArmorDto extends BaseDto {
  index: string;
  name: string;
  armorCategory: ArmorCategory;
  armorClass: number;
  strengthMinimum: number;
  stealthDisadvantage: boolean;
  weight?: number;
  cost?: string;
  properties?: string;
}


export type ArmorCreateRequest = Omit<ArmorDto, 'id' | 'createdAt' | 'updatedAt'>;

export type Armor = ArmorDto;
