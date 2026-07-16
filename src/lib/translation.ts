// Translation using free Google Translate API (no key required)

const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single'

export async function translateText(text: string, targetLang: string, sourceLang: string = 'auto'): Promise<string> {
  try {
    const params = new URLSearchParams({
      client: 'gtx',
      sl: sourceLang,
      tl: targetLang,
      dt: 't',
      q: text,
    })

    const response = await fetch(`${TRANSLATE_URL}?${params}`)
    const data = await response.json()

    // Google returns nested arrays: [[["translated text","source text",...],...],...]
    if (data && data[0]) {
      return data[0].map((item: any[]) => item[0]).join('')
    }
    return text
  } catch (error) {
    console.error('Translation failed:', error)
    return text
  }
}

export const translationLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'ig', name: 'Igbo' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ru', name: 'Russian' },
  { code: 'tr', name: 'Turkish' },
]
