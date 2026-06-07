/** Sistema de temas: cada tema é um conjunto de variáveis CSS aplicadas em :root.
 *  Aplicar por variável (não por classe global) evita o vazamento de CSS do v1. */

export type ThemeVars = {
  bg: string
  surface: string
  surface2: string
  line: string
  text: string
  muted: string
  accent: string
  onAccent: string
}

export type Theme = { id: string; name: string; vars: ThemeVars }

export const THEMES: Record<string, Theme> = {
  default: {
    id: 'default', name: 'Padrão',
    vars: { bg: '#0d0f12', surface: '#15181d', surface2: '#1c2027', line: '#2a2f37', text: '#eef1f5', muted: '#8b94a3', accent: '#c6ff3a', onAccent: '#0d0f12' },
  },
  cyber: {
    id: 'cyber', name: 'Cyberpunk',
    vars: { bg: '#070a12', surface: '#0e1320', surface2: '#141b2e', line: '#203049', text: '#dffaff', muted: '#6f97b5', accent: '#00efff', onAccent: '#021014' },
  },
  cosmico: {
    id: 'cosmico', name: 'Herói Cósmico',
    vars: { bg: '#0a0820', surface: '#130f2e', surface2: '#1b163d', line: '#2a2356', text: '#ece8ff', muted: '#9a8fc8', accent: '#9b6bff', onAccent: '#0d0820' },
  },
  anime: {
    id: 'anime', name: 'Anime',
    vars: { bg: '#1b1422', surface: '#261b30', surface2: '#31243d', line: '#43324f', text: '#fdeef7', muted: '#bd9cc0', accent: '#ff9ec7', onAccent: '#2a0f1c' },
  },
}

const KEYS: Array<[keyof ThemeVars, string]> = [
  ['bg', '--bg'], ['surface', '--surface'], ['surface2', '--surface-2'], ['line', '--line'],
  ['text', '--text'], ['muted', '--muted'], ['accent', '--accent'], ['onAccent', '--on-accent'],
]

export function applyTheme(id: string) {
  const theme = THEMES[id] ?? THEMES.default
  const root = document.documentElement.style
  for (const [k, cssVar] of KEYS) root.setProperty(cssVar, theme.vars[k])
}
