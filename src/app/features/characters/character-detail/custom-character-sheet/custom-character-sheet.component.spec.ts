import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCharacterSheetComponent } from './custom-character-sheet.component';

describe('CustomCharacterSheetComponent', () => {
  let component: CustomCharacterSheetComponent;
  let fixture: ComponentFixture<CustomCharacterSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCharacterSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCharacterSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
