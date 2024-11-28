import { selectTopCoins } from './coins.selectors';
import { CoinData, PickedCryptoData } from '../coins.model';
import { createSelector } from '@ngrx/store';

fdescribe('selectTopCoins', () => {
  const mockState = {
    coins: {
      data: {
        data: [
          {
            name: 'Bitcoin',
            quote: {
              USD: {
                price: 50000,
                percent_change_1h: 0.1,
                percent_change_24h: 1.5,
                percent_change_7d: 3.0,
                market_cap: 1_000_000_000,
              },
            },
          },
          {
            name: 'Ethereum',
            quote: {
              USD: {
                price: 3000,
                percent_change_1h: -0.5,
                percent_change_24h: 2.0,
                percent_change_7d: 5.0,
                market_cap: 500_000_000,
              },
            },
          },
        ],
      },
    },
  };

  it('should return the top coins based on the provided limit', () => {
    const limit = 1;
    const selector = selectTopCoins(limit);
    const result = selector.projector(mockState.coins.data.data as CoinData[]);

    const expected: PickedCryptoData[] = [
      {
        name: 'Bitcoin',
        price: 50000,
        percent_change_1h: 0.1,
        percent_change_24h: 1.5,
        percent_change_7d: 3.0,
        market_cap: 1_000_000_000,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return an empty array when no data is available', () => {
    const limit = 1;
    const selector = selectTopCoins(limit);
    const result = selector.projector([]); 

    expect(result).toEqual([]);
  });

  it('should return the correct number of coins up to the limit', () => {
    const limit = 2;
    const selector = selectTopCoins(limit);
    const result = selector.projector(mockState.coins.data.data as CoinData[]);

    const expected: PickedCryptoData[] = [
      {
        name: 'Bitcoin',
        price: 50000,
        percent_change_1h: 0.1,
        percent_change_24h: 1.5,
        percent_change_7d: 3.0,
        market_cap: 1000_000_000,
      },
      {
        name: 'Ethereum',
        price: 3000,
        percent_change_1h: -0.5,
        percent_change_24h: 2.0,
        percent_change_7d: 5.0,
        market_cap: 500_000_000,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return fewer coins if the limit exceeds the available data', () => {
    const limit = 5;
    const selector = selectTopCoins(limit);
    const result = selector.projector(mockState.coins.data.data as CoinData[]);

    const expected: PickedCryptoData[] = [
      {
        name: 'Bitcoin',
        price: 50000,
        percent_change_1h: 0.1,
        percent_change_24h: 1.5,
        percent_change_7d: 3.0,
        market_cap: 1_000_000_000,
      },
      {
        name: 'Ethereum',
        price: 3000,
        percent_change_1h: -0.5,
        percent_change_24h: 2.0,
        percent_change_7d: 5.0,
        market_cap: 500_000_000,
      },
    ];

    expect(result).toEqual(expected);
  });
});
