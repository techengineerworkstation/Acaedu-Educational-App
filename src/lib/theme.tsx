import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'midnight'
export type AcademicPreset = 'coursera' | 'harvard' | 'edx' | 'canvas'

const academicPresets: Record<AcademicPreset, { label: string; desc: string; color: string }> = {
  coursera: { label: 'Coursera', desc: 'Clean voltage-blue CTAs, border-first cards', color: '#0056d2' },
  harvard:  { label: 'Harvard',  desc: 'Crimson prestige, gold accents, classical',   color: '#a51c30' },
  edx:      { label: 'edX',      desc: 'Deep teal + terracotta warmth, scholarly',    color: '#025e6b' },
  canvas:   { label: 'Canvas',   desc: 'Institutional red-gray, data-dense',          color: '#e03c31' },
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
  academicPreset: 'coursera',
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
  if (preset !== 'coursera') {
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
  return 'coursera'
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
