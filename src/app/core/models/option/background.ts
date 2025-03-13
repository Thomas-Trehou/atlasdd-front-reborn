import {BaseDto} from '../base';

interface BackgroundDto extends BaseDto {

  name: string;
  masteredTools: string;
  startingEquipment: string;
  backgroundFeature: string;
}

export type BackgroundCreateRequest = Omit<BackgroundDto, 'id' | 'createdAt' | 'updatedAt'>;

export type Background = BackgroundDto;
