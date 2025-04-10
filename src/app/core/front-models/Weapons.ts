export interface WeaponProperty {
  index: string;
  name: string;
  desc: string;
}

export interface Weapon {
  index: string;
  name: string;
  weapon_range: string;
  cost: string;
  damage_dice: string;
  damage_type: string;
  weight: number;
  properties: string;
}
