import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/* ═══════════════════════════════════════════════════════════════
   ACAEDU MOBILE — Universal Theme Tokens
   Single source of truth for React Native, matching web CSS vars
   Same values as src/lib/theme.tsx presetTokens
   ═══════════════════════════════════════════════════════════════ */

export type Preset = 'default' | 'blue' | 'crimson' | 'institutional'

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
    xs: object; sm: object; md: object; lg: object; xl: object; xxl: object
    card: object; cardHover: object; glowNavy: object
  }
  typography: {
    displayFont: string; bodyFont: string; monoFont: string
    displayWeight: string; bodyWeight: string; headingWeight: string
  }
}

/* ─── Default (Acaedu) — Khan Academy / Moodle ──────────── */
const defaultTokens: PresetTokens = {
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
    xs: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, shadowColor: '#000' },
    sm: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, shadowColor: '#000' },
    md: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 12, shadowColor: '#000' },
    lg: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.09, shadowRadius: 20, shadowColor: '#000' },
    xl: { shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.11, shadowRadius: 36, shadowColor: '#000' },
    xxl: { shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.14, shadowRadius: 48, shadowColor: '#000' },
    card: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, shadowColor: '#000' },
    cardHover: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, shadowColor: '#000' },
    glowNavy: { shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 16, shadowColor: '#1865f2' },
  },
  typography: {
    displayFont: 'Lato-Bold', bodyFont: 'Lato-Regular', monoFont: 'Courier',
    displayWeight: '800' as const, bodyWeight: '400' as const, headingWeight: '700' as const,
  },
}

/* ─── Blue Academy — Coursera ───────────────────────────── */
const blueTokens: PresetTokens = {
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
    xs: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 2, shadowColor: '#000' },
    sm: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, shadowColor: '#000' },
    md: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, shadowColor: '#000' },
    lg: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 14, shadowColor: '#000' },
    xl: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 20, shadowColor: '#000' },
    xxl: { shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 28, shadowColor: '#000' },
    card: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, shadowColor: '#000' },
    cardHover: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, shadowColor: '#000' },
    glowNavy: { shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 16, shadowColor: '#0056d2' },
  },
  typography: {
    displayFont: 'SourceSans3-SemiBold', bodyFont: 'SourceSans3-Regular', monoFont: 'Courier',
    displayWeight: '600' as const, bodyWeight: '400' as const, headingWeight: '600' as const,
  },
}

/* ─── Crimson Prestige — Harvard/MIT ────────────────────── */
const crimsonTokens: PresetTokens = {
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
    xs: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, shadowColor: '#691020' },
    sm: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, shadowColor: '#691020' },
    md: { shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 12, shadowColor: '#691020' },
    lg: { shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 24, shadowColor: '#691020' },
    xl: { shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.12, shadowRadius: 36, shadowColor: '#691020' },
    xxl: { shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.14, shadowRadius: 48, shadowColor: '#691020' },
    card: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, shadowColor: '#691020' },
    cardHover: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.10, shadowRadius: 20, shadowColor: '#691020' },
    glowNavy: { shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 16, shadowColor: '#A51C30' },
  },
  typography: {
    displayFont: 'Georgia', bodyFont: 'SourceSans3-Regular', monoFont: 'Courier',
    displayWeight: '700' as const, bodyWeight: '400' as const, headingWeight: '700' as const,
  },
}

/* ─── Institutional — Canvas LMS / Workday ──────────────── */
const institutionalTokens: PresetTokens = {
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
    xs: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, shadowColor: '#000' },
    sm: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, shadowColor: '#000' },
    md: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, shadowColor: '#000' },
    lg: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, shadowColor: '#000' },
    xl: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, shadowColor: '#000' },
    xxl: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.10, shadowRadius: 18, shadowColor: '#000' },
    card: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, shadowColor: '#000' },
    cardHover: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, shadowColor: '#000' },
    glowNavy: { shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 16, shadowColor: '#0070E0' },
  },
  typography: {
    displayFont: 'System', bodyFont: 'System', monoFont: 'Courier',
    displayWeight: '700' as const, bodyWeight: '400' as const, headingWeight: '700' as const,
  },
}

/* ─── Token registry ────────────────────────────────────── */
export const presetTokens: Record<Preset, PresetTokens> = {
  default: defaultTokens,
  blue: blueTokens,
  crimson: crimsonTokens,
  institutional: institutionalTokens,
}

export const presetMeta: Record<Preset, { label: string; desc: string; color: string }> = {
  default:       { label: 'Acaedu',          desc: 'Khan Academy / Moodle — warm, approachable, wonder-blocks',       color: '#1865f2' },
  blue:          { label: 'Blue Academy',     desc: 'Coursera — voltage blue, border-first cards, 8px/50px radii',    color: '#0056d2' },
  crimson:       { label: 'Crimson Prestige', desc: 'Harvard / MIT — sharp 4px scholarly radii, deep warm shadows',   color: '#a51c30' },
  institutional: { label: 'Institutional',    desc: 'Canvas LMS — flat 12px cards, strong borders, compact system font', color: '#0070E0' },
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE THEME CONTEXT — Runtime preset switching
   ═══════════════════════════════════════════════════════════════ */

interface ThemeContextValue {
  preset: Preset
  tokens: PresetTokens
  setPreset: (p: Preset) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  preset: 'default',
  tokens: defaultTokens,
  setPreset: () => {},
})

const STORAGE_KEY = 'acaedu-academic'

async function loadPreset(): Promise<Preset> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY)
    if (stored && presetTokens[stored as Preset]) return stored as Preset
  } catch {}
  return 'default'
}

export function MobileThemeProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<Preset>('default')

  useEffect(() => {
    loadPreset().then(setPresetState)
  }, [])

  const setPreset = (p: Preset) => {
    setPresetState(p)
    AsyncStorage.setItem(STORAGE_KEY, p).catch(() => {})
  }

  const tokens = presetTokens[preset]

  return (
    <ThemeContext.Provider value={{ preset, tokens, setPreset }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useMobileTheme() {
  return useContext(ThemeContext)
}

/* ═══════════════════════════════════════════════════════════════
   CONVENIENCE EXPORTS — Backward-compatible flat access
   Uses current preset tokens for all flat exports
   ═══════════════════════════════════════════════════════════════ */

// For screens that haven't migrated to useMobileTheme() yet,
// these exports provide the default preset values.
// New screens should use useMobileTheme().tokens instead.

export const colors = defaultTokens.colors
export const spacing = defaultTokens.spacing
export const borderRadius = defaultTokens.radii
export const shadows = defaultTokens.shadows
export const typography = defaultTokens.typography
