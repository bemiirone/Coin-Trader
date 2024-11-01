export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  portfolio_total: number;
  coin_ids?: string[];
}
