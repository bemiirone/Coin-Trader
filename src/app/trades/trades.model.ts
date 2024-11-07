export interface Trade {
  id: string;
  user_id: string;
  coin_id: number;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  date: string;
  volume: number;
  order: string;
}