import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebSocketActions } from './websocket.actions';
import { AuthActions } from '../users/store/auth/auth.actions';
import { WebSocketService } from '../services/websocket.service';
import { catchError, delay, exhaustMap, map, retryWhen, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class WebSocketEffects {
  private actions$ = inject(Actions);
  private wsService = inject(WebSocketService);
  private store = inject(Store);

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
        return timer(backoffDelay).pipe(
          map(() => WebSocketActions.reconnect())
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
}
