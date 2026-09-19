import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { createSessionStore } from './config/database.js';
import { getProviderOrigins } from './services/providers/provider.manager.js';
import { localsMiddleware } from './middleware/locals.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

import indexRoutes from './routes/index.routes.js';
import movieRoutes from './routes/movie.routes.js';
import tvRoutes from './routes/tv.routes.js';
import searchRoutes from './routes/search.routes.js';
import watchRoutes from './routes/watch.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import apiRoutes from './routes/api.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, '../views'));
  app.set('trust proxy', 1);

  app.use(compression());
  app.use(globalLimiter);
  app.use(cookieParser());

  const frameSrc = ["'self'", ...getProviderOrigins()];
  const connectSrc = ["'self'"];

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https://image.tmdb.org'],
          fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
          frameSrc,
          connectSrc,
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"]
        }
      }
    })
  );

  // Assets are intentionally revalidated: filenames are not fingerprinted and stale CSS would break releases.
  app.get('/sw.js', (req, res) => {
    res.set('Cache-Control', 'no-store, max-age=0');
    res.sendFile(path.resolve(__dirname, '../public/sw.js'));
  });
  app.use(express.static(path.resolve(__dirname, '../public'), { maxAge: 0, etag: true }));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    session({
      store: createSessionStore(),
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 30
      }
    })
  );

  app.use(localsMiddleware);
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${env.siteUrl}/sitemap.xml`);
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${env.siteUrl}/</loc></url>
  <url><loc>${env.siteUrl}/movies</loc></url>
  <url><loc>${env.siteUrl}/tv</loc></url>
  <url><loc>${env.siteUrl}/search</loc></url>
</urlset>`);
  });

  app.use(indexRoutes);
  app.use(movieRoutes);
  app.use(tvRoutes);
  app.use(searchRoutes);
  app.use(watchRoutes);
  app.use(authRoutes);
  app.use(userRoutes);
  app.use(apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
