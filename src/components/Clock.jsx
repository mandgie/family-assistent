import { useState, useEffect } from 'preact/hooks'

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = time.toLocaleTimeString('sv-SE', { hour: '2-digit' })
  const minutes = time.toLocaleTimeString('sv-SE', { minute: '2-digit' })

  const dateStr = time.toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return (
    <div class="clock-compact">
      <div class="clock-time">
        {hours}
        <span class="clock-separator">:</span>
        {minutes}
      </div>
      <div class="clock-date">{dateStr}</div>
    </div>
  )
}
