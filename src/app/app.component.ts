
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Store } from '@ngrx/store';
import { UserActions } from './users/store/user.actions';
import { catchError, filter, Observable, Subject, takeUntil, tap } from 'rxjs';
import { User } from './users/user.model';
import { CommonModule } from '@angular/common';
import { CoinsActions } from './coins/store/coins.actions';
import { TradeActions } from './trades/store/trades.actions';
import { selectAuthUser } from './users/store/auth/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  users$!: Observable<User[]>;
  selectedUser$!: Observable<User | null>;

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(CoinsActions.loadCoins());
    this.store.dispatch(UserActions.loadUsers());
    this.store.dispatch(TradeActions.loadTrades());
  }
}
