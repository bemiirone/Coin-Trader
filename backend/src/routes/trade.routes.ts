import express from 'express';
import { getTrades, createTrade, deleteTrade } from '../controllers/trade.controller';

const router = express.Router();

router.get('/', getTrades);
router.post('/', createTrade);
router.delete('/:id', deleteTrade);

export default router;