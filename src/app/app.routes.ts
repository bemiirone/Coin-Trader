import { Routes } from '@angular/router';
import { TradesComponent } from './trades/trades.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TradeFormComponent } from './trades/trade-form/trade-form.component';

export const routes: Routes = [
  {path: '', redirectTo: 'coins', pathMatch: 'full'},
  {path: 'coins', component: DashboardComponent},
  {path: 'trades', component: TradesComponent},
  {path: 'form', component: TradeFormComponent},
];
