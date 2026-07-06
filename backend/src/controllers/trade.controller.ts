import { Request, Response } from 'express';
import { Trade } from '../models/trade.model';
import { emitTradeNotification, emitPortfolioUpdate } from '../sockets/socket-handlers';
import { wsServer } from '../server';

export const getTrades = async (req: Request, res: Response) => {
  try {
    const trades = await Trade.find();
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trades' });
  }
};

export const createTrade = async (req: Request, res: Response) => {
  try {
    const trade = new Trade(req.body);
    await trade.validate();
    await trade.save();

    emitTradeNotification(wsServer.tradesNamespace, {
      _id: String(trade._id),
      user_id: trade.user_id,
      coin_id: trade.coin_id,
      symbol: trade.symbol,
      name: trade.name,
      amount: trade.amount,
      price: trade.price,
      volume: trade.volume,
      order: trade.order,
      date: trade.date.toISOString(),
    });

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
