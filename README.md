# DiscordRoulette
Guess who sent the discord message! A fun Discord game to play together.

## Get started
1. Make a Firebase project, enable Hosting, Functions, and Realtime Database
2. `cd roulette-backend`; `firebase init` (choose RTDB and Functions); `cd functions` and `npm install`
3. `cd roulette-web`; `firebase init` (choose Hosting); `npm install`
4. Copy `roulette-web/src/constants.js.template` to `roulette-web/src/constants.js` and fill in each value
5. To start functions emulators, in `roulette-backend/functions` do `npm start`
6. To start web, in `roulette-web` do `npm start`
