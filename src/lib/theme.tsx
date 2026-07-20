import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'midnight'
export type AcademicPreset = 'default' | 'blue' | 'crimson' | 'institutional'

const academicPresets: Record<AcademicPreset, { label: string; desc: string; color: string }> = {
  default:       { label: 'Acaedu',           desc: 'Clean, accessible learning platform with blue accents and friendly warmth', color: '#1865f2' },
  blue:          { label: 'Blue Academy',      desc: 'Professional education platform with deep blue palette and border-first design', color: '#0056d2' },
  crimson:       { label: 'Crimson Prestige',  desc: 'Classic academic institution with crimson tones and serif typography', color: '#a51c30' },
  institutional: { label: 'Institutional',     desc: 'Enterprise LMS with neutral grays, flat depth, and system-native feel', color: '#0070E0' },
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
export interface PresetPalette {
  primary: string
  secondary: string
  accent: string
  navy: string
  gold: string
  danger: string
  success: string
  bg: string
  card: string
  text: string
  textMuted: string
  border: string
  rgba: (hex: string, alpha: number) => string
}

const palettes: Record<AcademicPreset, Omit<PresetPalette, 'rgba'>> = {
  default: {
    primary: '#1865f2', secondary: '#21242c', accent: '#9059ff',
    navy: '#0b2149', gold: '#ffb100', danger: '#d92916', success: '#00a60e',
    bg: '#ffffff', card: '#ffffff', text: '#21242c', textMuted: '#6b7080', border: '#c9ccd1',
  },
  blue: {
    primary: '#0056d2', secondary: '#002761', accent: '#a678f5',
    navy: '#002761', gold: '#b8922a', danger: '#d30a28', success: '#276a1a',
    bg: '#ffffff', card: '#ffffff', text: '#0f1114', textMuted: '#5b6780', border: '#dae1ed',
  },
  crimson: {
    primary: '#a51c30', secondary: '#1e1e1e', accent: '#f8c21c',
    navy: '#a51c30', gold: '#b8860b', danger: '#c41e3a', success: '#2e7d32',
    bg: '#ffffff', card: '#ffffff', text: '#1e1e1e', textMuted: '#6c6c6c', border: '#c0c0c0',
  },
  institutional: {
    primary: '#0070E0', secondary: '#394b58', accent: '#1d6b9f',
    navy: '#394b58', gold: '#c4960c', danger: '#e03c31', success: '#2b7a3e',
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

/* ═══════════════════════════════════════════════════════════════
   UNIVERSAL PRESET TOKENS — Single source of truth
   Same values as CSS variables in index.css, exportable for
   React Native mobile app and any other platform
   ═══════════════════════════════════════════════════════════════ */

export interface PresetTokens {
  colors: {
    primary: string; primaryHover: string; primaryLight: string; primaryDark: string; primaryMuted: string
    secondary: string; secondaryHover: string; secondaryLight: string
    accent: string; accentWarm: string
    bg: string; bgSecondary: string; bgTertiary: string; bgCard: string; bgHover: string
    text: string; textSecondary: string; textMuted: string; textInverse: string
    border: string; borderLight: string; borderStrong: string
    navy: string; navyMid: string; navyLight: string; navyPale: string
    gold: string; goldMid: string; goldLight: string; goldBright: string; goldPale: string
    cream: string
    danger: string; warning: string; success: string; info: string
  }
  radii: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number; xxxl: number; pill: number }
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number; xxxl: number }
  shadows: {
    xs: string; sm: string; md: string; lg: string; xl: string; xxl: string
    card: string; cardHover: string; glowNavy: string
  }
  typography: {
    displayFont: string; bodyFont: string; monoFont: string
    displayWeight: number; bodyWeight: number; headingWeight: number
    displayLetterSpacing: number
  }
  gradients: { primary: string; hero: string; warm: string }
}

export const presetTokens: Record<AcademicPreset, PresetTokens> = {
  /* ─── Default (Acaedu) — Clean, accessible, blue-accented ── */
  default: {
    colors: {
      primary: '#1865f2', primaryHover: '#1254c7', primaryLight: '#4d8af2', primaryDark: '#0b2149', primaryMuted: '#e8f0fe',
      secondary: '#21242c', secondaryHover: '#3a3d45', secondaryLight: '#5e6168',
      accent: '#9059ff', accentWarm: '#14bf96',
      bg: '#ffffff', bgSecondary: '#f7f8fa', bgTertiary: '#eef0f3', bgCard: '#ffffff', bgHover: '#f0f2f5',
      text: '#21242c', textSecondary: '#3a3d45', textMuted: '#6b7080', textInverse: '#ffffff',
      border: '#c9ccd1', borderLight: '#e3e5e8', borderStrong: '#999da3',
      navy: '#0b2149', navyMid: '#123b75', navyLight: '#1865f2', navyPale: '#e8f0fe',
      gold: '#ffb100', goldMid: '#ffc84d', goldLight: '#ffe08a', goldBright: '#ffebad', goldPale: '#fffaea',
      cream: '#f7f8fa',
      danger: '#d92916', warning: '#ffb100', success: '#00a60e', info: '#1865f2',
    },
    radii: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, pill: 50 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 },
    shadows: {
      xs: '0 1px 2px rgba(0,0,0,0.04)', sm: '0 1px 4px rgba(0,0,0,0.06)', md: '0 2px 12px rgba(0,0,0,0.07)',
      lg: '0 6px 20px rgba(0,0,0,0.09)', xl: '0 10px 36px rgba(0,0,0,0.11)', xxl: '0 16px 48px rgba(0,0,0,0.14)',
      card: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
      cardHover: '0 4px 16px rgba(0,0,0,0.08), 0 8px 28px rgba(0,0,0,0.06)',
      glowNavy: '0 0 0 3px rgba(24,101,242,0.10), 0 4px 16px rgba(24,101,242,0.12)',
    },
    typography: {
      displayFont: "'Lato', 'Source Sans 3', 'Inter', sans-serif",
      bodyFont: "'Lato', 'Source Sans 3', 'Inter', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      displayWeight: 800, bodyWeight: 400, headingWeight: 700,
      displayLetterSpacing: -0.02,
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0b2149 0%, #1865f2 50%, #4d8af2 100%)',
      hero: 'linear-gradient(160deg, #0b1628 0%, #0b2149 30%, #123b75 65%, #0b2149 100%)',
      warm: 'linear-gradient(135deg, #1865f2 0%, #9059ff 60%, #c4a6ff 100%)',
    },
  },

  /* ─── Blue Academy — Professional deep blue palette ──────── */
  blue: {
    colors: {
      primary: '#0056d2', primaryHover: '#0048b0', primaryLight: '#3587fc', primaryDark: '#002761', primaryMuted: '#e3eeff',
      secondary: '#002761', secondaryHover: '#003b8f', secondaryLight: '#3587fc',
      accent: '#a678f5', accentWarm: '#3587fc',
      bg: '#ffffff', bgSecondary: '#f7f8fa', bgTertiary: '#e8eef7', bgCard: '#ffffff', bgHover: '#f0f3f8',
      text: '#0f1114', textSecondary: '#1e2229', textMuted: '#5b6780', textInverse: '#ffffff',
      border: '#dae1ed', borderLight: '#e8eef7', borderStrong: '#b0b8c9',
      navy: '#002761', navyMid: '#003b8f', navyLight: '#3587fc', navyPale: '#e3eeff',
      gold: '#b8922a', goldMid: '#d4ad4b', goldLight: '#f0cc5a', goldBright: '#f5d76e', goldPale: '#fdf6e3',
      cream: '#f7f8fa',
      danger: '#d30a28', warning: '#a32e00', success: '#276a1a', info: '#0056d2',
    },
    radii: { xs: 2, sm: 4, md: 8, lg: 16, xl: 16, xxl: 24, xxxl: 24, pill: 50 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 },
    shadows: {
      xs: '0 1px 2px rgba(0,0,0,0.02)', sm: '0 1px 3px rgba(0,0,0,0.04)', md: '0 2px 8px rgba(0,0,0,0.05)',
      lg: '0 4px 14px rgba(0,0,0,0.06)', xl: '0 6px 20px rgba(0,0,0,0.08)', xxl: '0 8px 28px rgba(0,0,0,0.10)',
      card: '0 1px 3px rgba(0,0,0,0.03)',
      cardHover: '0 2px 8px rgba(0,0,0,0.06)',
      glowNavy: '0 0 0 3px rgba(0,86,210,0.10), 0 4px 16px rgba(0,86,210,0.12)',
    },
    typography: {
      displayFont: "'Lato', 'Source Sans 3', 'Inter', sans-serif",
      bodyFont: "'Lato', 'Source Sans 3', 'Inter', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      displayWeight: 600, bodyWeight: 400, headingWeight: 600,
      displayLetterSpacing: -0.006,
    },
    gradients: {
      primary: 'linear-gradient(135deg, #002761 0%, #0056d2 55%, #3587fc 100%)',
      hero: 'linear-gradient(160deg, #001a4d 0%, #002761 35%, #0056d2 75%, #002761 100%)',
      warm: 'linear-gradient(135deg, #002761 0%, #0056d2 60%, #3587fc 100%)',
    },
  },

  /* ─── Crimson Prestige — Classic academic institution ─────── */
  crimson: {
    colors: {
      primary: '#A51C30', primaryHover: '#8C1728', primaryLight: '#C4324A', primaryDark: '#6B1020', primaryMuted: '#FCE8EB',
      secondary: '#1E1E1E', secondaryHover: '#2D2D2D', secondaryLight: '#A51C30',
      accent: '#B8860B', accentWarm: '#D4A017',
      bg: '#ffffff', bgSecondary: '#F9F6F3', bgTertiary: '#F0EBE5', bgCard: '#ffffff', bgHover: '#F5F0EA',
      text: '#1A1A1A', textSecondary: '#414141', textMuted: '#6C6C6C', textInverse: '#ffffff',
      border: '#C8C4BC', borderLight: '#E0DDD8', borderStrong: '#9A9590',
      navy: '#A51C30', navyMid: '#8C1728', navyLight: '#C4324A', navyPale: '#FCE8EB',
      gold: '#B8860B', goldMid: '#D4A017', goldLight: '#F8C21C', goldBright: '#FFD54F', goldPale: '#FDF6E3',
      cream: '#F9F6F3',
      danger: '#C41E3A', warning: '#B8860B', success: '#2E7D32', info: '#1565C0',
    },
    radii: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8, xxl: 10, xxxl: 12, pill: 50 },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },
    shadows: {
      xs: '0 1px 3px rgba(105,16,32,0.04)', sm: '0 1px 4px rgba(105,16,32,0.06)', md: '0 3px 12px rgba(105,16,32,0.08)',
      lg: '0 8px 24px rgba(105,16,32,0.10)', xl: '0 12px 36px rgba(105,16,32,0.12)', xxl: '0 16px 48px rgba(105,16,32,0.14)',
      card: '0 2px 8px rgba(105,16,32,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      cardHover: '0 6px 20px rgba(105,16,32,0.10), 0 2px 6px rgba(0,0,0,0.06)',
      glowNavy: '0 0 0 3px rgba(165,28,48,0.10), 0 4px 16px rgba(165,28,48,0.12)',
    },
    typography: {
      displayFont: "'Lato', 'Source Sans 3', -apple-system, sans-serif",
      bodyFont: "'Lato', 'Source Sans 3', -apple-system, sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      displayWeight: 700, bodyWeight: 400, headingWeight: 700,
      displayLetterSpacing: -0.01,
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6B1020 0%, #A51C30 55%, #C4324A 100%)',
      hero: 'linear-gradient(160deg, #1A0A10 0%, #3D0F1C 35%, #A51C30 75%, #6B1020 100%)',
      warm: 'linear-gradient(135deg, #B8860B 0%, #D4A017 50%, #B8860B 100%)',
    },
  },

  /* ─── Institutional — Enterprise LMS with neutral tones ──── */
  institutional: {
    colors: {
      primary: '#0070E0', primaryHover: '#005CB8', primaryLight: '#4DA3FF', primaryDark: '#004A99', primaryMuted: '#EBF5FF',
      secondary: '#394B58', secondaryHover: '#2D3D48', secondaryLight: '#5B7A8A',
      accent: '#49C9A8', accentWarm: '#FF8C00',
      bg: '#ffffff', bgSecondary: '#F5F6F7', bgTertiary: '#E8EAED', bgCard: '#ffffff', bgHover: '#EEF0F2',
      text: '#1E2A38', textSecondary: '#3D4F5F', textMuted: '#607890', textInverse: '#ffffff',
      border: '#C5CED6', borderLight: '#DEE3E8', borderStrong: '#8C9EAF',
      navy: '#1A3E5C', navyMid: '#2D5F8A', navyLight: '#4DA3FF', navyPale: '#EBF5FF',
      gold: '#E6A817', goldMid: '#FFB800', goldLight: '#FFCC33', goldBright: '#FFD633', goldPale: '#FFF8E1',
      cream: '#F5F6F7',
      danger: '#D42B2B', warning: '#E6A817', success: '#247D2B', info: '#0070E0',
    },
    radii: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10, xxl: 12, xxxl: 16, pill: 50 },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 },
    shadows: {
      xs: '0 1px 2px rgba(0,0,0,0.03)', sm: '0 1px 2px rgba(0,0,0,0.04)', md: '0 1px 4px rgba(0,0,0,0.05)',
      lg: '0 2px 8px rgba(0,0,0,0.06)', xl: '0 4px 12px rgba(0,0,0,0.08)', xxl: '0 6px 18px rgba(0,0,0,0.10)',
      card: '0 1px 2px rgba(0,0,0,0.04)',
      cardHover: '0 2px 6px rgba(0,0,0,0.06)',
      glowNavy: '0 0 0 3px rgba(0,112,224,0.10), 0 4px 16px rgba(0,112,224,0.12)',
    },
    typography: {
      displayFont: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      bodyFont: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      monoFont: "'SF Mono', 'Consolas', monospace",
      displayWeight: 700, bodyWeight: 400, headingWeight: 700,
      displayLetterSpacing: -0.01,
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1A3E5C 0%, #0070E0 55%, #4DA3FF 100%)',
      hero: 'linear-gradient(160deg, #0D1F2D 0%, #1A3E5C 35%, #2D5F8A 75%, #1A3E5C 100%)',
      warm: 'linear-gradient(135deg, #0070E0 0%, #49C9A8 60%, #0070E0 100%)',
    },
  },
}
