export interface CharacterCardModel {
  id: number;
  name: string;
  level: number;
  classe: string;
  race: string;
  status: string;
  type: 'ogl5' | 'custom';
}
