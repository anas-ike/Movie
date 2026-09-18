export function buildVidFastMovieEmbed(config, tmdbId, options = {}) {
  const url = new URL(`${config.origin}/movie/${tmdbId}`);
  const params = new URLSearchParams();

  const merged = {
    title: options.title,
    poster: options.poster,
    autoPlay: options.autoPlay ?? config.autoPlay,
    startAt: options.startAt,
    theme: options.theme || config.theme,
    server: options.server || config.server,
    hideServer: options.hideServer ?? config.hideServer,
    fullscreenButton: options.fullscreenButton ?? config.fullscreenButton,
    chromecast: options.chromecast ?? config.chromecast,
    sub: options.sub || config.sub
  };

  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  url.search = params.toString();
  return url.toString();
}

export function buildVidFastTVEmbed(config, tmdbId, season, episode, options = {}) {
  const url = new URL(`${config.origin}/tv/${tmdbId}/${season}/${episode}`);
  const params = new URLSearchParams();

  const merged = {
    title: options.title,
    poster: options.poster,
    autoPlay: options.autoPlay ?? config.autoPlay,
    startAt: options.startAt,
    theme: options.theme || config.theme,
    nextButton: options.nextButton ?? config.nextButton,
    autoNext: options.autoNext ?? config.autoNext,
    server: options.server || config.server,
    hideServer: options.hideServer ?? config.hideServer,
    fullscreenButton: options.fullscreenButton ?? config.fullscreenButton,
    chromecast: options.chromecast ?? config.chromecast,
    sub: options.sub || config.sub
  };

  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  url.search = params.toString();
  return url.toString();
}
