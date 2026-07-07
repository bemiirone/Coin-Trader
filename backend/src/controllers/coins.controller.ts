import { Request, Response } from 'express';
import { cmcService } from '../services/cmc.service';

export const getCoins = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 500;
    
    // If cache is stale, fetch fresh data
    if (cmcService.isCacheStale(30000)) {
      const data = await cmcService.fetchPrices(limit);
      return res.json(data);
    }
    
    // Return cached data
    const cachedData = cmcService.getCachedPrices();
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // No cache available, fetch fresh
    const data = await cmcService.fetchPrices(limit);
    res.json(data);
  } catch (error) {
    console.error('Coins controller error:', error instanceof Error ? error.message : error);
    res.status(500).json({ error: 'Error fetching coin data' });
  }
};
