import {BaseDto} from './base';

interface NoteDto extends BaseDto{
  title: string;
  content: string;
}

export type NoteCreateRequest = Omit<NoteDto, 'id' | 'createdAt' | 'updatedAt'>;

export type Note = NoteDto;
