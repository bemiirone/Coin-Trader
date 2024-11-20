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

// Calculate the value of the user's buy trades in USD

// Calculate the value of the user's sell trades in USD
export const selectUserTradesSellValue = createSelector(
  selectUserTrades,
  selectTradedCryptoData,
  (trades, cryptoData) => {
    return trades
    .filter(trade => trade.order === 'sell')
    .reduce((sum, trade) => {
      const currentPrice = cryptoData[trade.coin_id]?.price || 0;
      return sum + trade.volume * currentPrice;
    }, 0);
  }
);

export const selectUserTradesValue = createSelector(
  selectUserTrades,
  selectTradedCryptoData,
  (trades, cryptoData) => {
    return trades
      .filter(trade => trade.order === 'buy')
      .reduce((sum, trade) => {
        const currentPrice = cryptoData[trade.coin_id]?.price || 0;
        return sum + trade.volume * currentPrice;
      }, 0);
  }
);

export const selectUserTradesTotal = createSelector(
  selectSelectedUser,
  (user) => user?.portfolio_total || 0
);

// Cash balance of the user
export const selectUserCash = createSelector(
  selectSelectedUser,
  (user) => user?.cash || 0
);

// Total value of cash and buy trades
export const selectUserPortfolioTotal = createSelector(
  selectUserTradesValue,
  selectUserCash,
  (tradesValue, cash) => tradesValue + cash
);

// Trade deposit and portfolio percentage difference
export const selectPortfolioPercentageDiff = createSelector(
  selectUserPortfolioTotal,
  selectSelectedUser,
  (portfolioValue, user) => {
    if (!user) return 0;
    return ((portfolioValue - user.deposit) / user.deposit) * 100;
  }
);

// Top Trades
export const selectTopTrades = (topN: number) => createSelector(
  selectUserTrades,
  selectTradedCryptoData,
  (trades, cryptoData) => {
    return trades
      .map(trade => {
        const currentPrice = cryptoData[trade.coin_id]?.price || 0;
        const tradeValue = ((currentPrice - trade.price) / trade.price) * 100;
        return { ...trade, value: tradeValue };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, topN);
  }
);


// Trade success, error, and loading state
export const selectTradeSuccess = createSelector(
  selectTradesState,
  (tradesState) => tradesState.success
);
export const selectTradeError = createSelector(
  selectTradesState,
  (tradesState) => tradesState.error
);
export const selectTradeLoading = createSelector(
  selectTradesState,
  (tradesState) => tradesState.loading
);
