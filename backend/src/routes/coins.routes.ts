import { Router } from 'express';
import { getCoins } from '../controllers/coins.controller';

const router = Router();

router.get('/', getCoins);

export default router;
