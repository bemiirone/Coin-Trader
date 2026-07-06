import express from 'express';
import { getUsers, registerUser, loginUser, updateUserPortfolioAndCash } from '../controllers/user.controller';

const router = express.Router();

router.get('/', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/:id', updateUserPortfolioAndCash);

export default router;
