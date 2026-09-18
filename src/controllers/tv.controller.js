import { getTV, getTVSeason, getPopularTV, getTopRatedTV } from '../services/tmdb.service.js';
import { isFavorite } from '../services/user.service.js';

export async function tvIndex(req, res, next) {
  try {
    const [popular, topRated] = await Promise.all([getPopularTV(1), getTopRatedTV(1)]);
    res.render('tv', {
      pageTitle: 'TV Shows - LIGHTSOUT',
      metaDescription: 'Browse popular and top rated TV shows.',
      popular: popular.results,
      topRated: topRated.results
    });
  } catch (error) {
    next(error);
  }
}

export async function tvDetail(req, res, next) {
  try {
    const show = await getTV(req.params.id);
    const favorite =
      req.session.user ? await isFavorite(req.session.user.id, show.id, 'tv') : false;

    res.render('tv-show', {
      pageTitle: `${show.title} - LIGHTSOUT`,
      metaDescription: show.overview || `View details for ${show.title}.`,
      show,
      favorite
    });
  } catch (error) {
    error.status = 404;
    next(error);
  }
}

export async function tvSeasonDetail(req, res, next) {
  try {
    const [show, season] = await Promise.all([
      getTV(req.params.id),
      getTVSeason(req.params.id, req.params.season)
    ]);

    res.render('tv-season', {
      pageTitle: `${show.title} - Season ${season.seasonNumber} - LIGHTSOUT`,
      metaDescription: season.overview || `Browse episodes for ${show.title} season ${season.seasonNumber}.`,
      show,
      season
    });
  } catch (error) {
    error.status = 404;
    next(error);
  }
}
