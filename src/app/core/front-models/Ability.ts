export interface Skill {
  index: string;
  name: string;
  description: string;
}

export interface Ability {
  index: string;
  name: string;
  full_name: string;
  description: string;
  skills: Skill[];
}
