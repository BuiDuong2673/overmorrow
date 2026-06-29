# Agent Log — Overmorrow Web Migration

**Tool:** Claude Code (claude-sonnet-4-6)  
**Date:** 2026-06-29  
**Task:** Migrate Overmorrow Flutter app to web with secret management and Docker deployment

---

## Session Summary

### Task 1 — Run as web app
- Explored project structure: identified `lib/api_key_example.dart` as the key template, confirmed `web/` directory already exists
- Created `lib/api_key.dart` with the WeatherAPI key from `.env.setup`
- Ran `flutter pub get` and `flutter build web --release` — build succeeded

### Task 2 — Securing Secrets
- Identified the leak: `wapi_Key` is a Dart constant compiled into the JavaScript bundle; the browser sends it directly to `api.weatherapi.com` in GET request params
- Created `proxy/server.js` — Node.js/Express proxy that injects `WAPI_KEY` server-side before forwarding to WeatherAPI
- Created `proxy/package.json`
- Modified `lib/decoders/decode_wapi.dart`: added `_wapiUrl()` helper using `kIsWeb` — on web, routes all 3 WeatherAPI calls (`forecast`, `current`, `hourly`) through `/api/weatherapi/...` without the key
- Modified `lib/services/location_service.dart`: search URL also routed through proxy on web
- Added `kIsWeb` guard for `timezonedbKey` usage — falls back to WeatherAPI's own `localtime` field on web (timezonedb key unavailable in Docker build)
- `Dockerfile` replaces `api_key.dart` with empty strings before `flutter build web` — key provably absent from JS bundle
- Wrote `design-decision.md`

### Task 3 — One-command startup
- Created `nginx.conf`: serves Flutter SPA with `try_files $uri $uri/ /index.html` (deep-link support) and proxies `/api/weatherapi/` to the proxy container
- Created `Dockerfile` (multi-stage: Flutter build → nginx)
- Created `Dockerfile.proxy` (Node.js 20 alpine)
- Created `docker-compose.yml`: two services (`proxy` + `web`), `WAPI_KEY` read from `.env` at runtime
- Created `.env` with `WAPI_KEY` (gitignored)
- Optimized `Dockerfile`: `pubspec.yaml`/`pubspec.lock` copied before source so `flutter pub get` layer is cached across source-only rebuilds

### Additional
- Created `.gitignore` excluding `.env`, `.env.setup`, `.env.llm-token`, `lib/api_key.dart`
- Initialized git repository and connected to GitHub remote

---

## Key Files Changed / Created

| File | Action |
|------|--------|
| `lib/api_key.dart` | Created (gitignored) |
| `lib/decoders/decode_wapi.dart` | Modified — proxy URL routing on web |
| `lib/services/location_service.dart` | Modified — proxy URL routing on web |
| `proxy/server.js` | Created |
| `proxy/package.json` | Created |
| `Dockerfile` | Created |
| `Dockerfile.proxy` | Created |
| `nginx.conf` | Created |
| `docker-compose.yml` | Created |
| `.env` | Created (gitignored) |
| `.gitignore` | Created |
| `design-decision.md` | Written |
