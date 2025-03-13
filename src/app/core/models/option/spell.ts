import {BaseDto} from '../base';

interface SpellDto extends BaseDto {

  name: string;
  description: string;
  range: string;
  components: string;
  material: string;
  ritual: string;
  duration: string;
  concentration: string;
  castingTime: string;
  level: string;
  school: string;
  classes: string;
  higherLevel: string;
  archetype: string;
  domains: string;
  oaths: string;
  circles: string;
  patrons: string;
}

export type Spell = SpellDto;
