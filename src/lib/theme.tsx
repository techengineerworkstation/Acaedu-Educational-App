import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'midnight'
export type AcademicPreset = 'default' | 'blue' | 'crimson' | 'institutional'

const academicPresets: Record<AcademicPreset, { label: string; desc: string; color: string }> = {
  default:       { label: 'Acaedu',        desc: 'Dark teal, maroon accents, shadow-elevated cards',                color: '#c1272d' },
  blue:          { label: 'Blue Academy',  desc: 'Voltage-blue CTAs, border-first cards, capsule pills',            color: '#0056d2' },
  crimson:       { label: 'Crimson Prestige', desc: 'Crimson heritage, gold accents, classical warmth',             color: '#a51c30' },
  institutional: { label: 'Institutional', desc: 'Institutional red-gray, data-dense hierarchy',                    color: '#e03c31' },
}

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  academicPreset: AcademicPreset
  availablePresets: typeof academicPresets
  toggle: () => void
  cycle: () => void
  set: (t: Theme) => void
  setAcademicPreset: (p: AcademicPreset) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  isDark: false,
  academicPreset: 'default',
  availablePresets: academicPresets,
  toggle: () => {},
  cycle: () => {},
  set: () => {},
  setAcademicPreset: () => {},
})

function applyTheme(theme: Theme, preset: AcademicPreset) {
  const root = document.documentElement
  root.classList.remove('dark')
  root.removeAttribute('data-theme')
  root.removeAttribute('data-academic')
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'midnight') {
    root.setAttribute('data-theme', 'midnight')
  }
  if (preset !== 'default') {
    root.setAttribute('data-academic', preset)
  }
}

function resolveInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('acaedu-theme') as Theme | null
    if (stored === 'dark' || stored === 'light' || stored === 'midnight') return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  } catch {}
  return 'light'
}

function resolveInitialPreset(): AcademicPreset {
  try {
    const stored = localStorage.getItem('acaedu-academic') as AcademicPreset | null
    if (stored && academicPresets[stored]) return stored
  } catch {}
  return 'default'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme)
  const [academicPreset, setAcademicPresetState] = useState<AcademicPreset>(resolveInitialPreset)

  useEffect(() => {
    applyTheme(theme, academicPreset)
    try {
      localStorage.setItem('acaedu-theme', theme)
      localStorage.setItem('acaedu-academic', academicPreset)
    } catch {}
  }, [theme, academicPreset])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('acaedu-theme')) {
          setThemeState(e.matches ? 'dark' : 'light')
        }
      } catch {}
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => setThemeState(t => t === 'dark' ? 'light' : 'dark')
  const cycle = () => setThemeState(t =>
    t === 'light' ? 'dark' : t === 'dark' ? 'midnight' : 'light'
  )
  const set = (t: Theme) => setThemeState(t)
  const setAcademicPreset = (p: AcademicPreset) => setAcademicPresetState(p)

  return (
    <ThemeContext.Provider value={{
      theme, isDark: theme !== 'light',
      academicPreset, availablePresets: academicPresets,
      toggle, cycle, set, setAcademicPreset,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

/* ─── Preset-aware color palettes ──────────────────────────── */
interface PresetPalette {
  primary: string
  secondary: string
  accent: string
  navy: string
  gold: string
  danger: string
  teal: string
  bg: string
  card: string
  text: string
  textMuted: string
  border: string
  rgba: (hex: string, alpha: number) => string
}

const palettes: Record<AcademicPreset, Omit<PresetPalette, 'rgba'>> = {
  default: {
    primary: '#c1272d', secondary: '#00262b', accent: '#025e6b',
    navy: '#00262b', gold: '#b8860b', danger: '#c1272d', teal: '#025e6b',
    bg: '#ffffff', card: '#ffffff', text: '#1c1e21', textMuted: '#6b6e76', border: '#ddd9d0',
  },
  blue: {
    primary: '#0056d2', secondary: '#002761', accent: '#a678f5',
    navy: '#002761', gold: '#b8922a', danger: '#d30a28', teal: '#3587fc',
    bg: '#ffffff', card: '#ffffff', text: '#0f1114', textMuted: '#5b6780', border: '#dae1ed',
  },
  crimson: {
    primary: '#a51c30', secondary: '#1e1e1e', accent: '#f8c21c',
    navy: '#a51c30', gold: '#b8860b', danger: '#c41e3a', teal: '#1565c0',
    bg: '#ffffff', card: '#ffffff', text: '#1e1e1e', textMuted: '#6c6c6c', border: '#c0c0c0',
  },
  institutional: {
    primary: '#e03c31', secondary: '#394b58', accent: '#1d6b9f',
    navy: '#394b58', gold: '#c4960c', danger: '#e03c31', teal: '#1d6b9f',
    bg: '#ffffff', card: '#ffffff', text: '#2d3b45', textMuted: '#8899a6', border: '#d0d8de',
  },
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

export function usePresetPalette(): PresetPalette {
  const { academicPreset } = useTheme()
  const base = palettes[academicPreset]
  return { ...base, rgba }
}
