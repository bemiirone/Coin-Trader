import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectCoinTrades } from '../../coins/store/coins.selectors';
import { selectSelectedUser } from '../../users/store/user.selectors';
import { TradeState } from './trades.reducer';
import { Trade } from '../trades.model';
import { TradedCryptoData } from '../../coins/coins.model';



export const selectTradesState = createFeatureSelector<TradeState>('trades');

export const selectTrades = createSelector(
  selectTradesState,
  (tradesState) => tradesState.entities
);

// Trades filtered by user id
export const selectUserTrades = createSelector(
  selectTrades,
  selectSelectedUser,
  (trades, user) => {
    if (!user) return [];
    return Object.values(trades)
      .filter((trade): trade is Trade => trade !== undefined && trade.user_id === user._id)
      .map(({ user_id, ...rest }) => rest);
  }
);

// Trades filtered by coin id
export const selectTradedCryptoData = createSelector(
  selectCoinTrades,
  (coins): Record<number, TradedCryptoData> => {
    return coins.reduce((map, coin) => {
      map[coin.id] = coin;
      return map;
    }, {} as Record<number, TradedCryptoData>);
  }
);

// Total value of the user's portfolio
export const selectUserPortfolioValue = createSelector(
  selectUserTrades,
  selectTradedCryptoData,
  selectSelectedUser,
  (trades, cryptoData, user) => {
    if (!user) return 0;

    const buyValue = trades
      .filter(trade => trade.order === 'buy')
      .reduce((sum, trade) => {
        const currentPrice = cryptoData[trade.coin_id]?.price || 0;
        return sum + (trade.amount / trade.price) * currentPrice;
      }, 0);

    const sellValue = trades
      .filter(trade => trade.order === 'sell')
      .reduce((sum, trade) => sum + trade.amount, 0);
    return user.portfolio_total + buyValue - sellValue;
  }
);

// Trade deposit and portfolio percentage difference
export const selectPortfolioPercentageDiff = createSelector(
  selectUserPortfolioValue,
  selectSelectedUser,
  (portfolioValue, user) => {
    if (!user) return 0;
    return ((portfolioValue - user.deposit) / user.deposit) * 100;
  }
);

// Trade success
export const selectTradeSuccess = createSelector(
  selectTradesState,
  (tradesState) => tradesState.success
);

// Trade error
export const selectTradeError = createSelector(
  selectTradesState,
  (tradesState) => tradesState.error
);

// Trade loading
export const selectTradeLoading = createSelector(
  selectTradesState,
  (tradesState) => tradesState.loading
);
