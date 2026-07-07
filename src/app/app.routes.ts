import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TradeFormComponent } from './trades/trade-form/trade-form.component';
import { AuthGuard } from './users/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'coins', pathMatch: 'full' },
  { path: 'coins', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'trades', loadComponent: () => import('./trades/trades.component').then(c => c.TradesComponent), canActivate: [AuthGuard] },
  { path: 'form', component: TradeFormComponent, canActivate: [AuthGuard] },
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./users/register/register.component')
          .then(m => m.RegisterComponent),
        title: 'Register'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./users/forgot-password/forgot-password.component')
          .then(m => m.ForgotPasswordComponent),
        title: 'Forgot Password'
      },
      {
        path: 'reset-password/:token',
        loadComponent: () => import('./users/reset-password/reset-password.component')
          .then(m => m.ResetPasswordComponent),
        title: 'Reset Password'
      }
    ]
  }
];
