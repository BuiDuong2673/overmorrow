# AI Coding Assessment 2: App Migration

*AI Coding: Modern Software Development | SS26 | In-Class Assessment, 60 minutes*

*Overmorrow* is a Flutter weather app that currently targets mobile devices. Turn it into a **web application** that can be deployed with a single command and be used through a browser, showing **live weather from WeatherAPI.com**. To test if your solution works try searching for **Heilbronn**, which should return location matches and show the local weather forecast.

---

## Provided template & models

The submission template / repository you download includes a `.env.setup` file with an **OpenRouter API key** and a **WeatherAPI Key**. You may use the OpenRouter Key to run an agent (e.g. inside OpenCode) if you do not have your own subscription — no separate account, sign-up, or billing is required. The key is restricted to the following models:

- `deepseek/deepseek-v4-flash`
- `moonshotai/kimi-k2.5`
- `moonshotai/kimi-k2.7-code`
- `minimax/minimax-m2.5`

---

## Task 1 — Run Overmorrow as a web app

Overmorrow *does not run as shipped*. Get it running on your local machine and open it in your browser to check that it can fetch live data from WeatherAPI.com.

**Done when:**

- the app builds for the web and you can interact with it in your browser;
- searching **Heilbronn** returns location matches and shows its forecast, with the data coming from WeatherAPI.com.

---

## Task 2 — Securing Secrets

The WeatherAPI key is a secret. Make sure the people using your app can not obtain it. Plan and implement a solution to ensure that the API key is never transmitted to the user.

**Done when:**

- `WAPI_KEY` cannot be recovered from the running app. It should not be present in the page, its assets, or any request the browser makes.
- you have written a `design-decision.md` (about 2-3 paragraphs) documenting why the key leaked and how you fixed it.

---

## Task 3 — One-command startup

Set things up so that opening your repository folder and running a single command hosts a fully running Overmorrow web app — including your Task 2 fix.

**Done when:**

- `docker compose up -d --build` from the repository root builds and starts everything in one step;
- the app is served at `http://localhost:8080`, and unknown deep-link paths (e.g. `/any/route`) return the app;
- the running app includes your Task 2 fix, so `WAPI_KEY` stays secret;
- secrets are read from `.env` at run time — not hardcoded in the compose file or image;
- `docker compose down` stops and removes everything your solution started.

---

## Submission

Upload one zip named `<matrikelnummer>.zip` with your whole repository and everything needed to build and run the container. The following files should be included:

```
docker-compose.yml          # entry point for `docker compose up -d --build`
Dockerfile(s) and config    # how you build and serve the app
your added source           # any server / proxy / scripts you wrote
your Flutter changes        # edits to make the app run in this setup
design-decision.md          # 2-3 paragraphs: the approach you chose, and why
agent_log.{md,json,txt}     # log of the agent / tool you used to solve the tasks
```

`agent_log.*` may be one or several files, in any of the listed formats. Do not include a real `.env`, `.env.llm-token`, or any API key in the zip.

If the zip is too large to upload, remove build artifacts and other files not required to build and run the app — for example `build/`, `.dart_tool/`, `node_modules/`, and the `.git/` directory. Keep only the sources and configuration needed to run `docker compose up -d --build`.