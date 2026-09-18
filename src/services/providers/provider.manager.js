import { env } from '../../config/env.js';
import { buildVidStuckMovieEmbed, buildVidStuckTVEmbed } from './vidstuck.provider.js';
import { buildVidFastMovieEmbed, buildVidFastTVEmbed } from './vidfast.provider.js';
import { buildBingrMovieEmbed, buildBingrTVEmbed } from './bingr.provider.js';

const providers = {
  vidstuck: {
    ...env.providers.vidstuck,
    supports: {
      movie: true,
      tv: true,
      server: true,
      subtitle: true,
      autoplay: false,
      nextEpisode: true,
      episodeSelector: true,
      resume: true
    }
  },
  vidfast: {
    ...env.providers.vidfast,
    supports: {
      movie: true,
      tv: true,
      server: true,
      subtitle: true,
      autoplay: true,
      nextEpisode: true,
      episodeSelector: false,
      resume: true
    }
  },
  bingr: {
    ...env.providers.bingr,
    supports: {
      movie: true,
      tv: true,
      server: false,
      subtitle: false,
      autoplay: false,
      nextEpisode: false,
      episodeSelector: false,
      resume: false
    }
  }
};

function assertProviderEnabled(provider) {
  const config = providers[provider];
  if (!config || !config.enabled) {
    const err = new Error('Provider disabled or unavailable');
    err.code = 'PROVIDER_DISABLED';
    throw err;
  }
  return config;
}

export function getAvailableProviders() {
  return Object.entries(providers)
    .filter(([, cfg]) => cfg.enabled)
    .map(([key, cfg]) => ({
      key,
      name: cfg.name,
      origin: cfg.origin,
      supports: cfg.supports
    }));
}

export function getProviderOrigins() {
  return getAvailableProviders().map((p) => p.origin);
}

export function getProviderConfig(provider) {
  return providers[provider] || null;
}

export function getMovieEmbed(provider, tmdbId, options = {}) {
  const config = assertProviderEnabled(provider);

  if (provider === 'vidstuck') {
    return buildVidStuckMovieEmbed(config, tmdbId, options);
  }
  if (provider === 'vidfast') {
    return buildVidFastMovieEmbed(config, tmdbId, options);
  }
  if (provider === 'bingr') {
    return buildBingrMovieEmbed(config, tmdbId);
  }

  throw new Error('Unsupported provider');
}

export function getTVEmbed(provider, tmdbId, season, episode, options = {}) {
  const config = assertProviderEnabled(provider);

  if (provider === 'vidstuck') {
    return buildVidStuckTVEmbed(config, tmdbId, season, episode, options);
  }
  if (provider === 'vidfast') {
    return buildVidFastTVEmbed(config, tmdbId, season, episode, options);
  }
  if (provider === 'bingr') {
    return buildBingrTVEmbed(config, tmdbId, season, episode);
  }

  throw new Error('Unsupported provider');
}
