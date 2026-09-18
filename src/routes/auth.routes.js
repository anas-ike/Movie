import { Router } from 'express';
import { login, loginPage, logout, register, registerPage } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { requireCsrf } from '../middleware/csrf.js';

const router = Router();

router.get('/login', loginPage);
router.post('/login', authLimiter, requireCsrf, login);
router.get('/register', registerPage);
router.post('/register', authLimiter, requireCsrf, register);
router.post('/logout', requireCsrf, logout);

export default router;
