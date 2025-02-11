import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TradeFormComponent } from './trades/trade-form/trade-form.component';
import { AuthGuard } from './users/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'coins', pathMatch: 'full'},
  {path: 'coins', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)},
  {path: 'trades', loadComponent: () => import('./trades/trades.component').then(c => c.TradesComponent), canActivate: [AuthGuard]},
  {path: 'form', component: TradeFormComponent, canActivate: [AuthGuard]},
];
