import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CoinResponse } from '../coins/coins.model';
import { WebSocketService } from './websocket.service';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CoinsService {
  constructor(
    private http: HttpClient,
    private websocketService: WebSocketService
  ) { }

  public getCoins() {
    const params = {
      start: '1',
      limit: '500',
      convert: 'USD'
    };
    return this.http.get<CoinResponse>(`${environment.cmcApi}`, {
      headers: {
        'X-CMC_PRO_API_KEY': `${environment.cmcApiKey}`
      },
      params: params
    });
  }

  /**
   * Get coins with real-time price updates via WebSocket
   * Fetches initial coins from HTTP, then streams real-time price updates
   */
  public getCoinsWithRealtimeUpdates(): Observable<CoinResponse> {
    return this.getCoins().pipe(
      switchMap((initialCoins) =>
        // Start with initial HTTP data, then merge with WebSocket updates
        this.websocketService.getPriceUpdates$().pipe(
          startWith(initialCoins),
          map((update) => {
            // If update is a PriceUpdate object, merge it into coins
            if ('coin_id' in update) {
              return this.mergeUpdateWithCoins(initialCoins, update as any);
            }
            // First emission is the initial coins response
            return update as CoinResponse;
          })
        )
      )
    );
  }

  /**
   * Merge a single price update into the coins list
   */
  private mergeUpdateWithCoins(coins: CoinResponse, update: any): CoinResponse {
    if (!coins.data) return coins;

    const updatedCoins = coins.data.map((coin) => {
      if (coin.id === update.coin_id) {
        return {
          ...coin,
          quote: {
            ...coin.quote,
            USD: {
              ...coin.quote?.USD,
              price: update.price,
              market_cap: update.marketCap,
              volume_24h: update.volume24h,
              percent_change_24h: update.change24h,
            }
          }
        };
      }
      return coin;
    });

    return {
      ...coins,
      data: updatedCoins
    };
  }
}
