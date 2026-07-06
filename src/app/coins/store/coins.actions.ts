import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CoinData, CoinResponse, CoinStatus } from '../coins.model';

export const CoinsActions = createActionGroup({
  source: 'Coins/API',
  events: {
    'Load Coins': emptyProps(), 
    'Load CoinsSuccess': props<{ coinsSuccess: CoinResponse }>(),
    'Load CoinsFailure': props<{ error: string }>(),
    'Price Update': props<{ prices: { coin_id: number; symbol: string; name: string; price: number; change24h: number; marketCap: number; volume24h: number }[] }>(),
  },
});
