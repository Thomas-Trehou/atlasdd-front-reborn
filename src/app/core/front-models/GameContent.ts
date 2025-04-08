// GameContent.ts
export type ContentType = 'race' | 'background' | 'class';

export interface BaseGameContent {
  contentType: ContentType;
  index: string;
  imageUrl: string;
  name: string;
  alt: string;
  aria: string;
  description: string;
}

export interface RaceContent extends BaseGameContent {
  contentType: 'race';
  details: {
    [key: string]: {
      name: string;
      content: string;
    }
  };
}

export interface BackgroundContent extends BaseGameContent {
  contentType: 'background';
  starting_proficiencies: string;
  mastered_tools: string;
  language_options?: number;
  starting_equipment: string;
  personality_traits?: {
    choose: number;
    from: Array<{
      id: number;
      string: string;
    }>;
  };
  feature?: {
    name: string;
    description: string;
    choices?: any[];
  };
}

export interface TableChoice {
  value: string;
  effect: string;
}

export interface Table {
  name: string;
  choices: TableChoice[];
}

export interface Health {
  hit_dice: string;
  health_at_lvl_1: string;
  health_by_lvl: string;
}

export interface Masteries {
  armors: string;
  weapons: string;
  tools: string;
  saving_throws: string;
  skills: string;
}

export interface Equipment {
  description: string;
  choices: string[];
}

export interface Ability {
  name: string;
  description: string;
}

export interface SpecializationChoice {
  name: string;
  description: string;
  abilities: Ability[];
}

export interface Specialization {
  name: string;
  description: string;
  choices: SpecializationChoice[];
}

export interface ClassAbilities {
  health: Health;
  masteries: Masteries;
  equipment: Equipment;
  leveling_table: string;
  abilities: Ability[];
  specializations: Specialization[];
}

export interface ClassContent extends BaseGameContent {
  contentType: 'class';
  alt_abilities?: string;
  trait?: string;
  trait_description?: string;
  class_principles?: string;
  class_principles_description?: string;
  create?: string;
  create_description?: string;
  create_fast?: string;
  class_abilities?: ClassAbilities;
  tables?: Table[];

}

export type GameContent = RaceContent | BackgroundContent | ClassContent;

// Type guards pour identifier le type de contenu (toujours utiles malgré la propriété contentType)
export function isRaceContent(content: GameContent): content is RaceContent {
  return content.contentType === 'race';
}

export function isBackgroundContent(content: GameContent): content is BackgroundContent {
  return content.contentType === 'background';
}

export function isClassContent(content: GameContent): content is ClassContent {
  return content.contentType === 'class';
}
