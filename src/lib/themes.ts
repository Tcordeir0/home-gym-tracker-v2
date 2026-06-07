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

const ON = '#0d0f12'

function t(
  id: string,
  name: string,
  bg: string,
  surface: string,
  surface2: string,
  line: string,
  text: string,
  muted: string,
  accent: string,
  onAccent = ON,
): Theme {
  return { id, name, vars: { bg, surface, surface2, line, text, muted, accent, onAccent } }
}

export const THEMES: Record<string, Theme> = {
  default: t('default', 'Padrão', '#0d0f12', '#15181d', '#1c2027', '#2a2f37', '#eef1f5', '#8b94a3', '#c6ff3a'),
  blocos: t('blocos', 'Mundo de Blocos', '#1a2417', '#233018', '#2d3b1f', '#3a4a28', '#eaf3d8', '#93a878', '#7bc043'),
  neon: t('neon', 'Cidade Neon', '#0d0a1a', '#16112b', '#1f1838', '#2c2348', '#f3eeff', '#9a8fc0', '#ff3df0'),
  monstros: t('monstros', 'Mestre dos Monstros', '#1a0e0e', '#241414', '#2e1a1a', '#3d2424', '#fdeeee', '#c08a8a', '#ee3b3b'),
  cinza: t('cinza', 'Deus da Cinza', '#14110f', '#1d1815', '#261f1b', '#342a24', '#efe7e0', '#a8978c', '#c0392b'),
  lava: t('lava', 'Lava', '#160c08', '#21110a', '#2c170d', '#3d2113', '#ffeede', '#c0937a', '#ff5a1f'),
  oceano: t('oceano', 'Oceano', '#07121a', '#0d1d2b', '#12283a', '#1c3a52', '#e2f3ff', '#84a8c0', '#2fd0e0'),
  dourado: t('dourado', 'Reino Dourado', '#14120a', '#1e1b0f', '#282413', '#3a341d', '#fbf4dd', '#bcae82', '#ffd24a'),
  vaporwave: t('vaporwave', 'Vaporwave', '#120a1e', '#1c1030', '#26173f', '#382458', '#ffe9ff', '#b48fd0', '#ff77e1'),
  hq: t('hq', 'Quadrinhos', '#17141b', '#201b27', '#2a2433', '#392f44', '#f3eef7', '#a596b0', '#ff2e4d'),
  cyber: t('cyber', 'Cyberpunk', '#070a12', '#0e1320', '#141b2e', '#203049', '#dffaff', '#6f97b5', '#00efff'),
  noir: t('noir', 'Noir', '#101012', '#191a1d', '#222327', '#34363c', '#f2f2f2', '#9a9ba0', '#e6e6e6'),
  cosmico: t('cosmico', 'Herói Cósmico', '#0a0820', '#130f2e', '#1b163d', '#2a2356', '#ece8ff', '#9a8fc8', '#9b6bff'),
  anime: t('anime', 'Anime', '#1b1422', '#261b30', '#31243d', '#43324f', '#fdeef7', '#bd9cc0', '#ff9ec7'),
}

export const ALL_THEME_IDS = Object.keys(THEMES).filter((id) => id !== 'default')

const KEYS: Array<[keyof ThemeVars, string]> = [
  ['bg', '--bg'], ['surface', '--surface'], ['surface2', '--surface-2'], ['line', '--line'],
  ['text', '--text'], ['muted', '--muted'], ['accent', '--accent'], ['onAccent', '--on-accent'],
]

export function applyTheme(id: string) {
  const theme = THEMES[id] ?? THEMES.default
  const root = document.documentElement.style
  for (const [k, cssVar] of KEYS) root.setProperty(cssVar, theme.vars[k])
}
