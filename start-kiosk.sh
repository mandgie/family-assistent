#!/bin/bash
# Raspberry Pi Kiosk Mode Startup Script
# Run this script on your Pi to start the dashboard in kiosk mode

# Configuration
PORT=4173
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

# Disable screen blanking/power saving (X11 only, ignore errors on Wayland)
xset s off 2>/dev/null
xset s noblank 2>/dev/null
xset -dpms 2>/dev/null

# Wait for display to be ready
sleep 2

# Start the preview server in background
cd "$APP_DIR"
npm run preview -- --host &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Start Chromium in kiosk mode
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-restore-session-state \
  --no-first-run \
  --start-fullscreen \
  --autoplay-policy=no-user-gesture-required \
  --cursor-style=none \
  --enable-features=UseOzonePlatform \
  --ozone-platform=wayland \
  "http://localhost:$PORT"

# Cleanup when Chromium closes
kill $SERVER_PID 2>/dev/null
