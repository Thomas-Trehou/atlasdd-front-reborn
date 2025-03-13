import {UserLight} from '../user/user';
import {BaseDto} from '../base';

interface CampaignDto extends BaseDto{

  name: string;
  description: string;
  gameMaster: UserLight;
  campaignPlayers: UserLight[];
  gameMasterId: number;
}

export type CampaignCreateRequest = Omit<CampaignDto, 'id' | 'createdAt' | 'updatedAt' | 'gameMaster' | 'campaignPlayers'>;

export type Campaign = Omit<CampaignDto, 'gameMasterId'>;
