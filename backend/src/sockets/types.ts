export interface PriceUpdate {
  coin_id: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export interface TradeNotification {
  _id: string;
  user_id: string;
  coin_id: number;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  volume: number;
  order: 'buy' | 'sell';
  date: string;
}

export interface PortfolioUpdate {
  userId: string;
  portfolio_total: number;
  cash: number;
  deposit: number;
}

export interface SocketAuthPayload {
  token: string;
}

export interface DecodedToken {
  id: string;
  admin: boolean;
}
