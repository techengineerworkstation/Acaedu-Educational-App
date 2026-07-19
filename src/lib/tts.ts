export interface TTSOptions {
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
  voice?: string
}

const DEFAULT_OPTIONS: TTSOptions = {
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  lang: 'en-US',
}

// Get available voices
export function getVoices(): SpeechSynthesisVoice[] {
  if (!window.speechSynthesis) return []
  return window.speechSynthesis.getVoices()
}

// Speak text
export function speak(text: string, options: TTSOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'))
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const opts = { ...DEFAULT_OPTIONS, ...options }

    utterance.rate = opts.rate!
    utterance.pitch = opts.pitch!
    utterance.volume = opts.volume!
    utterance.lang = opts.lang!

    // Select voice
    const voices = getVoices()
    if (opts.voice) {
      const selected = voices.find(v => v.name === opts.voice)
      if (selected) utterance.voice = selected
    }

    utterance.onend = () => resolve()
    utterance.onerror = (e) => reject(new Error(`Speech error: ${e.error}`))

    window.speechSynthesis.speak(utterance)
  })
}

// Stop speaking
export function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

// Pause speaking
export function pauseSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.pause()
  }
}

// Resume speaking
export function resumeSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.resume()
  }
}

// Check if speaking
export function isSpeaking(): boolean {
  return window.speechSynthesis?.speaking || false
}

// Summarize text (extract key sentences)
export function summarizeText(text: string, maxLength = 200): string {
  if (!text) return ''

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

  // Score sentences by length and keyword presence
  const keywords = ['important', 'key', 'main', 'note', 'remember', 'summary', 'conclusion', 'definition', 'example']
  const scored = sentences.map(s => {
    let score = s.length > 20 ? 10 : 5
    keywords.forEach(kw => {
      if (s.toLowerCase().includes(kw)) score += 5
    })
    return { sentence: s.trim(), score }
  })

  // Sort by score and take top sentences
  scored.sort((a, b) => b.score - a.score)

  let summary = ''
  for (const s of scored) {
    if (summary.length + s.sentence.length > maxLength) break
    summary += s.sentence + ' '
  }

  return summary.trim() || text.substring(0, maxLength)
}

// Translation support (using browser API)
const LANGUAGE_MAP: Record<string, string> = {
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'pt': 'pt-BR',
  'zh': 'zh-CN',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'ar': 'ar-SA',
  'hi': 'hi-IN',
  'yo': 'yo-NG',
  'ig': 'ig-NG',
  'ha': 'ha-NG',
  'sw': 'sw-KE',
}

export function speakInLanguage(text: string, langCode: string, options: TTSOptions = {}): Promise<void> {
  const lang = LANGUAGE_MAP[langCode] || langCode
  return speak(text, { ...options, lang })
}

export function getSupportedLanguages(): { code: string; name: string }[] {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'ig', name: 'Igbo' },
    { code: 'ha', name: 'Hausa' },
    { code: 'sw', name: 'Swahili' },
  ]
}
