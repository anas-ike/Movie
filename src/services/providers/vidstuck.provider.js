export function buildVidStuckMovieEmbed(config, tmdbId, options = {}) {
  const url = new URL(`${config.origin}/embed/movie/${tmdbId}`);
  const params = new URLSearchParams();

  const merged = {
    branding: config.branding,
    color: config.color,
    subtitle: options.subtitle || config.subtitle,
    server: options.server || config.server,
    progress: options.progress ?? undefined,
    overlay: options.overlay ?? config.overlay
  };

  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  url.search = params.toString();
  return url.toString();
}

export function buildVidStuckTVEmbed(config, tmdbId, season, episode, options = {}) {
  const url = new URL(`${config.origin}/embed/tv/${tmdbId}/${season}/${episode}`);
  const params = new URLSearchParams();

  const merged = {
    branding: config.branding,
    color: config.color,
    subtitle: options.subtitle || config.subtitle,
    server: options.server || config.server,
    progress: options.progress ?? undefined,
    nextEpisode: options.nextEpisode ?? config.nextEpisode,
    episodeSelector: options.episodeSelector ?? config.episodeSelector,
    autoplayNextEpisode: options.autoplayNextEpisode ?? config.autoplayNextEpisode,
    overlay: options.overlay ?? config.overlay
  };

  Object.entries(merged).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  url.search = params.toString();
  return url.toString();
}
