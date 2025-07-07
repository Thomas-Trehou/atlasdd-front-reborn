import {UserLight} from '../user/user';
import {BaseDto} from '../base';
import {Ogl5Character, Ogl5CharacterCard} from '../character/ogl5-character';
import {CustomCharacter, CustomCharacterCard} from '../character/custom-character';

interface CampaignDto extends BaseDto{

  name: string;
  description: string;
  gameMaster: UserLight;
  campaignPlayers: UserLight[];
  campaignOgl5CharacterSheets: Ogl5Character[];
  campaignCustomCharacterSheets: CustomCharacter[];
  gameMasterId: number;
}

/**
 * Le modèle complet d'une campagne utilisé dans le front-end.
 * Omet les IDs bruts qui ne sont pas directement utilisés dans l'affichage.
 */
export type Campaign = Omit<CampaignDto, 'gameMasterId'>;

/**
 * Le corps de la requête pour la création ou l'update d'une campagne (POST PATCH /campaigns).
 */
export type CampaignCreateUpdateRequest = Pick<CampaignDto, 'name' | 'description' | 'gameMasterId'>;

/**
 * Modèle pour l'affichage des cartes de campagne dans une liste.
 * Correspond à la réponse de GET /campaigns/users/{id}.
 */
export type CampaignCard = Pick<Campaign, 'id' | 'name' | 'description' | 'gameMaster'> & {
  playerCount: number;
};
