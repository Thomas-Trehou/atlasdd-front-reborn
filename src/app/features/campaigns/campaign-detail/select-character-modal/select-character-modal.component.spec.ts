import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCharacterModalComponent } from './select-character-modal.component';

describe('SelectCharacterModalComponent', () => {
  let component: SelectCharacterModalComponent;
  let fixture: ComponentFixture<SelectCharacterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCharacterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCharacterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
