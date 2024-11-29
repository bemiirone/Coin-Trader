import { selectUserTrades, selectTradedCryptoData, selectUserBuyTrades, selectUserSellTrades, selectUserBuyTradesValue, selectUserTradesSellValue } from './trades.selectors';
import { TradeState, adapter, initialState } from './trades.reducer';
import { Trade } from '../trades.model';
import { User } from '../../users/user.model';
import { TradedCryptoData } from '../../coins/coins.model';
import e from 'express';

describe('Trades Selectors', () => {
  let mockState: TradeState;
  const mockUser: User = { _id: 'user1', name: 'Test User', email: '', password: '', admin: false, portfolio_total: 0, deposit: 0, cash: 0 };
  const mockUser2: User = { _id: 'user3', name: 'No User', email: '', password: '', admin: false, portfolio_total: 0, deposit: 0, cash: 0 };

  const mockCryptoData: TradedCryptoData[] = [
    { id: 101, name: 'Bitcoin', price: 55000, symbol: 'BTC', percent_change_24h: 0, market_cap: 1000000 },
    { id: 102, name: 'Ethereum', price: 3200, symbol: 'ETH', percent_change_24h: 0, market_cap: 500000 },
  ];
  beforeEach(() => {
    mockState = adapter.setAll(
      [
        { 
          _id: '1', 
          user_id: 'user1', 
          coin_id: 101, 
          symbol: 'BTC', 
          name: 'Bitcoin', 
          amount: 100000, 
          price: 50000, 
          date: '2024-11-28T12:00:00Z', 
          volume: 2, 
          order: 'buy' 
        },
        { 
          _id: '2', 
          user_id: 'user1', 
          coin_id: 101, 
          symbol: 'BTC', 
          name: 'Bitcoin', 
          amount: 60000, 
          price: 60000, 
          date: '2024-11-28T13:00:00Z', 
          volume: 1, 
          order: 'sell' 
        },
        { 
          _id: '3', 
          user_id: 'user2', 
          coin_id: 102, 
          symbol: 'ETH', 
          name: 'Ethereum', 
          amount: 15000, 
          price: 3000, 
          date: '2024-11-28T14:00:00Z', 
          volume: 5, 
          order: 'buy' 
        },
      ],
      {
        ...initialState,
        loading: false,
        success: false,
        error: null,
      }
    );
  });

  it('should select trades for the selected user', () => {

    const result = selectUserTrades.projector(
      mockState.entities,
      mockUser
    );

    expect(result).toEqual([
      { 
        _id: '1', 
        coin_id: 101, 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        amount: 100000, 
        price: 50000, 
        date: '2024-11-28T12:00:00Z', 
        volume: 2, 
        order: 'buy' 
      },
      { 
        _id: '2', 
        coin_id: 101, 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        amount: 60000, 
        price: 60000, 
        date: '2024-11-28T13:00:00Z', 
        volume: 1, 
        order: 'sell' 
      },
    ]);
  });

  it('should return an empty array if no trades match the selected user', () => {
    const result = selectUserTrades.projector(
      mockState.entities,
      mockUser2
    );

    expect(result).toEqual([]);
  });

  it('should return an empty array if no user is selected', () => {
    const result = selectUserTrades.projector(
      mockState.entities,
      null
    );

    expect(result).toEqual([]);
  });

  it('should return an empty array if no trades are available', () => {
    const result = selectUserTrades.projector(
      {},
      mockUser
    );

    expect(result).toEqual([]);
  });

  it('should select traded crypto data', () => {
    const result = selectTradedCryptoData.projector(mockCryptoData);

    expect(result).toEqual({
      101: { id: 101, name: 'Bitcoin', price: 55000, symbol: 'BTC', percent_change_24h: 0, market_cap: 1000000 },
      102: { id: 102, name: 'Ethereum', price: 3200, symbol: 'ETH', percent_change_24h: 0, market_cap: 500000 },
    });
  });

  it('should select user buy trades', () => {
    const result = selectUserBuyTrades.projector([
      { _id: 'user1', coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 100000, price: 50000, date: '2024-11-28T12:00:00Z', order: 'buy', volume: 2 },
      { _id: 'user1', coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 60000, price: 60000, date: '2024-11-28T13:00:00Z', order: 'sell', volume: 1 },
      { _id: 'user2', coin_id: 102, symbol: 'ETH', name: 'Ethereum', amount: 15000, price: 3000, date: '2024-11-28T14:00:00Z', order: 'buy', volume: 5 },
    ]);

    expect(result).toEqual([
      { _id: 'user1', coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 100000, price: 50000, date: '2024-11-28T12:00:00Z', order: 'buy', volume: 2 },
      { _id: 'user2', coin_id: 102, symbol: 'ETH', name: 'Ethereum', amount: 15000, price: 3000, date: '2024-11-28T14:00:00Z', order: 'buy', volume: 5 },
    ]);
  });

  it('should select user sell trades', () => {
    const result = selectUserSellTrades.projector([
      { _id: 'user1', coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 100000, price: 50000, date: '2024-11-28T12:00:00Z', order: 'buy', volume: 2 },
      { _id: 'user1', coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 60000, price: 60000, date: '2024-11-28T13:00:00Z', order: 'sell', volume: 1 },
      { _id: 'user2', coin_id: 102, symbol: 'ETH', name: 'Ethereum', amount: 15000, price: 3000, date: '2024-11-28T14:00:00Z', order: 'buy', volume: 5 },
    ]);

    expect(result).toEqual([
      { _id: 'user1', coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 60000, price: 60000, date: '2024-11-28T13:00:00Z', order: 'sell', volume: 1 },
    ]);
  });

  it('should calculate the user buy trades value', () => {
    const result = selectUserBuyTradesValue.projector(
      [
        { coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 100000, price: 50000, date: '2024-11-28T12:00:00Z', order: 'buy', volume: 2 },
        { coin_id: 102, symbol: 'ETH', name: 'Ethereum', amount: 15000, price: 60000, date: '2024-11-28T14:00:00Z', order: 'sell', volume: 1 },
      ],
      {
        101: { id: 101, name: 'Bitcoin', price: 55000, symbol: 'BTC', percent_change_24h: 0, market_cap: 1000000 },
        102: { id: 102, name: 'Ethereum', price: 3200, symbol: 'ETH', percent_change_24h: 0, market_cap: 500000 },
      }
    );

    expect(result).toEqual(2 * 55000);
  });

  it('should calculate the user sell trades value', () => {
    const result = selectUserTradesSellValue.projector(
      [
        { coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 100000, price: 50000, date: '2024-11-28T12:00:00Z', order: 'buy', volume: 2 },
        { coin_id: 102, symbol: 'ETH', name: 'Ethereum', amount: 15000, price: 60000, date: '2024-11-28T14:00:00Z', order: 'sell', volume: 1 },
      ],
      {
        101: { id: 101, name: 'Bitcoin', price: 55000, symbol: 'BTC', percent_change_24h: 0, market_cap: 1000000 },
        102: { id: 102, name: 'Ethereum', price: 3200, symbol: 'ETH', percent_change_24h: 0, market_cap: 500000 },
      }
    );
    expect(result).toEqual(1 * 3200);
  });

    
});
