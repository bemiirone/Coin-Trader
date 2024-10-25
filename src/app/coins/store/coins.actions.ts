import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CoinData, CoinResponse, CoinStatus } from '../coins.model';

export const CoinsActions = createActionGroup({
  source: 'Coins/API',
  events: {
    // Action to trigger loading coins
    'Load Coins': emptyProps(), 
    
    // Action dispatched when coins are successfully loaded
    'Load CoinsSuccess': props<{ coinsSuccess: CoinResponse }>(),

    // Action dispatched when loading coins fails
    'Load CoinsFailure': props<{ coinsFailure: CoinStatus }>(),

    // Other actions
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
