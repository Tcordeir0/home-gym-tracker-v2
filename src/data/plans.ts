import type { Exercise, Plan, Profile } from '@/types'

const ex = (
  nome: string,
  musculo: string,
  series: number,
  reps: string,
  dica: string,
): Exercise => ({ nome, musculo, series, reps, dica })

/** Aquecimento compartilhado (sem carga). */
const AQUECIMENTO: Exercise[] = [
  ex('Polichinelo', 'Corpo todo', 2, '40s', 'Ritmo constante, ative a respiração.'),
  ex('Círculo de braços', 'Ombros', 2, '20s', 'Frente e trás, amplitude completa.'),
  ex('Agachamento livre leve', 'Pernas', 2, '15', 'Desça controlando, só pra aquecer.'),
  ex('Rotação de tronco', 'Core', 2, '20s', 'Solta a coluna e o quadril.'),
]

const TALYS_PLAN: Plan = {
  focus: 'Peito',
  labels: { A: 'Peito + Tríceps', B: 'Costas + Bíceps', C: 'Pernas + Core' },
  treinos: {
    A: [
      ex('Supino no chão com halteres', 'Peito', 4, '10', 'Desça até o cotovelo tocar o chão; empurre forte.'),
      ex('Crucifixo no chão com halteres', 'Peito', 3, '12', 'Abra controlando, sinta o peito alongar.'),
      ex('Flexão de braço', 'Peito', 3, 'máx', 'Corpo reto, desça até quase tocar o chão.'),
      ex('Tríceps testa com halteres', 'Tríceps', 3, '12', 'Cotovelos parados, só o antebraço move.'),
      ex('Tríceps mergulho na cadeira', 'Tríceps', 3, '15', 'Desça devagar, suba esticando o cotovelo.'),
    ],
    B: [
      ex('Remada curvada com halteres', 'Costas', 4, '10', 'Costas retas, puxe o cotovelo pra trás.'),
      ex('Remada unilateral', 'Costas', 3, '12', 'Apoie no sofá; puxe encostando no quadril.'),
      ex('Rosca direta com halteres', 'Bíceps', 3, '12', 'Cotovelo fixo, suba sem balançar.'),
      ex('Rosca martelo', 'Bíceps', 3, '12', 'Pegada neutra, controla a descida.'),
      ex('Prancha', 'Core', 3, '45s', 'Corpo reto, abdômen e glúteo contraídos.'),
    ],
    C: [
      ex('Agachamento com halteres', 'Pernas', 4, '12', 'Desça até a coxa paralela, joelho alinhado.'),
      ex('Afundo alternado', 'Pernas', 3, '10/perna', 'Passo firme, desça o joelho de trás.'),
      ex('Stiff com halteres', 'Posterior', 3, '12', 'Empurre o quadril pra trás, costas retas.'),
      ex('Panturrilha em pé', 'Panturrilha', 4, '20', 'Sobe no talão, segura 1s no topo.'),
      ex('Abdominal', 'Core', 3, '20', 'Suba com o abdômen, não puxe o pescoço.'),
    ],
    warm: AQUECIMENTO,
  },
}

const ANDRESSA_PLAN: Plan = {
  focus: 'Glúteos',
  labels: { A: 'Glúteos + Posterior', B: 'Superior + Core', C: 'Pernas completo' },
  treinos: {
    A: [
      ex('Elevação pélvica (hip thrust)', 'Glúteos', 4, '15', 'Suba apertando o glúteo, segura no topo.'),
      ex('Agachamento sumô com halter', 'Glúteos', 4, '12', 'Pés afastados, desça empurrando os joelhos pra fora.'),
      ex('Afundo búlgaro', 'Glúteos', 3, '10/perna', 'Pé de trás no sofá; desça vertical.'),
      ex('Stiff com halteres', 'Posterior', 3, '12', 'Quadril pra trás, sinta o posterior.'),
      ex('Abdução de quadril', 'Glúteo médio', 3, '20', 'Eleve a perna lateral sem girar o tronco.'),
    ],
    B: [
      ex('Flexão (apoio nos joelhos)', 'Peito', 3, '12', 'Desça controlando, corpo reto até os joelhos.'),
      ex('Remada com halteres', 'Costas', 3, '12', 'Puxe os cotovelos pra trás, aperte as escápulas.'),
      ex('Desenvolvimento de ombros', 'Ombros', 3, '12', 'Empurre acima da cabeça sem arquear as costas.'),
      ex('Rosca direta', 'Bíceps', 3, '12', 'Sobe e desce controlando.'),
      ex('Prancha lateral', 'Core', 3, '30s/lado', 'Quadril alto, corpo em linha.'),
    ],
    C: [
      ex('Agachamento livre', 'Pernas', 4, '15', 'Desça até paralela, peso nos calcanhares.'),
      ex('Elevação pélvica unilateral', 'Glúteos', 3, '12/perna', 'Uma perna só; suba apertando o glúteo.'),
      ex('Stiff unilateral', 'Posterior', 3, '10/perna', 'Equilíbrio e controle, costas retas.'),
      ex('Abdução no chão', 'Glúteo médio', 3, '20/lado', 'Perna de cima sobe controlando.'),
      ex('Abdominal bicicleta', 'Core', 3, '20', 'Cotovelo no joelho oposto, devagar.'),
    ],
    warm: AQUECIMENTO,
  },
}

function base(over: Partial<Profile> & Pick<Profile, 'id' | 'name' | 'color' | 'plan'>): Profile {
  return {
    photo: null,
    equipment: ['bodyweight', 'dumbbell'],
    theme: 'default',
    level: 1,
    freezes: 0,
    quests: { week: '', claimed: {} },
    ...over,
  }
}

export function defaultProfiles(): Profile[] {
  return [
    base({ id: 'u1', name: 'Talys', color: '#c6ff3a', plan: TALYS_PLAN }),
    base({ id: 'u2', name: 'Andressa', color: '#ff5fa8', plan: ANDRESSA_PLAN }),
  ]
}
