import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSheetSpellsTabComponent } from './character-sheet-spells-tab.component';

describe('CharacterSheetSpellsTabComponent', () => {
  let component: CharacterSheetSpellsTabComponent;
  let fixture: ComponentFixture<CharacterSheetSpellsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterSheetSpellsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterSheetSpellsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
