# Pet Haven

A mobile-first virtual pet web app. The previous MotionWeave/video-generator direction has been replaced by this playable browser pet.

## Features

- Hunger, happiness, energy, and affection stats.
- Animated pet with idle, happy, eating, and sleeping states.
- Interactive room with window, plant, rug, and sleep/bedroom mode.
- Food: apple, meal, and treat.
- Toys: teddy, yo-yo, and ball.
- Affection/cuddle interaction.
- Pet chat with contextual replies.
- Persistent state using browser `localStorage`.
- Offline time simulation when the app is closed.
- Responsive phone/tablet layout.
- No backend, API key, database, or video generator required.

## Run locally

Open `index.html` in a modern browser.

## GitHub Pages

The repository now includes `.github/workflows/pages.yml`. Every push to `main` deploys the site to GitHub Pages. After the first workflow completes, the site will be available at:

`https://devakhil576-gif.github.io/Hujjj/`

The pet's state is stored locally in the browser on each device; GitHub does not store the pet's game state.
