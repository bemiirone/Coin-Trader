import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  portfolio_total: number;
  cash: number;
  deposit: number;
  admin: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  portfolio_total: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  deposit: { type: Number, default: 0, required: true },
  admin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

export const User = mongoose.model<IUser>('User', UserSchema);