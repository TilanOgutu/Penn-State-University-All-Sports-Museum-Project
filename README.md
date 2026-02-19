# Penn State All Sports Museum — Interactive Timeline

A full-screen digital timeline display for the Penn State All Sports Museum.
Built with React and designed to run on a large display screen.

---

## ✅ Features

- **Auto-Loop Mode** — Automatically cycles through all events when idle
- **Interactive Mode** — Tap any dot on the timeline to jump to that event
- **Detail Modal** — Click the event card to open a full-detail overlay
- **Navigation Arrows** — Step forward/backward through events
- **Keyboard Support** — Arrow keys navigate; Escape closes modal
- **Inactivity Return** — Returns to auto-loop after 14 seconds of no interaction
- **Progress Bar** — Gold progress bar shows time until next auto-advance
- **PSU Branded** — Navy, white, and gold Penn State color scheme

---

## 📁 Project Structure

```
psu-timeline/
├── public/
│   ├── index.html              # HTML shell (fonts loaded here)
│   └── data/
│       └── timeline.json       # ⭐ THE DATA FILE — edit this to add events
│
├── src/
│   ├── index.js                # React entry point
│   ├── App.js                  # Root component — all state lives here
│   ├── styles/
│   │   └── global.css          # Global styles and CSS animations
│   ├── components/
│   │   ├── Background.js       # Animated full-screen background
│   │   ├── Header.js           # Top museum branding + mode indicator
│   │   ├── EventCard.js        # Center event display card
│   │   ├── Timeline.js         # Bottom horizontal timeline scrubber
│   │   └── DetailModal.js      # Full-screen detail overlay
│   ├── hooks/
│   │   ├── useInactivity.js    # Detects when user stops interacting
│   │   └── useAutoplay.js      # Handles auto-advance interval
│   └── utils/
│       └── sportConfig.js      # Sport → color + icon mapping
│
├── vercel.json                 # Vercel deployment configuration
├── .gitignore
└── README.md
```

---

## 🚀 Setup Instructions

### Step 1 — Install Node.js
If you don't have Node.js installed, download it from https://nodejs.org
Choose the **LTS** version.

### Step 2 — Open the project in VS Code
1. Open VS Code
2. Go to File → Open Folder → select the `psu-timeline` folder

### Step 3 — Install dependencies
Open the VS Code terminal (View → Terminal) and run:
```bash
npm install
```
This installs React and all required packages into `node_modules/`.

### Step 4 — Run locally to test
```bash
npm start
```
This opens the app at `http://localhost:3000` in your browser.
The page auto-refreshes when you save changes.

---

## 📤 Deploying to Vercel (Free Hosting)

### Option A — Via GitHub (Recommended)

1. **Create a GitHub account** at https://github.com if you don't have one

2. **Create a new repository** on GitHub:
   - Click the `+` icon → New Repository
   - Name it `psu-timeline`
   - Keep it Public
   - Do NOT add README (you already have one)

3. **Push your code** from VS Code terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PSU All Sports Museum Timeline"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/psu-timeline.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username.

4. **Deploy on Vercel**:
   - Go to https://vercel.com and sign in with your GitHub account
   - Click "Add New Project"
   - Import your `psu-timeline` repository
   - Leave all settings as default — Vercel auto-detects React
   - Click "Deploy"
   - ✅ Your site will be live at `https://psu-timeline.vercel.app` (or similar)

### Option B — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## ✏️ How to Add More Events

Edit `/public/data/timeline.json`. Each event looks like:

```json
{
  "id": 27,
  "year": 2005,
  "sport": "Wrestling",
  "title": "NCAA Championship",
  "description": "Penn State wins the NCAA wrestling title...",
  "image": "https://your-image-url.com/photo.jpg"
}
```

**Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| `id` | Yes | Unique number (increment from last) |
| `year` | Yes | 4-digit year |
| `sport` | Yes | Must match a key in `sportConfig.js` or will use gold default |
| `title` | Yes | Short event title |
| `description` | Yes | 1-3 sentences |
| `image` | Optional | Full URL to an image. Use `null` if no image available. |

**Adding a new sport:**
Open `src/utils/sportConfig.js` and add an entry to `SPORT_CONFIG`:
```js
'Swimming': { color: '#4ab0e0', icon: '🏊' },
```

---

## ⚙️ Configuration

Key settings are at the top of `src/App.js`:

```js
const AUTOPLAY_INTERVAL  = 4500;   // ms between auto-advances (default: 4.5s)
const INACTIVITY_TIMEOUT = 14000;  // ms of inactivity before returning to loop (default: 14s)
```

Increase `AUTOPLAY_INTERVAL` if you want visitors more time to read each card.
Increase `INACTIVITY_TIMEOUT` if you want more time before the loop restarts.

---

## 🖥️ Display Recommendations

This app is designed for a **landscape 16:9 display** (e.g., a 55"+ TV or monitor).

- Set browser to **fullscreen** (press F11)
- Or use **Kiosk Mode** in Chrome: `chrome --kiosk https://your-vercel-url.com`
- Connect display via HDMI and set it as primary display

---

## 📸 Adding Real Photos

Currently, events without a real image URL show a decorative placeholder.
To add photos:

1. Host them on any image service (Google Drive, Flickr, Imgur, etc.)
2. Get the direct image URL (ending in `.jpg`, `.png`, etc.)
3. Add it to the `"image"` field in `timeline.json`

Or host images in the `public/` folder:
1. Add `photo.jpg` to `public/images/`
2. Set `"image": "/images/photo.jpg"` in the JSON

---

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Create React App** — Zero-config build tooling
- **Vercel** — Hosting and deployment
- **Google Fonts** — Playfair Display, Source Sans 3, Bebas Neue
- No external UI libraries — all custom CSS

---

Built for the Penn State All Sports Museum.
