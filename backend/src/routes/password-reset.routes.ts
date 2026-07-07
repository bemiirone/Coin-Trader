import express from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/password-reset.controller';

const router = express.Router();

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
