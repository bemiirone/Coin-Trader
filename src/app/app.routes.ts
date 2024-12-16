import { Routes } from '@angular/router';
import { TradesComponent } from './trades/trades.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TradeFormComponent } from './trades/trade-form/trade-form.component';
import { AuthGuard } from './users/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'coins', pathMatch: 'full'},
  {path: 'coins', component: DashboardComponent},
  {path: 'trades', component: TradesComponent, canActivate: [AuthGuard]},
  {path: 'form', component: TradeFormComponent, canActivate: [AuthGuard]},
];
