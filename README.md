# LIGHTSOUT

A server-rendered Express/EJS movie and TV discovery catalog powered by TMDB. Playback is limited to configured third-party embed pages; LIGHTSOUT never downloads, proxies, extracts, or hosts video streams.

## Run locally

1. Copy `.env.example` to `.env`, set a TMDB API key, PostgreSQL `DATABASE_URL`, and a random `SESSION_SECRET` (at least 24 characters).
2. Run `npm install`, `npm run migrate`, and `npm start`.
3. Visit `http://localhost:3000`.

Generate secrets with `openssl rand -hex 32`. `CSRF_SECRET` is reserved for deployments that need a separate secret; the application issues per-session CSRF tokens.

### URL configuration

Origins must be literal URLs, never Markdown. Correct: `VIDSTUCK_ORIGIN=https://vidstuck.xyz`. Incorrect: `VIDSTUCK_ORIGIN=[vidstuck.xyz](https://vidstuck.xyz)`. The same rule applies to `SITE_URL`, VidFast, and Bingr. Startup names the invalid variable rather than allowing a later request to fail with `Invalid URL`.

`REDIS_URL` accepts `redis://` and TLS `rediss://` URLs. Redis is optional: failures log `redis_unavailable` and caching falls back to TMDB requests. For Neon-style database URLs, `sslmode=require` is converted to pg SSL configuration without the pg connection-string warning. Local PostgreSQL remains non-TLS.

## Providers

Enable providers with `*_ENABLED`; origins and embeds are generated server-side from allowlisted modules. Do not put arbitrary iframe URLs in templates or client code. Provider options are limited to the documented configured options.

## Deployment

Pterodactyl startup: `npm install && npm run migrate && npm start`. The server binds `0.0.0.0:$PORT`; Docker Compose is only for local development.

Example Nginx HTTPS proxy:
```nginx
server { listen 443 ssl; server_name example.com; location / { proxy_pass http://127.0.0.1:3000; proxy_http_version 1.1; proxy_set_header Host $host; proxy_set_header X-Forwarded-Proto $scheme; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; } }
```

## Troubleshooting

Broken posters are usually missing TMDB image paths; LIGHTSOUT uses HTTPS `image.tmdb.org` URLs and a local fallback. Check `/css/app.css` returns CSS if the UI is unstyled. TMDB keys stay server-side and are never sent to browser JavaScript.
