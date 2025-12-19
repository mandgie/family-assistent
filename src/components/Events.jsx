import { useState, useEffect } from 'preact/hooks'

const TYRA_API_URL = 'https://login.tyra-appen.se/parse/functions/getEvents3'

// Tyra API credentials
const TYRA_CONFIG = {
  schoolId: 'uMllTGZBEg',
  userRoleId: '6qx7G1DUFD',
  _ApplicationId: 'ydRCutPl8nhiTSRlam0gT5SEqFtuW6N2',
  _JavaScriptKey: 'EkyBfKUqQN8j17ePBmYssFXsAdxNEcIE',
  _ClientVersion: 'js3.5.1',
  _InstallationId: '81d7e51e-5352-4aaa-8f60-c314dc692a73',
  _SessionToken: 'r:fc180157-b7b6-44a7-a5c7-e19d07cc187a'
}

function formatEventDate(dateStr) {
  const eventDate = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Reset time for comparison
  today.setHours(0, 0, 0, 0)
  tomorrow.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)

  if (eventDate.getTime() === today.getTime()) {
    return 'Idag'
  } else if (eventDate.getTime() === tomorrow.getTime()) {
    return 'Imorgon'
  } else {
    // Format as weekday + date (e.g., "Mån 23/12")
    const weekdays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör']
    const weekday = weekdays[eventDate.getDay()]
    const day = eventDate.getDate()
    const month = eventDate.getMonth() + 1
    return `${weekday} ${day}/${month}`
  }
}

function formatTime(event) {
  if (event.startTime) {
    return event.endTime ? `${event.startTime}-${event.endTime}` : event.startTime
  }
  return null
}

async function fetchTyraEvents() {
  const today = new Date()
  const endDate = new Date(today)
  endDate.setMonth(endDate.getMonth() + 3) // Fetch 3 months ahead

  const body = {
    ...TYRA_CONFIG,
    dateStart: today.toISOString().split('T')[0],
    dateEnd: endDate.toISOString().split('T')[0],
    includeBookings: true
  }

  const response = await fetch(TYRA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Accept': '*/*'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`Tyra API error: ${response.status}`)
  }

  const data = await response.json()
  return data.result?.events || []
}

export function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTyraEvents()
      .then(tyraEvents => {
        // Sort by date and take upcoming events
        const sorted = tyraEvents
          .filter(e => new Date(e.eventDate) >= new Date().setHours(0, 0, 0, 0))
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .slice(0, 6) // Show max 6 events
          .map(e => ({
            id: e.eventTimeId,
            title: e.topic,
            description: e.content,
            time: formatTime(e),
            date: formatEventDate(e.eventDate),
            type: e.type
          }))
        setEvents(sorted)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch Tyra events:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div class="events">
        <div class="section-header">
          <div class="section-icon">📅</div>
          <h2>Kommande</h2>
        </div>
        <div class="loading">Laddar...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div class="events">
        <div class="section-header">
          <div class="section-icon">📅</div>
          <h2>Kommande</h2>
        </div>
        <div class="error">
          <p>Kunde inte hämta händelser</p>
          <small>{error}</small>
        </div>
      </div>
    )
  }

  return (
    <div class="events">
      <div class="section-header">
        <div class="section-icon">📅</div>
        <h2>Kommande</h2>
      </div>
      <ul class="event-list">
        {events.map(event => (
          <li key={event.id} class={`event-item event-type-${event.type}`}>
            <div class="event-date-badge">{event.date}</div>
            <div class="event-details">
              <div class="event-header">
                <span class="event-title">{event.title}</span>
                {event.time && <span class="event-time">{event.time}</span>}
              </div>
              {event.description && (
                <p class="event-description">{event.description}</p>
              )}
            </div>
          </li>
        ))}
        {events.length === 0 && (
          <li class="event-item">
            <div class="event-details">
              <span class="event-title">Inga kommande händelser</span>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}
