import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Trade } from '../trades.model';

export const TradeActions = createActionGroup({
  source: 'Trades',
  events: {
    'Load Trades': emptyProps(),
    'Load Trades Success': props<{ trades: Trade[] }>(),
    'Load Trades Failure': props<{ error: string }>(),
    'Add Trade': props<{ trade: Trade }>(),
    'Add Trade Success': props<{ trade: Trade }>(),
    'Add Trade Failure': props<{ error: string }>(),
  }
});
