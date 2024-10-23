import { Routes } from '@angular/router';
import { TradesComponent } from './trades/trades.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'trades', component: TradesComponent},
];
