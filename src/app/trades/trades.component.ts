import { Component } from '@angular/core';
import { ComponentType } from '../shared/shared-model';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../shared/layout/layout.component';
import { Store } from '@ngrx/store';
import { Observable, of, tap } from 'rxjs';
import { selectTrades, selectUserBuyTrades, selectUserTrades } from './store/trades.selectors';
import { User } from '../users/user.model';
import { selectSelectedUser } from '../users/store/user.selectors';
import { Trade } from './trades.model';

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
  allTrades$: Observable<Trade[]> = of([]);
  user$: Observable<User | null> = of({} as User);
  constructor(private store: Store) {}

  ngOnInit() {
    this.user$ = this.store.select(selectSelectedUser);
    this.trades$ = this.store.select(selectUserBuyTrades)
  }
}
