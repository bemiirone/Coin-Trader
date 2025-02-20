import mongoose, { Schema, Document } from 'mongoose';

export interface ITrade extends Document {
  user_id: string;
  coin_id: number;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  date: Date;
  volume: number;
  order: 'buy' | 'sell';
}

const TradeSchema = new Schema<ITrade>({
  user_id: { type: String, required: true },
  coin_id: { type: Number, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  volume: { type: Number, required: true },
  order: { type: String, enum: ['buy', 'sell'], required: true }
});

export const Trade = mongoose.model<ITrade>('Trade', TradeSchema);