# Glyph — Your Reading Sanctuary

A curated reading sanctuary with OpenLibrary integration, personalized themes, and an immersive reading experience. Built with React, Vite, Tailwind CSS, and OpenLibrary API.

## Features

- **📚 OpenLibrary Search** — Search millions of books and authors with real-time results from OpenLibrary API
- **🎨 Custom Themes** — 6 color themes (Deep Void, Cosmic Indigo, Forest Whisper, Golden Hour, Dusk Rose, Stone)
- **👤 Onboarding Flow** — Personalized setup with name, DOB, age, and theme selection on first visit
- **🔖 Bookmarks** — Save books to your personal collection for later reading
- **📖 Reading History** — Track your reading progress over time
- **🔗 Google Sign-In** — Connect your Google account for a personalized experience
- **✨ Celestial Background** — Immersive animated starfield with nebula clouds and parallax effects
- **📱 Responsive Design** — Fully responsive layout optimized for desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/glyph.git
cd glyph

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

To get a Google OAuth Client ID:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:3000` to **Authorized JavaScript origins**
4. Add your production URL as well
5. Copy the Client ID to your `.env` file

> **Note:** The app works without a Google Client ID — Google Sign-In will just not be functional until you configure it.

### Development

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run preview  # Preview the production build locally
```

The build output will be in the `dist/` directory.

## Tech Stack

- **[React 19](https://react.dev/)** — UI framework
- **[Vite 6](https://vitejs.dev/)** — Build tool and dev server
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first CSS
- **[Motion](https://motion.dev/)** — Animation library (successor to Framer Motion)
- **[Lucide React](https://lucide.dev/)** — Icon library
- **[OpenLibrary API](https://openlibrary.org/dev/docs/api/search)** — Book search and metadata
- **[Google Identity Services](https://developers.google.com/identity/gsi/web)** — OAuth sign-in

## Deploying to GitHub Pages

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Glyph reading sanctuary"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/glyph.git
git branch -M main
git push -u origin main
```

### 2. Deploy via GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - uses: actions/deploy-pages@v4
```

Then in your repo:
- Go to **Settings → Pages** and set **Source** to **GitHub Actions**
- Push the workflow file and your site will deploy automatically

### 3. Alternative: Deploy to Vercel / Netlify

**Vercel:**
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Framework preset: **Vite**
4. Deploy — done!

**Netlify:**
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) and import your repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy — done!

## Project Structure

```
src/
├── main.tsx                    # Entry point with GoogleOAuthProvider
├── App.tsx                     # Main app component with all state management
├── index.css                   # Global styles and theme variables
├── data.ts                     # Static book and zodiac data
├── vite-env.d.ts               # Vite type declarations
├── components/
│   ├── CelestialBackground.tsx  # Animated starfield background
│   ├── OnboardingModal.tsx      # First-time user setup
│   ├── SettingsPanel.tsx        # Settings modal (profile, theme, Google, bookmarks)
│   ├── SearchResults.tsx        # OpenLibrary search results modal
│   ├── GoogleSignIn.tsx         # Google OAuth button component
│   ├── ReaderOverlay.tsx        # In-app book reader
│   ├── LandingPage.tsx          # Original landing page (not currently used in main app)
│   ├── HoroscopePanel.tsx       # Original horoscope feature (not currently used)
│   ├── Book3D.tsx               # Original 3D book display (not currently used)
│   └── AnimatedText.tsx         # Text animation utilities
├── services/
│   └── openLibrary.ts           # OpenLibrary API service
└── hooks/
    └── useLocalStorage.ts       # Persistent settings with localStorage
```

## License

MIT
