/** Demonstrações offline: nome do exercício (v2) -> pasta de frames (free-exercise-db).
 *  Cada pasta tem 0.jpg e 1.jpg (início e fim do movimento). */
export const DEMOS: Record<string, string> = {
  'Supino no chão com halteres': 'Dumbbell_Floor_Press',
  'Crucifixo no chão com halteres': 'Dumbbell_Flyes',
  'Crucifixo no chão': 'Dumbbell_Flyes',
  'Flexão de braço': 'Pushups',
  'Tríceps testa com halteres': 'Lying_Dumbbell_Tricep_Extension',
  'Tríceps mergulho na cadeira': 'Bench_Dips',
  'Remada curvada com halteres': 'Bent_Over_Two-Dumbbell_Row',
  'Remada unilateral': 'One-Arm_Dumbbell_Row',
  'Rosca direta com halteres': 'Dumbbell_Bicep_Curl',
  'Rosca direta': 'Dumbbell_Bicep_Curl',
  'Rosca martelo': 'Hammer_Curls',
  'Rosca com elástico': 'Dumbbell_Bicep_Curl',
  Prancha: 'Plank',
  'Prancha lateral': 'Side_Bridge',
  'Agachamento com halteres': 'Goblet_Squat',
  'Agachamento livre': 'Bodyweight_Squat',
  'Agachamento livre leve': 'Bodyweight_Squat',
  'Agachamento sumô': 'Plie_Dumbbell_Squat',
  'Agachamento sumô com halter': 'Plie_Dumbbell_Squat',
  'Afundo alternado': 'Bodyweight_Walking_Lunge',
  'Afundo búlgaro': 'Split_Squat_with_Dumbbells',
  'Stiff com halteres': 'Stiff-Legged_Dumbbell_Deadlift',
  'Stiff unilateral': 'Romanian_Deadlift',
  'Panturrilha em pé': 'Standing_Calf_Raises',
  Abdominal: 'Crunches',
  'Abdominal bicicleta': 'Air_Bike',
  'Elevação pélvica': 'Barbell_Glute_Bridge',
  'Elevação pélvica (hip thrust)': 'Barbell_Glute_Bridge',
  'Elevação pélvica unilateral': 'Single_Leg_Glute_Bridge',
  'Abdução de quadril': 'Thigh_Abductor',
  'Abdução no chão': 'Thigh_Abductor',
  'Flexão (apoio nos joelhos)': 'Pushups',
  'Flexão fechada': 'Incline_Push-Up_Close-Grip',
  'Remada com halteres': 'Bent_Over_Two-Dumbbell_Row',
  'Remada na mesa': 'Inverted_Row',
  'Desenvolvimento de ombros': 'Dumbbell_Shoulder_Press',
  'Desenvolvimento com halteres': 'Dumbbell_Shoulder_Press',
  'Pike push-up': 'Decline_Push-Up',
  'Elevação lateral': 'Side_Lateral_Raise',
  'Elevação de pernas': 'Flat_Bench_Lying_Leg_Raise',
  'Barra fixa': 'Pullups',
  'Puxada com elástico': 'Pullups',
  'Supino com barra': 'Dumbbell_Floor_Press',
  Polichinelo: 'Star_Jump',
  'Círculo de braços': 'Arm_Circles',
  'Rotação de tronco': 'Russian_Twist',
}

export function demoFrame(folder: string, n: number) {
  return `${import.meta.env.BASE_URL}demos/${folder}/${n}.jpg`
}

export function ytLink(nome: string) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(nome + ' execução exercício')
}
