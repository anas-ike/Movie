import { searchMulti } from '../services/tmdb.service.js';

export async function searchPage(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.render('search', {
        pageTitle: 'Search - LIGHTSOUT',
        metaDescription: 'Search movies and TV shows.',
        query: '',
        movies: [],
        shows: []
      });
    }

    const data = await searchMulti(q, Number(req.query.page || 1));
    const movies = data.results.filter((r) => r.mediaType === 'movie');
    const shows = data.results.filter((r) => r.mediaType === 'tv');

    res.render('search', {
      pageTitle: `Search: ${q} - LIGHTSOUT`,
      metaDescription: `Search results for ${q}.`,
      query: q,
      movies,
      shows
    });
  } catch (error) {
    next(error);
  }
}
