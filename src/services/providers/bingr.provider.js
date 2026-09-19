export const buildBingrMovieEmbed = (config, id) => new URL(`watch/movie/${id}`, `${config.origin}/`).toString();
export const buildBingrTVEmbed = (config, id, season, episode) => new URL(`watch/tv/${id}/${season}/${episode}`, `${config.origin}/`).toString();
