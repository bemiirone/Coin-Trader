import express from 'express';
import { getUsers, registerUser, loginUser, updateUserPortfolioAndCash } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/:id', authenticate, updateUserPortfolioAndCash);

export default router;
