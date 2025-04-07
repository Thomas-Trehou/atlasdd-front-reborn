// GameContent.ts
export type ContentType = 'race' | 'background' | 'class';

export interface BaseGameContent {
  index: string;
  imageUrl: string;
  name: string;
  alt: string;
  aria: string;
  description: string;
  contentType: ContentType; // Nouvelle propriété pour distinguer explicitement les types
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

export interface ClassContent extends BaseGameContent {
  contentType: 'class';
  alt_abilities?: string;
  trait?: string;
  trait_description?: string;
  class_principles?: string;
  class_principles_description?: string;
  create?: string;
  create_description?: string;

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
