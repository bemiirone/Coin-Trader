import { Trade } from './trades/trades.model';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Store } from '@ngrx/store';
import { UserActions } from './users/store/user.actions';
import { selectAllUsers, selectSelectedUser } from './users/store/user.selectors';
import { Observable } from 'rxjs';
import { User } from './users/user.model';
import { CommonModule } from '@angular/common';
import { CoinsActions } from './coins/store/coins.actions';
import { TradeActions } from './trades/store/trades.actions';

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
    this.users$ = this.store.select(selectAllUsers);
    this.selectedUser$ = this.store.select(selectSelectedUser);
    this.store.dispatch(UserActions.loadUsers());
    const hardcodedUserId = '67239c55e0853b7bcf32d013'; 
    this.store.dispatch(UserActions.setSelectedUserId({ id: hardcodedUserId }));
    this.store.dispatch(TradeActions.loadTrades());
  }

  getSelectedUser() {
    this.selectedUser$.subscribe(user => {
      console.log('Selected user:', user);
    });
  }
}
