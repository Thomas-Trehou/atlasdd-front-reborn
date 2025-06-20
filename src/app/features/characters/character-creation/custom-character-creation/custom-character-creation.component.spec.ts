import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCharacterCreationComponent } from './custom-character-creation.component';

describe('CustomCharacterCreationComponent', () => {
  let component: CustomCharacterCreationComponent;
  let fixture: ComponentFixture<CustomCharacterCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCharacterCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCharacterCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
