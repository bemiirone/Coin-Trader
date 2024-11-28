export interface CoinStatus {
  timestamp: string;
  error_code: number;
  error_message: string | null;
  elapsed: number;
  credit_count: number;
  notice: string | null;
  total_count: number;
}

export interface CoinData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  infinite_supply: boolean;
  platform: string | null;
  cmc_rank: number;
  self_reported_circulating_supply: number | null;
  self_reported_market_cap: number | null;
  tvl_ratio: number | null;
  last_updated: string;
  quote: {
    USD: USD;
  };
}
export interface CoinResponse {
  status: CoinStatus;
  data: CoinData[];
}

export type PickedCryptoData = Pick<CoinData, 'name'> & {
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
};

export type TradedCryptoData = Pick<CoinData, 'name' | 'symbol'> & {
  id: number;
  price: number;
  percent_change_24h: number;
  market_cap: number;
};

export interface USD {
  price: number;
  volume_24h?: number; // Make optional
  volume_change_24h?: number; // Make optional
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d?: number; // Make optional
  percent_change_60d?: number; // Make optional
  percent_change_90d?: number; // Make optional
  market_cap: number;
  last_updated?: string; // Make optional
}

