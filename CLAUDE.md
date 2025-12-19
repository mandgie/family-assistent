# Family Assistant Dashboard

A smart family dashboard designed to run on a Raspberry Pi in kiosk mode, displaying real-time information from various family-related services.

## Project Overview

This is a lightweight Preact application that displays:
- **Clock** - Current time and date in Swedish
- **Weather** - 5-day forecast for Lidingö using Open-Meteo API
- **Events** - Upcoming events from Tyra preschool app
- **Photos** - Recent blog posts and images from Tyra preschool app

## Architecture

### No Database Required
This is a client-side only application. All data is fetched directly from external APIs:
- **Tyra API** - Preschool events and blog posts
- **Open-Meteo API** - Weather data

Data is stored in React state and refreshed every 2 minutes. No persistence layer needed.

### Target Platform
- **Raspberry Pi** running Raspberry Pi OS
- Displayed in **Chromium kiosk mode** (fullscreen, no UI chrome)
- Continuous operation as a wall-mounted family information display

## Tech Stack

- **Preact** - Lightweight React alternative (~3KB)
- **Vite** - Fast build tool and dev server
- **Vanilla CSS** - No CSS framework, custom Nordic design system

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Raspberry Pi Deployment

### Prerequisites
```bash
# Install unclutter (hides mouse cursor)
sudo apt-get install unclutter
```

### Running in Kiosk Mode
```bash
# Build the app
npm run build

# Start in kiosk mode
./start-kiosk.sh
```

### Auto-start on Boot
Add to `/etc/xdg/lxsession/LXDE-pi/autostart`:
```
@/path/to/family-assistent/start-kiosk.sh
```

## API Configuration

### Tyra Preschool API
The app connects to Tyra (Swedish preschool app) to fetch:
- Calendar events (`getEvents3` endpoint)
- Blog posts with photos (`getBlogItems` endpoint)

Credentials are stored in the component files:
- `src/components/Events.jsx`
- `src/components/Photos.jsx`

**Note:** Session tokens may expire and need refreshing.

### Weather API
Uses Open-Meteo free API, no authentication required. Location is set to Lidingö, Stockholm.

## Design System

**Nordic Living Room** aesthetic:
- Warm cream background (`#FAF7F2`)
- Terracotta accent (`#C4704B`)
- Fraunces serif + Outfit sans-serif fonts
- Soft shadows and subtle animations

## File Structure

```
src/
├── main.jsx          # App entry point
├── App.jsx           # Main layout with refresh logic
├── style.css         # All styles
└── components/
    ├── Clock.jsx     # Time and date display
    ├── Weather.jsx   # 5-day weather forecast
    ├── Events.jsx    # Tyra calendar events
    └── Photos.jsx    # Tyra blog posts with images
```

## Refresh Behavior

- Dashboard refreshes all widgets every **2 minutes**
- Photos rotate between posts every **20 seconds**
- Clock updates every **second**
