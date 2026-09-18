import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireCsrf } from '../middleware/csrf.js';
import { validate } from '../middleware/validation.js';
import { favoriteSchema, watchProgressSchema } from '../utils/validation.js';
import { addFavorite, listFavorites, removeFavorite } from '../services/user.service.js';
import { getContinueWatching, upsertWatchProgress } from '../services/watch.service.js';

const router = Router();

router.get('/api/continue-watching', requireAuth, async (req, res, next) => {
  try {
    const data = await getContinueWatching(req.session.user.id, 20);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/api/favorites', requireAuth, async (req, res, next) => {
  try {
    const data = await listFavorites(req.session.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/api/favorites', requireAuth, requireCsrf, validate(favoriteSchema), async (req, res, next) => {
  try {
    const favorite = await addFavorite(
      req.session.user.id,
      req.validated.tmdbId,
      req.validated.mediaType
    );
    res.json({ success: true, data: favorite });
  } catch (error) {
    next(error);
  }
});

router.delete('/api/favorites/:id', requireAuth, requireCsrf, async (req, res, next) => {
  try {
    await removeFavorite(req.session.user.id, Number(req.params.id));
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
});

router.post('/api/watch-progress', requireAuth, requireCsrf, validate(watchProgressSchema), async (req, res, next) => {
  try {
    const row = await upsertWatchProgress(req.session.user.id, req.validated);
    res.json({ success: true, data: row });
  } catch (error) {
    next(error);
  }
});

export default router;
