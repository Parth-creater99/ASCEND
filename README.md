# ASCEND

**ASCEND** is a gamified productivity and discipline tracker that turns your daily tasks, study goals, and habits into an RPG-style progression system. Pick a theme inspired by your favorite anime or superhero universe (Solo Leveling, Attack on Titan, Naruto, Jujutsu Kaisen, Demon Slayer, Dragon Ball, Death Note, Spider-Man, Iron Man, and more), complete tasks to build streaks and level up, and stay accountable with friends.

> ⚠️ **Hackathon Submission Notice**
>
> This project was built and submitted under a hackathon deadline, and it is **not fully complete**. A few things are still pending / known to be incomplete:
>
> - **Theme artwork is placeholder.** The images used for the anime/superhero themes (hero banners, avatars, etc.) are temporary stock photos and **have not been replaced with the actual themed artwork** due to lack of time before submission. In a finished version, each theme would have proper character/franchise-accurate art.
> - Some UI polish, edge cases, and minor features may be unfinished or partially working.
> - This README reflects the current, in-progress state of the project as submitted for the hackathon — expect rough edges.

We plan to keep improving this after the hackathon (proper artwork, more polish, more themes, etc.).

---

## What it does

- **Gamified task & discipline tracking** — organize tasks under different "disciplines" (e.g. academics, fitness, projects) and earn XP as you complete them.
- **Streaks** — build and maintain daily streaks to stay consistent.
- **Levels & perks** — level up your profile and unlock/claim perks as you progress.
- **Themes** — choose from multiple anime/superhero-inspired visual themes that reskin the whole app (colors, banners, avatars).
- **Light/dark mode** — toggle between color modes.
- **Multi-language support** — basic support for switching the app's display language.
- **Friends system** — send/accept friend requests and see friends' activity.
- **Notifications** — in-app reminders and activity notifications.
- **Accounts** — register/login with a username + password (JWT-based auth).

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Plain JS (no TypeScript)

**Backend**
- Node.js + Express
- PostgreSQL (via `pg`)
- JWT authentication (`jsonwebtoken`, `bcryptjs`)
- Designed to be deployed on [Render](https://render.com) (see `backend/render.yaml`)

## Project Structure

ASCEND-main/
├── src/                  # Frontend React app
│   ├── App.jsx           # Main application (UI, state, theming, logic)
│   ├── AuthWrapper.jsx   # Auth flow wrapper
│   └── main.jsx          # App entry point
├── backend/              # Express + PostgreSQL API
│   ├── index.js          # API routes (auth, key-value store, friends)
│   ├── db.js             # PostgreSQL connection + table setup
│   ├── store.js          # Data store helpers
│   └── middleware/       # Auth middleware
├── public/               # Static assets (icons, favicon, logo)
├── vite.config.js
├── tailwind.config.js
└── package.json

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A PostgreSQL database (local or hosted, e.g. Render/Supabase/Neon)

### 1. Clone & install

git clone <this-repo-url>
cd ASCEND-main

npm install

cd backend
npm install
cd ..

### 2. Configure the backend

Create a `.env` file inside `backend/` with:

DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=<your-secret-key>

The backend will automatically create the required tables (`users`, `store`, `friendships`) on first connection.

### 3. Run the backend

cd backend
npm start
# or, for auto-reload during development:
npm run dev

By default the frontend's dev server proxies `/api` requests to `http://localhost:5000`, so make sure the backend is listening on that port (or update `vite.config.js` accordingly).

### 4. Run the frontend

In a separate terminal, from the project root:

npm run dev

This starts the Vite dev server (typically at `http://localhost:5173`).

### 5. Build for production

npm run build
npm run preview

## Known Limitations / TODO

- [ ] Replace placeholder Unsplash images with real, theme-accurate artwork for each anime/superhero theme.
- [ ] General UI/UX polish across screens.
- [ ] More thorough testing of edge cases (streak resets, friend request flows, etc.).
- [ ] Expand and clean up translations for the multi-language feature.
- [ ] Code cleanup — some helper/patch scripts in the repo root (`fix_*.cjs`, `patch_*.cjs`, `test_recovery*.cjs`) were used during development/debugging and can likely be removed in a future cleanup pass.
