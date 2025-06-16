import { TestBed } from '@angular/core/testing';

import { CharacterCreationOptionsService } from './character-creation-options.service';

describe('CharacterCreationOptionsService', () => {
  let service: CharacterCreationOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterCreationOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
