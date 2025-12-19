import { useState, useEffect } from 'preact/hooks'

const TYRA_BLOG_URL = 'https://login.tyra-appen.se/parse/functions/getBlogItems'

// Tyra API credentials (shared with Events)
const TYRA_CONFIG = {
  schoolId: 'uMllTGZBEg',
  departmentIds: 'qXvLPXJZVX',
  kidIds: ['v6uMv11NKr'],
  _ApplicationId: 'ydRCutPl8nhiTSRlam0gT5SEqFtuW6N2',
  _JavaScriptKey: 'EkyBfKUqQN8j17ePBmYssFXsAdxNEcIE',
  _ClientVersion: 'js3.5.1',
  _InstallationId: '81d7e51e-5352-4aaa-8f60-c314dc692a73',
  _SessionToken: 'r:0265109a-f439-4b6d-8bbb-652a7d02705d'
}

function formatTime(isoDate) {
  const date = new Date(isoDate)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function formatRelativeDate(isoDate) {
  const date = new Date(isoDate)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Reset times for comparison
  today.setHours(0, 0, 0, 0)
  yesterday.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)

  if (compareDate.getTime() === today.getTime()) {
    return `Idag ${formatTime(isoDate)}`
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return `Igår ${formatTime(isoDate)}`
  } else {
    const day = date.getDate()
    const month = date.getMonth() + 1
    return `${day}/${month} ${formatTime(isoDate)}`
  }
}

async function fetchTyraBlogPosts() {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1) // Last month

  const body = {
    ...TYRA_CONFIG,
    tagIds: [],
    startDate: { __type: 'Date', iso: startDate.toISOString() },
    endDate: { __type: 'Date', iso: endDate.toISOString() },
    skip: 0,
    limit: 5 // Get last 5 posts
  }

  const response = await fetch(TYRA_BLOG_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Accept': '*/*'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`Tyra Blog API error: ${response.status}`)
  }

  const data = await response.json()
  return data.result?.docs || []
}

function processPostsToSlides(posts) {
  const slides = []

  // Take the 3 most recent posts
  const recentPosts = posts.slice(0, 3)

  for (const post of recentPosts) {
    // Get only images (not videos) for now
    const images = (post.images || []).filter(img => !img.is_video)

    if (images.length === 0) continue

    // Create a slide for each image in the post
    images.forEach((img, imgIndex) => {
      slides.push({
        id: `${post.objectId}-${imgIndex}`,
        postId: post.objectId,
        imageUrl: img.image?.url,
        imageIndex: imgIndex + 1,
        totalImages: images.length,
        title: post.title,
        text: post.content,
        time: formatRelativeDate(post.publish_date?.iso || post.createdAt),
        authorName: post.author?.user
          ? `${post.author.user.firstName} ${post.author.user.lastName}`
          : null
      })
    })
  }

  return slides
}

export function Photos() {
  const [posts, setPosts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTyraBlogPosts()
      .then(blogPosts => {
        const slides = processPostsToSlides(blogPosts)
        setPosts(slides)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch Tyra blog posts:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Rotate through posts every 20 seconds
  useEffect(() => {
    if (posts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % posts.length)
    }, 20000)

    return () => clearInterval(interval)
  }, [posts.length])

  const currentPost = posts[currentIndex]

  if (loading) {
    return (
      <div class="photos">
        <div class="section-header">
          <div class="section-icon">🎨</div>
          <h2>Förskolan</h2>
        </div>
        <div class="photo-content">
          <div class="photo-empty">
            <div class="photo-empty-icon">📷</div>
            <p>Laddar bilder från förskolan...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div class="photos">
        <div class="section-header">
          <div class="section-icon">🎨</div>
          <h2>Förskolan</h2>
        </div>
        <div class="photo-content">
          <div class="photo-empty">
            <div class="photo-empty-icon">⚠️</div>
            <p>Kunde inte hämta bilder</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div class="photos">
        <div class="section-header">
          <div class="section-icon">🎨</div>
          <h2>Förskolan</h2>
        </div>
        <div class="photo-content">
          <div class="photo-empty">
            <div class="photo-empty-icon">📷</div>
            <p>Inga inlägg från förskolan just nu</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div class="photos">
      <div class="section-header">
        <div class="section-icon">🎨</div>
        <h2>Förskolan</h2>
        <div class="photo-meta">
          {currentPost.totalImages > 1 && (
            <span class="photo-counter">{currentPost.imageIndex}/{currentPost.totalImages}</span>
          )}
          {currentPost.time && (
            <span class="photo-time">{currentPost.time}</span>
          )}
        </div>
      </div>
      <div class="photo-content">
        <div class="photo-image-wrapper">
          <img
            src={currentPost.imageUrl}
            alt="Bild från förskolan"
            class="photo-image"
          />
        </div>
        <div class="photo-text-wrapper">
          {currentPost.title && (
            <h3 class="photo-title">{currentPost.title}</h3>
          )}
          <p class="photo-text">{currentPost.text}</p>
        </div>
      </div>
      {posts.length > 1 && (
        <div class="photo-dots">
          {posts.map((_, i) => (
            <span
              key={i}
              class={`dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
