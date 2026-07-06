import express from 'express';
import { getTrades, createTrade, deleteTrade } from '../controllers/trade.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getTrades);
router.post('/', authenticate, createTrade);
router.delete('/:id', authenticate, deleteTrade);

export default router;