import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ogl5CharacterCreationComponent } from './ogl5-character-creation.component';

describe('Ogl5CharacterCreationComponent', () => {
  let component: Ogl5CharacterCreationComponent;
  let fixture: ComponentFixture<Ogl5CharacterCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ogl5CharacterCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ogl5CharacterCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
