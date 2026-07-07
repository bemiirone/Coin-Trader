import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebSocketActions } from './websocket.actions';
import { AuthActions } from '../users/store/auth/auth.actions';
import { CoinsActions } from '../coins/store/coins.actions';
import { WebSocketService } from '../services/websocket.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class WebSocketEffects {
  private actions$ = inject(Actions);
  private wsService = inject(WebSocketService);

  connectWebSocket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.connectWebSocket),
      switchMap(() =>
        this.wsService.connect().pipe(
          map(() => WebSocketActions.connectWebSocketSuccess()),
          catchError((error) =>
            of(WebSocketActions.connectWebSocketFailure({ error: error.message }))
          )
        )
      )
    )
  );

  reconnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.reconnect),
      switchMap(() =>
        this.wsService.connect().pipe(
          map(() => WebSocketActions.connectWebSocketSuccess()),
          catchError((error) =>
            of(WebSocketActions.connectWebSocketFailure({ error: error.message }))
          )
        )
      )
    )
  );

  autoReconnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WebSocketActions.connectWebSocketFailure),
      switchMap((action, index) => {
        const backoffDelay = Math.min(1000 * Math.pow(2, index), 60000);
        return of(WebSocketActions.reconnect()).pipe(
          // Simple delay before reconnect
          tap(() => setTimeout(() => {}, backoffDelay))
        );
      })
    )
  );

  disconnectOnLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        this.wsService.disconnect();
      }),
      map(() => WebSocketActions.disconnectSuccess())
    )
  );

  // Listen to WebSocket price updates and dispatch action to update store
  priceUpdate$ = createEffect(() =>
    this.wsService.getPriceUpdates$().pipe(
      map((prices) => CoinsActions.priceUpdate({ prices }))
    ),
    { dispatch: true }
  );
}
