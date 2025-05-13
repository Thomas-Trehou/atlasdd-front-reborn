import {BaseDto} from '../base';

interface SkillDto extends BaseDto{

  id: number;
  name: string;
  abilityType: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

}

export type Skill = SkillDto;
