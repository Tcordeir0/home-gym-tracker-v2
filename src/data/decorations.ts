/** Decorações de avatar (estilo Discord) — molduras SVG que abraçam o avatar.
 *  viewBox 0 0 100 100; o avatar fica no centro (~64%), a decoração desenha a borda/ornamentos. */

export type Decoration = { id: string; name: string; svg: string }

export const DECORATIONS: Record<string, Decoration> = {
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <defs><linearGradient id='au' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#00efff'/><stop offset='.5' stop-color='#9b6bff'/><stop offset='1' stop-color='#ff5fa8'/>
      </linearGradient></defs>
      <circle cx='50' cy='50' r='46' fill='none' stroke='url(#au)' stroke-width='5'/></svg>`,
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r='46' fill='none' stroke='#00eaff' stroke-width='4' opacity='.35'/>
      <circle cx='50' cy='50' r='46' fill='none' stroke='#00eaff' stroke-width='2'/></svg>`,
  },
  ouro: {
    id: 'ouro',
    name: 'Ouro',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r='47' fill='none' stroke='#ffd24a' stroke-width='3'/>
      <circle cx='50' cy='50' r='42' fill='none' stroke='#e0a92e' stroke-width='2'/></svg>`,
  },
  coroa: {
    id: 'coroa',
    name: 'Coroa',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r='46' fill='none' stroke='#ffd24a' stroke-width='3'/>
      <path d='M34 16 L42 26 L50 14 L58 26 L66 16 L63 32 L37 32 Z' fill='#ffd24a' stroke='#b8860b' stroke-width='1'/></svg>`,
  },
  estelar: {
    id: 'estelar',
    name: 'Estelar',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r='46' fill='none' stroke='#9b6bff' stroke-width='3'/>
      <g fill='#fff'><circle cx='50' cy='4' r='3'/><circle cx='86' cy='30' r='2.4'/><circle cx='86' cy='70' r='2.4'/><circle cx='14' cy='30' r='2.4'/><circle cx='14' cy='70' r='2.4'/></g></svg>`,
  },
  chama: {
    id: 'chama',
    name: 'Chama',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r='46' fill='none' stroke='#ff5a1f' stroke-width='4'/>
      <path d='M50 2 q6 8 0 14 q-6-6 0-14' fill='#ff8a3a'/></svg>`,
  },
  louros: {
    id: 'louros',
    name: 'Louros',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r='46' fill='none' stroke='#3ddc84' stroke-width='3'/>
      <g fill='#3ddc84'><ellipse cx='20' cy='62' rx='3' ry='6' transform='rotate(-30 20 62)'/><ellipse cx='26' cy='74' rx='3' ry='6' transform='rotate(-10 26 74)'/><ellipse cx='80' cy='62' rx='3' ry='6' transform='rotate(30 80 62)'/><ellipse cx='74' cy='74' rx='3' ry='6' transform='rotate(10 74 74)'/></g></svg>`,
  },
  raio: {
    id: 'raio',
    name: 'Raio',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r='46' fill='none' stroke='#ffd23d' stroke-width='3' stroke-dasharray='3 4'/>
      <path d='M54 6 L44 24 L52 24 L46 40' fill='none' stroke='#ffd23d' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/></svg>`,
  },
}

export const ALL_DECORATIONS = Object.keys(DECORATIONS)
