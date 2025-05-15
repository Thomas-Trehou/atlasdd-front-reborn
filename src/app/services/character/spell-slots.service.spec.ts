import { TestBed } from '@angular/core/testing';

import { SpellSlotsService } from './spell-slots.service';

describe('SpellSlotsService', () => {
  let service: SpellSlotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpellSlotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
