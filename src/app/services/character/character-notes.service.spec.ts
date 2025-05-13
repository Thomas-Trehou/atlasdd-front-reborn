import { TestBed } from '@angular/core/testing';

import { CharacterNotesService } from './character-notes.service';

describe('CharacterNotesService', () => {
  let service: CharacterNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
