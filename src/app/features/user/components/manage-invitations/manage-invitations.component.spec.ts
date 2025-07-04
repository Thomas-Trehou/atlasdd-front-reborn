import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInvitationsComponent } from './manage-invitations.component';

describe('ManageInvitationsComponent', () => {
  let component: ManageInvitationsComponent;
  let fixture: ComponentFixture<ManageInvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageInvitationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
