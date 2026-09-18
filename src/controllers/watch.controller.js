import { getMovie, getTV, getTVSeason } from '../services/tmdb.service.js';
import { getAvailableProviders, getMovieEmbed, getTVEmbed } from '../services/providers/provider.manager.js';
import { getWatchProgress, recordHistory } from '../services/watch.service.js';

function pickProvider(queryProvider, providers) {
  return providers.find((p) => p.key === queryProvider)?.key || providers[0]?.key;
}

export async function watchMoviePage(req, res, next) {
  try {
    const movie = await getMovie(req.params.id);
    const providers = getAvailableProviders();
    const provider = pickProvider(req.query.provider, providers);

    let savedProgress = null;
    let startAt = null;

    if (req.session.user) {
      savedProgress = await getWatchProgress(req.session.user.id, movie.id, 'movie');
      if (savedProgress?.progress_seconds > 0) startAt = Math.floor(savedProgress.progress_seconds);
      await recordHistory(req.session.user.id, { tmdbId: movie.id, mediaType: 'movie' });
    }

    const embedUrl = getMovieEmbed(provider, movie.id, {
      title: movie.title,
      poster: movie.posterUrl,
      startAt,
      progress: startAt
    });

    res.render('watch-movie', {
      pageTitle: `Watch ${movie.title} - LIGHTSOUT`,
      metaDescription: `Watch ${movie.title} on LIGHTSOUT.`,
      movie,
      providers,
      selectedProvider: provider,
      embedUrl,
      savedProgress
    });
  } catch (error) {
    next(error);
  }
}

export async function watchTVPage(req, res, next) {
  try {
    const [show, seasonData] = await Promise.all([
      getTV(req.params.id),
      getTVSeason(req.params.id, req.params.season)
    ]);

    const episode = seasonData.episodes.find(
      (ep) => ep.episodeNumber === Number(req.params.episode)
    );

    if (!episode) {
      const err = new Error('Invalid episode');
      err.status = 404;
      throw err;
    }

    const providers = getAvailableProviders();
    const provider = pickProvider(req.query.provider, providers);

    let savedProgress = null;
    let startAt = null;

    if (req.session.user) {
      savedProgress = await getWatchProgress(
        req.session.user.id,
        show.id,
        'tv',
        Number(req.params.season),
        Number(req.params.episode)
      );
      if (savedProgress?.progress_seconds > 0) startAt = Math.floor(savedProgress.progress_seconds);
      await recordHistory(req.session.user.id, {
        tmdbId: show.id,
        mediaType: 'tv',
        season: Number(req.params.season),
        episode: Number(req.params.episode)
      });
    }

    const embedUrl = getTVEmbed(provider, show.id, req.params.season, req.params.episode, {
      title: `${show.title} - ${episode.name}`,
      poster: show.posterUrl,
      startAt,
      progress: startAt
    });

    res.render('watch-tv', {
      pageTitle: `Watch ${show.title} S${req.params.season}E${req.params.episode} - LIGHTSOUT`,
      metaDescription: `Watch ${show.title} season ${req.params.season} episode ${req.params.episode}.`,
      show,
      seasonData,
      episode,
      providers,
      selectedProvider: provider,
      embedUrl,
      savedProgress
    });
  } catch (error) {
    next(error);
  }
}

export async function getMovieEmbedApi(req, res, next) {
  try {
    const providers = getAvailableProviders();
    const provider = providers.find((p) => p.key === req.query.provider)?.key;
    if (!provider) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PROVIDER', message: 'Invalid provider' }
      });
    }

    const movie = await getMovie(req.params.id);

    let startAt = null;
    if (req.session.user) {
      const savedProgress = await getWatchProgress(req.session.user.id, movie.id, 'movie');
      if (savedProgress?.progress_seconds > 0) startAt = Math.floor(savedProgress.progress_seconds);
    }

    const embedUrl = getMovieEmbed(provider, movie.id, {
      title: movie.title,
      poster: movie.posterUrl,
      startAt,
      progress: startAt
    });

    res.json({ success: true, data: { embedUrl, provider } });
  } catch (error) {
    next(error);
  }
}

export async function getTVEmbedApi(req, res, next) {
  try {
    const providers = getAvailableProviders();
    const provider = providers.find((p) => p.key === req.query.provider)?.key;
    if (!provider) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PROVIDER', message: 'Invalid provider' }
      });
    }

    const show = await getTV(req.params.id);

    let startAt = null;
    if (req.session.user) {
      const savedProgress = await getWatchProgress(
        req.session.user.id,
        show.id,
        'tv',
        Number(req.params.season),
        Number(req.params.episode)
      );
      if (savedProgress?.progress_seconds > 0) startAt = Math.floor(savedProgress.progress_seconds);
    }

    const embedUrl = getTVEmbed(provider, show.id, req.params.season, req.params.episode, {
      title: show.title,
      poster: show.posterUrl,
      startAt,
      progress: startAt
    });

    res.json({ success: true, data: { embedUrl, provider } });
  } catch (error) {
    next(error);
  }
}
