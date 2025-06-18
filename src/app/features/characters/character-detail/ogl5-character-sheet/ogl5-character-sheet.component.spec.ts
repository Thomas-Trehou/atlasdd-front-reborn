import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ogl5CharacterSheetComponent } from './ogl5-character-sheet.component';

describe('Ogl5CharacterSheetComponent', () => {
  let component: Ogl5CharacterSheetComponent;
  let fixture: ComponentFixture<Ogl5CharacterSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ogl5CharacterSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ogl5CharacterSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
