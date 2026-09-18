import { listFavorites, listHistory } from '../services/user.service.js';
import { getMovie, getTV } from '../services/tmdb.service.js';

export function profilePage(req, res) {
  res.render('profile', {
    pageTitle: 'Profile - LIGHTSOUT',
    metaDescription: 'Your LIGHTSOUT profile.'
  });
}

export async function favoritesPage(req, res, next) {
  try {
    const raw = await listFavorites(req.session.user.id);
    const items = await Promise.all(
      raw.map(async (item) => {
        try {
          return item.media_type === 'movie'
            ? await getMovie(item.tmdb_id)
            : await getTV(item.tmdb_id);
        } catch {
          return null;
        }
      })
    );

    res.render('favorites', {
      pageTitle: 'Watchlist - LIGHTSOUT',
      metaDescription: 'Your saved watchlist.',
      items: items.filter(Boolean)
    });
  } catch (error) {
    next(error);
  }
}

export async function historyPage(req, res, next) {
  try {
    const raw = await listHistory(req.session.user.id);
    const items = await Promise.all(
      raw.map(async (item) => {
        try {
          const media =
            item.media_type === 'movie'
              ? await getMovie(item.tmdb_id)
              : await getTV(item.tmdb_id);

          return { ...item, media };
        } catch {
          return null;
        }
      })
    );

    res.render('history', {
      pageTitle: 'History - LIGHTSOUT',
      metaDescription: 'Your watch history.',
      items: items.filter(Boolean)
    });
  } catch (error) {
    next(error);
  }
}
