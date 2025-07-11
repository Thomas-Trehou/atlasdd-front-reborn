import {Routes} from '@angular/router';
import {CampaignListComponent} from './campaign-list/campaign-list.component';
import {CampaignCreationComponent} from './campaign-creation/campaign-creation.component';
import {CampaignDetailComponent} from './campaign-detail/campaign-detail.component';

export const CAMPAIGN_ROUTES: Routes = [
  {path: 'list', component: CampaignListComponent},
  { path: 'create', component: CampaignCreationComponent },
  {
    path: 'detail/:id',
    component: CampaignDetailComponent
  }
]
