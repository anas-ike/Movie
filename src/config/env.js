import dotenv from 'dotenv';
dotenv.config();

function parseBool(value, fallback = false) {
  if (value === undefined) return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
}

function parseList(value = '') {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 3000),

  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || '',

  sessionSecret: process.env.SESSION_SECRET || '',
  csrfSecret: process.env.CSRF_SECRET || '',

  tmdbApiKey: process.env.TMDB_API_KEY || '',
  tmdbLanguage: process.env.TMDB_LANGUAGE || 'en-US',

  siteName: process.env.SITE_NAME || 'LIGHTSOUT',
  siteUrl: process.env.SITE_URL || '[localhost](http://localhost:3000)',

  providers: {
    vidstuck: {
      enabled: parseBool(process.env.VIDSTUCK_ENABLED, true),
      name: 'VidStuck',
      origin: process.env.VIDSTUCK_ORIGIN || '[vidstuck.xyz](https://vidstuck.xyz)',
      branding: process.env.VIDSTUCK_BRANDING || 'LIGHTSOUT',
      color: process.env.VIDSTUCK_COLOR || '8B5CF6',
      subtitle: process.env.VIDSTUCK_SUBTITLE || 'english',
      server: process.env.VIDSTUCK_SERVER || '',
      progress: parseBool(process.env.VIDSTUCK_PROGRESS, true),
      nextEpisode: parseBool(process.env.VIDSTUCK_NEXT_EPISODE, true),
      episodeSelector: parseBool(process.env.VIDSTUCK_EPISODE_SELECTOR, true),
      autoplayNextEpisode: parseBool(process.env.VIDSTUCK_AUTOPLAY_NEXT_EPISODE, false),
      overlay: parseBool(process.env.VIDSTUCK_OVERLAY, true)
    },
    vidfast: {
      enabled: parseBool(process.env.VIDFAST_ENABLED, true),
      name: 'VidFast',
      origin: process.env.VIDFAST_ORIGIN || '[vidfast.vc](https://vidfast.vc)',
      theme: process.env.VIDFAST_THEME || '8B5CF6',
      server: process.env.VIDFAST_SERVER || '',
      servers: parseList(process.env.VIDFAST_SERVERS || 'default'),
      hideServer: parseBool(process.env.VIDFAST_HIDE_SERVER, false),
      fullscreenButton: parseBool(process.env.VIDFAST_FULLSCREEN_BUTTON, true),
      chromecast: parseBool(process.env.VIDFAST_CHROMECAST, true),
      sub: process.env.VIDFAST_SUB || 'english',
      autoPlay: parseBool(process.env.VIDFAST_AUTOPLAY, false),
      autoNext: parseBool(process.env.VIDFAST_AUTONEXT, true),
      nextButton: parseBool(process.env.VIDFAST_NEXTBUTTON, true)
    },
    bingr: {
      enabled: parseBool(process.env.BINGR_ENABLED, true),
      name: 'Bingr',
      origin: process.env.BINGR_ORIGIN || '[bingr.one](https://bingr.one)'
    }
  }
};

export function validateCriticalEnv() {
  const missing = [];
  if (!env.databaseUrl) missing.push('DATABASE_URL');
  if (!env.sessionSecret) missing.push('SESSION_SECRET');
  return { missing };
}
