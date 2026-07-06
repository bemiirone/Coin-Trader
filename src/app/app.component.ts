
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Store } from '@ngrx/store';
import { UserActions } from './users/store/user.actions';

import { CoinsActions } from './coins/store/coins.actions';
import { TradeActions } from './trades/store/trades.actions';
import { WebSocketActions } from './websocket/websocket.actions';
import { AuthActions } from './users/store/auth/auth.actions';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(CoinsActions.loadCoins());
    this.store.dispatch(UserActions.loadUsers());
    this.store.dispatch(TradeActions.loadTrades());

    this.store.select((state) => state.auth.token).pipe(
      filter((token) => !!token),
      take(1)
    ).subscribe(() => {
      this.store.dispatch(WebSocketActions.connectWebSocket());
    });
  }
}
