export function buildBingrMovieEmbed(config, tmdbId) {
  return `${config.origin}/watch/movie/${tmdbId}`;
}

export function buildBingrTVEmbed(config, tmdbId, season, episode) {
  return `${config.origin}/watch/tv/${tmdbId}/${season}/${episode}`;
}
