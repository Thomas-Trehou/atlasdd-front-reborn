import { TestBed } from '@angular/core/testing';

import {CharacterNoteService} from './character-notes.service';

describe('CharacterNotesService', () => {
  let service: CharacterNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
