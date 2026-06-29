# Design Decisions

## Why did the API key leak?

When Overmorrow runs as a Flutter web app, the Dart source is compiled to JavaScript and served directly to the browser. The `WAPI_KEY` was declared as a Dart constant (`const String wapi_Key = "..."`) in `lib/api_key.dart` and embedded by the compiler into the JavaScript bundle. Every user who opens the app receives this bundle, so the key is trivially extractable with a text search or by watching the browser's Network tab — each call to `https://api.weatherapi.com/v1/...?key=<SECRET>` sent the real key directly from the browser to WeatherAPI.

## How did you fix it?

The fix is a thin Node.js proxy server (`proxy/server.js`) that sits between the Flutter web app and WeatherAPI. The Flutter code was changed so that, on web (`kIsWeb`), all WeatherAPI calls target a local path (`/api/weatherapi/v1/...`) instead of `api.weatherapi.com` directly — and the `key` parameter is omitted from the request. Nginx receives these requests and forwards them to the proxy container, which injects `WAPI_KEY` from its environment before forwarding upstream. Because the proxy runs server-side inside Docker, the key never leaves the container. In the Docker build, `lib/api_key.dart` is replaced with a file containing empty strings before `flutter build web` runs, so the key cannot appear anywhere in the compiled JavaScript bundle even if dead-code elimination were incomplete.

## Why this architecture?

A two-service Docker Compose setup (nginx + Node.js proxy) was chosen because it keeps concerns separate: nginx handles static file serving and SPA deep-link fallback (`try_files $uri $uri/ /index.html`), while the proxy handles only secret injection. Secrets are read from a `.env` file at container start time — they are never hardcoded in the Compose file or the Docker image. A single `docker compose up -d --build` command builds and wires everything together, and `docker compose down` tears it all down.
