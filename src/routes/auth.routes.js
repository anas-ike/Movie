import { Router } from 'express';
import { login, loginPage, logout, register, registerPage } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.get('/login', loginPage);
router.post('/login', authLimiter, login);
router.get('/register', registerPage);
router.post('/register', authLimiter, register);
router.post('/logout', logout);

export default router;
