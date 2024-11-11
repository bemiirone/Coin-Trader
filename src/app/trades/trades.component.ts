import { Component } from '@angular/core';
import { ComponentType } from '../shared/shared-model';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../shared/layout/layout.component';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { CoinsActions } from '../coins/store/coins.actions';
import {
  selectCoinLoading,
  selectCoinError,
} from '../coins/store/coins.selectors';
import { selectUserPortfolio } from './store/trades.selectors';
import { User } from '../users/user.model';
import { selectSelectedUser } from '../users/store/user.selectors';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './trades.component.html',
  styleUrl: './trades.component.scss',
})
export class TradesComponent {
  title = 'My Trades';
  portfolioTitle = 'Portfolio';
  componentType: ComponentType = ComponentType.Trades;
  trades$: Observable<any> = of([]);
  user$: Observable<User | null> = of({} as User);
  constructor(private store: Store) {}

  ngOnInit() {
    // get selected user with user selector
    this.user$ = this.store.select(selectSelectedUser);
  }
}
