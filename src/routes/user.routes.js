import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { favoritesPage, historyPage, profilePage } from '../controllers/user.controller.js';

const router = Router();

router.get('/profile', requireAuth, profilePage);
router.get('/favorites', requireAuth, favoritesPage);
router.get('/history', requireAuth, historyPage);

export default router;
