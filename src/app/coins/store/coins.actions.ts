import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CoinData, CoinStatus } from '../coins.model';

export const CoinsActions = createActionGroup({
  source: 'Coins/API',
  events: {
    'Load CoinsSuccess': props<{ coinsSuccess: CoinData[] }>(),
    'Load CoinsFailure': props<{ coinsFailure: CoinStatus }>(),
    'Add Coins': props<{ coins: CoinData }>(),
    'Upsert Coins': props<{ coins: CoinData }>(),
    'Add CoinsSuccess': props<{ coinsSuccess: CoinData[] }>(),
    'Upsert CoinsSuccess': props<{ coinsSuccess: CoinData[] }>(),
    'Update Coins': props<{ coins: Update<CoinData> }>(),
    'Update CoinsSuccess': props<{ coinsSuccess: Update<CoinData>[] }>(),
    'Delete Coins': props<{ id: string }>(),
    'Delete CoinsSuccess': props<{ ids: string[] }>(),
    'Clear CoinsSuccess': emptyProps(),
  },
});
