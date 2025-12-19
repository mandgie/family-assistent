import { useState, useEffect } from 'preact/hooks'

// Lidingö, Stockholm coordinates
const LATITUDE = 59.37
const LONGITUDE = 18.13

const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Stockholm&forecast_days=5`

// WMO Weather codes to Swedish conditions and icons
const weatherCodeMap = {
  0: { condition: 'Klart', icon: '☀️' },
  1: { condition: 'Mestadels klart', icon: '🌤️' },
  2: { condition: 'Halvklart', icon: '⛅' },
  3: { condition: 'Mulet', icon: '☁️' },
  45: { condition: 'Dimma', icon: '🌫️' },
  48: { condition: 'Rimfrost', icon: '🌫️' },
  51: { condition: 'Lätt duggregn', icon: '🌦️' },
  53: { condition: 'Duggregn', icon: '🌦️' },
  55: { condition: 'Kraftigt duggregn', icon: '🌧️' },
  56: { condition: 'Underkylt duggregn', icon: '🌧️' },
  57: { condition: 'Kraftigt underkylt duggregn', icon: '🌧️' },
  61: { condition: 'Lätt regn', icon: '🌦️' },
  63: { condition: 'Regn', icon: '🌧️' },
  65: { condition: 'Kraftigt regn', icon: '🌧️' },
  66: { condition: 'Underkylt regn', icon: '🌧️' },
  67: { condition: 'Kraftigt underkylt regn', icon: '🌧️' },
  71: { condition: 'Lätt snöfall', icon: '🌨️' },
  73: { condition: 'Snöfall', icon: '🌨️' },
  75: { condition: 'Kraftigt snöfall', icon: '❄️' },
  77: { condition: 'Snökorn', icon: '❄️' },
  80: { condition: 'Lätta regnskurar', icon: '🌦️' },
  81: { condition: 'Regnskurar', icon: '🌧️' },
  82: { condition: 'Kraftiga regnskurar', icon: '⛈️' },
  85: { condition: 'Lätta snöbyar', icon: '🌨️' },
  86: { condition: 'Snöbyar', icon: '❄️' },
  95: { condition: 'Åskväder', icon: '⛈️' },
  96: { condition: 'Åskväder med hagel', icon: '⛈️' },
  99: { condition: 'Åskväder med kraftigt hagel', icon: '⛈️' }
}

const getWeatherInfo = (code) => {
  return weatherCodeMap[code] || { condition: 'Okänt', icon: '❓' }
}

const getDayName = (dateStr, index) => {
  if (index === 0) return 'Idag'
  if (index === 1) return 'Imorgon'
  const date = new Date(dateStr)
  return date.toLocaleDateString('sv-SE', { weekday: 'short' })
}

export function Weather() {
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()

        // Get current temp for today
        const currentTemp = Math.round(data.current.temperature_2m)

        // Build 5-day forecast starting with today
        const forecastDays = data.daily.time.slice(0, 5).map((date, index) => {
          const code = data.daily.weather_code[index]
          const info = getWeatherInfo(code)
          const maxTemp = Math.round(data.daily.temperature_2m_max[index])
          const minTemp = Math.round(data.daily.temperature_2m_min[index])

          return {
            day: getDayName(date, index),
            // For today, show current temp as the "now" temp
            tempNow: index === 0 ? currentTemp : null,
            tempMax: maxTemp,
            tempMin: minTemp,
            icon: info.icon,
            isToday: index === 0
          }
        })

        setForecast(forecastDays)
      } catch (error) {
        console.error('Failed to fetch weather:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  // Loading/fallback state
  const placeholderForecast = [
    { day: 'Idag', tempNow: '—', tempMax: '—', tempMin: '—', icon: '☀️', isToday: true },
    { day: 'Imorgon', tempNow: null, tempMax: '—', tempMin: '—', icon: '🌤️', isToday: false },
    { day: 'lör', tempNow: null, tempMax: '—', tempMin: '—', icon: '☁️', isToday: false },
    { day: 'sön', tempNow: null, tempMax: '—', tempMin: '—', icon: '🌧️', isToday: false },
    { day: 'mån', tempNow: null, tempMax: '—', tempMin: '—', icon: '⛅', isToday: false }
  ]

  const days = forecast.length ? forecast : placeholderForecast

  return (
    <div class="weather-strip">
      {days.map((day, index) => (
        <div
          class={`weather-day ${day.isToday ? 'weather-day--today' : ''}`}
          key={day.day}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <span class="weather-day-name">{day.day}</span>
          <span class="weather-day-icon">{day.icon}</span>
          <div class="weather-day-temps">
            {day.isToday && day.tempNow !== null ? (
              <span class="weather-day-now">{day.tempNow}°</span>
            ) : (
              <>
                <span class="weather-day-max">{day.tempMax}°</span>
                <span class="weather-day-min">{day.tempMin}°</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
