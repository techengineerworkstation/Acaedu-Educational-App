// Analytics - uses Google Analytics 4 + custom event system
// Requires VITE_GOOGLE_ANALYTICS_ID env var

const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID

// Load GA4 script
export function initAnalytics() {
  if (!GA_ID || import.meta.env.DEV) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function() { window.dataLayer!.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, {
    send_page_view: false,
    cookie_flags: 'SameSite=None;Secure',
  })
}

// Track page view
export function trackPageView(pageName: string, pagePath: string) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_title: pageName,
    page_location: pagePath,
  })
}

// Track custom events
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

// Track user engagement
export function trackLogin(method: string) {
  trackEvent('login', { method })
}

export function trackSignUp(method: string) {
  trackEvent('sign_up', { method })
}

export function trackSearch(query: string, resultsCount: number) {
  trackEvent('search', { search_term: query, results_count: resultsCount })
}

export function trackCourseView(courseId: string, courseTitle: string) {
  trackEvent('view_course', { course_id: courseId, course_title: courseTitle })
}

export function trackVideoPlay(videoId: string, courseId: string) {
  trackEvent('play_video', { video_id: videoId, course_id: courseId })
}

export function trackPayment(amount: number, currency: string, method: string) {
  trackEvent('purchase', { value: amount, currency, payment_method: method })
}

export function trackNotification(notificationType: string) {
  trackEvent('notification_received', { notification_type: notificationType })
}

// Declare global types
declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
  }
}
