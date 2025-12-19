import { useState, useEffect } from 'preact/hooks'
import { Clock } from './components/Clock'
import { Weather } from './components/Weather'
import { Events } from './components/Events'
import { Photos } from './components/Photos'

const REFRESH_INTERVAL = 2 * 60 * 1000 // 2 minutes

export function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(k => k + 1)
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return (
    <div class="dashboard">
      <div class="top-row">
        <Clock />
        <Weather key={`weather-${refreshKey}`} />
      </div>
      <div class="bottom-row">
        <Events key={`events-${refreshKey}`} />
        <Photos key={`photos-${refreshKey}`} />
      </div>
    </div>
  )
}
