import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundDetailComponent } from './background-detail.component';

describe('BackgroundDetailComponent', () => {
  let component: BackgroundDetailComponent;
  let fixture: ComponentFixture<BackgroundDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
