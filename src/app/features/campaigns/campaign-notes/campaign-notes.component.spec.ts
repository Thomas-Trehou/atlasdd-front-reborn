import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignNotesComponent } from './campaign-notes.component';

describe('CampaignNotesComponent', () => {
  let component: CampaignNotesComponent;
  let fixture: ComponentFixture<CampaignNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
