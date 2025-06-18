import {Routes} from '@angular/router';
import {RacesComponent} from './races/races.component';
import {ClassesComponent} from './classes/classes.component';
import {BackgroundsComponent} from './backgrounds/backgrounds.component';
import {RaceDetailComponent} from './races/race-detail/race-detail.component';
import {ClasseDetailComponent} from './classes/classe-detail/classe-detail.component';
import {BackgroundDetailComponent} from './backgrounds/background-detail/background-detail.component';
import {AbilitiesComponent} from './abilities/abilities.component';
import {WeaponsComponent} from './weapons/weapons.component';
import {ArmorsComponent} from './armors/armors.component';
import {ConditionsComponent} from './conditions/conditions.component';
import {TalentsComponent} from './talents/talents.component';
import {SanctuaryComponent} from './sanctuary.component';
import {SpellsComponent} from './spells/spells.component';

export const SANCTUARY_ROUTES: Routes = [
  { path: '', component: SanctuaryComponent },
  { path: 'races', component: RacesComponent },
  { path: 'races/:id', component: RaceDetailComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'classes/:id', component: ClasseDetailComponent },
  { path: 'backgrounds', component: BackgroundsComponent },
  { path: 'backgrounds/:id', component: BackgroundDetailComponent },
  { path: 'abilities', component: AbilitiesComponent },
  { path: 'weapons', component: WeaponsComponent },
  { path: 'armors', component: ArmorsComponent },
  { path: 'conditions', component: ConditionsComponent },
  { path: 'talents', component: TalentsComponent },
  { path: 'spells', component: SpellsComponent }





];
