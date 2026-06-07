import type { Exercise, Plan } from '@/types'

export const EQUIPMENT = [
  { key: 'bodyweight', label: 'Peso do corpo' },
  { key: 'dumbbell', label: 'Halteres' },
  { key: 'barbell', label: 'Barra' },
  { key: 'elastic', label: 'Elástico' },
  { key: 'kettlebell', label: 'Kettlebell' },
  { key: 'bench', label: 'Banco' },
  { key: 'pullupbar', label: 'Barra fixa' },
  { key: 'machine', label: 'Máquina' },
] as const

export const COLORS = [
  '#c6ff3a', '#ff5fa8', '#3ad1ff', '#a98bff', '#ffd23d', '#ff8a3a', '#3ddc84', '#6a8bff', '#b06aff',
]

export const FOCUS_OPTIONS = ['Geral', 'Peito', 'Costas', 'Pernas', 'Glúteos', 'Ombros', 'Braços', 'Core'] as const
export type Focus = (typeof FOCUS_OPTIONS)[number]

type Group = 'peito' | 'costas' | 'pernas' | 'gluteo' | 'ombro' | 'biceps' | 'triceps' | 'core'

type PoolItem = Exercise & { grupo: Group; eq: string[] }

const P = (
  nome: string,
  musculo: string,
  grupo: Group,
  eq: string[],
  series: number,
  reps: string,
  dica: string,
): PoolItem => ({ nome, musculo, grupo, eq, series, reps, dica })

const POOL: PoolItem[] = [
  // peito
  P('Flexão de braço', 'Peito', 'peito', ['bodyweight'], 4, 'máx', 'Corpo reto, desça até quase tocar o chão.'),
  P('Supino no chão com halteres', 'Peito', 'peito', ['dumbbell'], 4, '10', 'Empurre até esticar, desça controlando.'),
  P('Crucifixo no chão', 'Peito', 'peito', ['dumbbell'], 3, '12', 'Abra controlando, sinta o peito.'),
  P('Supino com barra', 'Peito', 'peito', ['barbell', 'bench'], 4, '8', 'Desça à linha do mamilo, empurre forte.'),
  // costas
  P('Remada curvada com halteres', 'Costas', 'costas', ['dumbbell'], 4, '10', 'Costas retas, puxe o cotovelo pra trás.'),
  P('Remada na mesa', 'Costas', 'costas', ['bodyweight'], 4, '12', 'Deite sob a mesa e puxe o peito até a borda.'),
  P('Barra fixa', 'Costas', 'costas', ['pullupbar'], 4, 'máx', 'Puxe até o queixo passar a barra.'),
  P('Puxada com elástico', 'Costas', 'costas', ['elastic'], 3, '15', 'Puxe até o peito, aperte as escápulas.'),
  // pernas
  P('Agachamento livre', 'Pernas', 'pernas', ['bodyweight'], 4, '20', 'Desça até a coxa paralela, joelho alinhado.'),
  P('Agachamento com halteres', 'Pernas', 'pernas', ['dumbbell'], 4, '12', 'Peso nos calcanhares, tronco firme.'),
  P('Afundo alternado', 'Pernas', 'pernas', ['bodyweight'], 3, '10/perna', 'Desça o joelho de trás quase ao chão.'),
  P('Stiff com halteres', 'Posterior', 'pernas', ['dumbbell'], 3, '12', 'Quadril pra trás, costas retas.'),
  P('Panturrilha em pé', 'Panturrilha', 'pernas', ['bodyweight'], 4, '20', 'Sobe no talão, segura 1s no topo.'),
  // glúteo
  P('Elevação pélvica', 'Glúteos', 'gluteo', ['bodyweight'], 4, '15', 'Suba apertando o glúteo, segura no topo.'),
  P('Agachamento sumô', 'Glúteos', 'gluteo', ['dumbbell'], 4, '12', 'Pés afastados, joelhos pra fora.'),
  P('Afundo búlgaro', 'Glúteos', 'gluteo', ['bodyweight'], 3, '10/perna', 'Pé de trás apoiado; desça vertical.'),
  P('Abdução de quadril', 'Glúteo médio', 'gluteo', ['bodyweight'], 3, '20', 'Eleve a perna lateral sem girar o tronco.'),
  // ombro
  P('Desenvolvimento com halteres', 'Ombros', 'ombro', ['dumbbell'], 3, '12', 'Empurre acima da cabeça sem arquear.'),
  P('Pike push-up', 'Ombros', 'ombro', ['bodyweight'], 3, '10', 'Quadril alto, empurre a cabeça pro chão.'),
  P('Elevação lateral', 'Ombros', 'ombro', ['dumbbell'], 3, '15', 'Suba até a linha do ombro, controle.'),
  // bíceps
  P('Rosca direta com halteres', 'Bíceps', 'biceps', ['dumbbell'], 3, '12', 'Cotovelo fixo, suba sem balançar.'),
  P('Rosca martelo', 'Bíceps', 'biceps', ['dumbbell'], 3, '12', 'Pegada neutra, controla a descida.'),
  P('Rosca com elástico', 'Bíceps', 'biceps', ['elastic'], 3, '15', 'Tensão constante, sobe e desce devagar.'),
  // tríceps
  P('Tríceps mergulho na cadeira', 'Tríceps', 'triceps', ['bodyweight'], 3, '15', 'Desça devagar, suba esticando o cotovelo.'),
  P('Tríceps testa com halteres', 'Tríceps', 'triceps', ['dumbbell'], 3, '12', 'Cotovelos parados, só o antebraço move.'),
  P('Flexão fechada', 'Tríceps', 'triceps', ['bodyweight'], 3, '12', 'Mãos próximas, cotovelos rentes ao corpo.'),
  // core
  P('Prancha', 'Core', 'core', ['bodyweight'], 3, '45s', 'Corpo reto, abdômen e glúteo contraídos.'),
  P('Abdominal', 'Core', 'core', ['bodyweight'], 3, '20', 'Suba com o abdômen, não puxe o pescoço.'),
  P('Elevação de pernas', 'Core', 'core', ['bodyweight'], 3, '15', 'Desça as pernas controlando, lombar no chão.'),
  P('Prancha lateral', 'Core', 'core', ['bodyweight'], 3, '30s/lado', 'Quadril alto, corpo em linha.'),
]

const AQUECIMENTO: Exercise[] = [
  { nome: 'Polichinelo', musculo: 'Corpo todo', series: 2, reps: '40s', dica: 'Ritmo constante, ative a respiração.' },
  { nome: 'Círculo de braços', musculo: 'Ombros', series: 2, reps: '20s', dica: 'Frente e trás, amplitude completa.' },
  { nome: 'Agachamento livre leve', musculo: 'Pernas', series: 2, reps: '15', dica: 'Desça controlando, só pra aquecer.' },
  { nome: 'Rotação de tronco', musculo: 'Core', series: 2, reps: '20s', dica: 'Solta a coluna e o quadril.' },
]

const FOCUS_GROUP: Record<Focus, Group | null> = {
  Geral: null, Peito: 'peito', Costas: 'costas', Pernas: 'pernas',
  Glúteos: 'gluteo', Ombros: 'ombro', Braços: 'biceps', Core: 'core',
}

// rotação base de grupos por treino
const ROTATION: Record<'A' | 'B' | 'C', Group[]> = {
  A: ['peito', 'triceps', 'core'],
  B: ['costas', 'biceps', 'ombro'],
  C: ['pernas', 'gluteo', 'core'],
}

const LABELS: Record<'A' | 'B' | 'C', string> = {
  A: 'Peito + Tríceps',
  B: 'Costas + Bíceps',
  C: 'Pernas + Glúteos',
}

export function generatePlan(equipment: string[], focus: Focus, perDay = 5): Plan {
  const allowed = new Set(equipment.length ? equipment : ['bodyweight'])
  const eligible = POOL.filter((e) => e.eq.every((k) => allowed.has(k)))
  const used = new Set<string>()

  function pick(group: Group): Exercise | null {
    let cand = eligible.filter((e) => e.grupo === group && !used.has(e.nome))
    if (!cand.length) cand = eligible.filter((e) => !used.has(e.nome))
    if (!cand.length) return null
    const e = cand[used.size % cand.length]
    used.add(e.nome)
    return { nome: e.nome, musculo: e.musculo, series: e.series, reps: e.reps, dica: e.dica }
  }

  const fg = FOCUS_GROUP[focus]
  function buildDay(base: Group[]): Exercise[] {
    const groups = fg ? [fg, fg, ...base.filter((g) => g !== fg)] : [...base]
    const out: Exercise[] = []
    let i = 0
    while (out.length < perDay) {
      const ex = pick(groups[i % groups.length])
      if (ex) out.push(ex)
      else break
      i++
    }
    return out
  }

  return {
    focus,
    labels: LABELS,
    treinos: {
      A: buildDay(ROTATION.A),
      B: buildDay(ROTATION.B),
      C: buildDay(ROTATION.C),
      warm: AQUECIMENTO,
    },
  }
}
