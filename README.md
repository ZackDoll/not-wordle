# Wordlen't

A Wordle clone that is, legally speaking, not Wordle.
(For GoLinks project stage)

**Live:** [https://not-wordle-nr34.vercel.app](https://not-wordle-nr34.vercel.app)

---

## Features

### Game Modes

**Daily Word**
- One new puzzle every day, shared by all players
- Game state is saved to your browser,progress persists across page reloads
- Completing the daily word submits your result to the leaderboard (if signed in)

**Quick Play**
- A random word every session, playable any number of times
- No waiting, you can start a new game immediately after finishing

**Custom Word**
- Enter any 5-letter word and get a shareable link
- Send the link to a friend so they can play your word

### Timer
- A "Are You Ready?" screen appears before each game - the timer starts only when you click the button
- Your time counts up live during gameplay and is shown on the result screen
- Daily Word times are submitted to the leaderboard and used as a tiebreaker

### Leaderboard
- Shows today's top daily word solves, sorted by fewest guesses then fastest time
- Medal icons for the top 3 finishers
- Your own row is highlighted
- Sign in to appear on the leaderboard

### Stats
- Tracks games played, win percentage, current streak, best streak, and average solve time
- Guess distribution bar chart
- Stored locally in your browser, no account required

### Sign In
- Google OAuth sign-in, no passwords
- Signing in lets your daily word results appear on the leaderboard
- If you complete the daily word before signing in, you can sign in from the result screen and your score will be retroactively submitted

### Sharing
- Share button copies your result to the clipboard as emoji tiles
- Includes your guess count and time (e.g. `Wordlen't 3/6 0:47`)
- Colorblind-friendly emoji variant available in settings

### Settings
- Dark mode/Light mode slider
- Hard mode: correct letters must be reused in subsequent guesses
- Colorblind mode: swaps green/yellow tiles for orange/blue

---

## Word Lists

Two word lists live in `public/`:

- **`wordle-answers-alphabetical.txt`** - the curated set of common words the game picks from as daily and quick play answers (~2,300 words)
- **`valid_words.txt`** - the full dictionary of accepted guesses (~14,800 words); any word here can be typed as a guess even if it will never appear as an answer

To swap in a different answer set, replace `wordle-answers-alphabetical.txt`. To allow or ban specific guesses, edit `valid_words.txt`.

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router) - framework and API routes
- **React Router DOM** - client-side routing within the Next.js shell
- **TypeScript** - end to end
- **CSS Modules** - component-scoped styles, no CSS framework
- **@react-oauth/google** - Google Identity Services for OAuth

### Backend
- **Express.js** - REST API server
- **Prisma** - ORM and migration runner
- **PostgreSQL** - database (hosted on Railway)
- **google-auth-library** - server-side Google token verification
- **JWT** - session tokens with 30-day expiry

### Infrastructure
- **Vercel** - frontend hosting and serverless API routes
- **Railway** - Express backend and PostgreSQL database

---

## Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database
- A Google OAuth client ID ([console.cloud.google.com](https://console.cloud.google.com))

### Frontend

```bash
cd not-wordle
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

Frontend runs at [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd not-wordle/server
npm install
```

Create `server/.env`:
```
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:3000
PORT=3001
```

```bash
npx prisma migrate dev
npm run dev
```

Backend runs at [http://localhost:3001](http://localhost:3001).

---

## Hosting Guide

### Frontend - Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Set the root directory to `not-wordle`
4. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` - your Railway backend URL
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - your Google OAuth client ID
5. Deploy - Vercel handles builds automatically on every push

### Backend - Railway

1. Create a new project at [railway.app](https://railway.app)
2. Add a PostgreSQL plugin to get a `DATABASE_URL`
3. Deploy the `not-wordle/server` directory as a service
4. Set environment variables in the Railway dashboard:
   - `DATABASE_URL` - from the PostgreSQL plugin
   - `JWT_SECRET` - any long random string (`openssl rand -hex 32`)
   - `GOOGLE_CLIENT_ID` - your Google OAuth client ID
   - `FRONTEND_URL` - your Vercel deployment URL
5. The build command (`prisma generate && prisma migrate deploy && tsc`) runs automatically on deploy

### Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add your Vercel URL to **Authorised JavaScript origins**
4. Add your Vercel URL to **Authorised redirect URIs**
5. Copy the client ID into your environment variables on both Vercel and Railway
