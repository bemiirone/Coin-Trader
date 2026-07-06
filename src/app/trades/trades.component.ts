import { Component } from '@angular/core';
import { ComponentType } from '../shared/shared-model';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../shared/layout/layout.component';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectUserTrades } from './store/trades.selectors';
import { User } from '../users/user.model';
import { Trade } from './trades.model';
import { selectAuthUser } from '../users/store/auth/auth.selectors';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './trades.component.html',
  styleUrl: './trades.component.scss',
})
export class TradesComponent {
  title = 'My Trades';
  portfolioTitle = 'Portfolio value';
  componentType: ComponentType = ComponentType.Trades;
  trades$: Observable<Trade[]> = of([]);
  user$: Observable<User | null> = of({} as User);

  constructor(private store: Store) {}

  ngOnInit() {
    this.user$ = this.store.select(selectAuthUser);
    this.trades$ = this.store.select(selectUserTrades)
  }
}
