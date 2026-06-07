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

/* Estilo de textura ambiente por tema (mostra sutil no fundo, atrás dos cards). */
type TexStyle = 'dots' | 'grid' | 'scanline' | 'grain' | 'stars' | 'speckle'
const TEX_STYLE: Record<string, TexStyle> = {
  default: 'dots', blocos: 'speckle', neon: 'grid', monstros: 'speckle', cinza: 'grain',
  lava: 'speckle', oceano: 'dots', dourado: 'speckle', vaporwave: 'grid', hq: 'dots',
  cyber: 'scanline', noir: 'grain', cosmico: 'stars', anime: 'dots',
}

function svg(inner: string, w: number, h: number) {
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${inner}</svg>`)}")`
}

function buildTexture(style: TexStyle, c: string): string {
  switch (style) {
    case 'dots':
      return svg(`<circle cx='6' cy='6' r='1.6' fill='${c}'/><circle cx='20' cy='20' r='1.6' fill='${c}'/>`, 28, 28)
    case 'grid':
      return svg(`<path d='M34 0H0V34' fill='none' stroke='${c}' stroke-width='1'/>`, 34, 34)
    case 'scanline':
      return svg(`<rect width='6' height='1.2' fill='${c}'/>`, 6, 6)
    case 'grain':
      return svg(
        [
          [4, 7], [11, 2], [19, 14], [27, 5], [33, 22], [8, 25], [22, 30], [16, 9],
          [30, 33], [2, 18], [25, 19], [13, 35], [36, 12], [6, 34],
        ]
          .map(([x, y]) => `<rect x='${x}' y='${y}' width='1.4' height='1.4' fill='${c}'/>`)
          .join(''),
        40, 40,
      )
    case 'stars':
      return svg(
        `<circle cx='10' cy='12' r='1' fill='${c}'/><circle cx='40' cy='8' r='1.8' fill='${c}'/><circle cx='28' cy='34' r='1' fill='${c}'/><circle cx='52' cy='44' r='1.4' fill='${c}'/><circle cx='18' cy='50' r='0.9' fill='${c}'/><circle cx='46' cy='22' r='0.9' fill='${c}'/>`,
        60, 60,
      )
    case 'speckle':
      return svg(
        `<rect x='5' y='8' width='2' height='2' fill='${c}'/><rect x='18' y='4' width='2' height='2' fill='${c}'/><rect x='12' y='20' width='2' height='2' fill='${c}'/><rect x='24' y='24' width='2' height='2' fill='${c}'/><rect x='28' y='12' width='2' height='2' fill='${c}'/>`,
        32, 32,
      )
  }
}

export function applyTheme(id: string) {
  const theme = THEMES[id] ?? THEMES.default
  const root = document.documentElement.style
  for (const [k, cssVar] of KEYS) root.setProperty(cssVar, theme.vars[k])
  root.setProperty('--tex', buildTexture(TEX_STYLE[id] ?? 'dots', theme.vars.accent))
}
