import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CampaignCard} from '../../../core/models/campaign/campaign';
import {CampaignService} from '../../../services/campaign/campaign.service';
import {AuthService} from '../../../services/auth/auth.service';
import {UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  campaigns: CampaignCard[] = [];
  isLoading = true;

  constructor(
    private campaignService: CampaignService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUser;
    if (currentUser && currentUser.id) {
      this.campaignService.getCampaignsForUser(currentUser.id).subscribe({
        next: (data) => {
          this.campaigns = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des campagnes", err);
          this.isLoading = false;
        }
      });
    }
  }
}
