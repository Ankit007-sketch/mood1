# Mood Improver Bot

Lightweight, beautiful single-page web app that suggests songs and inspirational quotes for 6 moods. Static, PWA-ready, and ready for GitHub Pages / Netlify / Vercel.

Quick start

1. Open this folder in VS Code.
2. Install the *Live Server* extension (optional) and open `index.html` with Live Server.
3. Or run a simple static server (Python):

```bash
# Python 3
python -m http.server 5500
# then open http://localhost:5500/mood-improver-bot/
```

Features

- 6 mood cards (Happy, Sad, Angry, Anxious, Motivated, Relaxed)
- 3–5 curated song recommendations per mood with YouTube playback
- 3 rotating inspirational quotes per mood with typing animation
- LocalStorage to remember last selected mood
- Simple PWA support (manifest + service worker)
- Dark/light theme toggle (persisted in LocalStorage)

Deploy

- GitHub Pages: see `deploy-to-github.md` for 1-click instructions.
- Netlify / Vercel: drag-and-drop or connect repo and set build to `none` (static).

Notes

- This project uses `data.json` to store mood data. Edit it to add songs or quotes.
- If running from local file (file://) some browsers block `fetch`. Use Live Server or a local HTTP server.
