export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  portfolio_total?: number;
  deposit: number;
  cash?: number;
}

export type UserAdd = Omit<User, '_id'>;
