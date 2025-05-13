import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterNotesComponent } from './character-notes.component';

describe('CharacterNotesComponent', () => {
  let component: CharacterNotesComponent;
  let fixture: ComponentFixture<CharacterNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
