import { Request, Response } from 'express';
import { Trade } from '../models/trade.model';

export const getTrades = async (req: Request, res: Response) => {
  try {
    const trades = await Trade.find();
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trades' });
  }
};

export const getTradesByUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const trades = await Trade.find({ user_id });

    if (!trades || trades.length === 0) {
      return res.status(404).json({ message: 'No trades found for this user' });
    }

    return res.json(trades);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching user trades' });
  }
};

export const createTrade = async (req: Request, res: Response) => {
  try {
    const trade = new Trade(req.body);
    await trade.validate();
    await trade.save();
    res.status(201).json(trade);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const deleteTrade = async (req: Request, res: Response) => {
  try {
    const trade = await Trade.findByIdAndDelete(req.params['id']);
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting trade' });
  }
};