# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-12-19

### Added

- **Tyra Blog Integration**: Photos widget now fetches real blog posts from Tyra
  - Displays images from the 3 most recent blog posts
  - Shows all images per post before moving to next post
  - Image counter badge (e.g., "2/4") for multi-image posts
  - Smart time display: "Idag 14:09", "Igår 10:15", or "18/12 08:34"
  - Auto-rotates every 20 seconds
  - Title and content text with post images
- **CLAUDE.md**: Project documentation for development context

## [1.1.0] - 2025-12-19

### Added

- **Tyra API Integration**: Events widget now fetches real data from Tyra preschool app
  - Displays upcoming events with title, time, and description
  - Shows next 3 months of events, max 6 displayed
  - Smart date formatting: "Idag", "Imorgon", or "Mån 23/12"
  - Color-coded badges: green for activities, orange for info events
  - Description truncated to 2 lines for compact display

## [1.0.0] - 2024-12-19

### Added

- **Dashboard Layout**: Compact top bar with clock and weather, maximizing space for main content
- **Clock Widget**: Elegant Fraunces serif font with pulsing separator, inline date display
- **Weather Widget**: 5-day forecast strip powered by Open-Meteo API (Lidingö, Stockholm)
  - Today highlighted with current temperature
  - Swedish weather conditions and day names
  - Full WMO weather code support with appropriate icons
- **Events Widget**: Upcoming calendar events with terracotta date badges
  - Placeholder for Google Calendar/iCal integration
- **Preschool Photos Widget**: Image + text side-by-side layout
  - Decorative corner frames on images
  - Time badge showing when post was made
  - Auto-rotation between multiple posts (15 second intervals)
  - Navigation dots for multiple posts
- **Design System**: Nordic Living Room aesthetic
  - Warm cream background with subtle grain texture
  - Fraunces (serif) + Outfit (sans-serif) typography
  - Terracotta accent color (#C4704B)
  - Soft shadows and smooth animations
- **Raspberry Pi Support**: Kiosk mode startup script (`start-kiosk.sh`)
- **Auto-refresh**: All widgets refresh every 2 minutes

### Technical

- Built with Preact + Vite for minimal bundle size (~20KB JS, ~8KB CSS)
- No external dependencies beyond Preact
- Client-side only - no backend required
- Production-ready build configuration
