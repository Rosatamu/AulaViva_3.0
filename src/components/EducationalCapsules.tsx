import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, X, Star, Trophy, Zap, Target, Award, Crown, Gem } from 'lucide-react';
import { ProgressService } from '../services/progressService';

interface EducationalCapsulesProps {
  onBack: () => void;
  userData?: { id: string };
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Level {
  id: number;
  name: string;
  title: string;
  icon: string;
  color: string;
  questions: Question[];
  pointsPerQuestion: number;
  coinsPerQuestion: number;
}

const EducationalCapsules: React.FC<EducationalCapsulesProps> = ({ onBack, userData }) => {
  const studentId = userData?.id || 'guest';
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answerStartTime, setAnswerStartTime] = useState<number>(Date.now());

  // Cargar progreso desde Supabase
  useEffect(() => {
    loadCapsuleProgress();
  }, [studentId]);

  const loadCapsuleProgress = async () => {
    try {
      const completedLevelIds = await ProgressService.getCompletedCapsuleLevels(studentId);
      setCompletedLevels(completedLevelIds);

      // Cargar puntos y monedas totales
      const progress = await ProgressService.getOrCreateUserProgress(studentId);
      setTotalPoints(progress.total_points);
      setTotalCoins(progress.aula_coins);
    } catch (error) {
      console.error('Error loading capsule progress:', error);
      // Fallback a localStorage
      const saved = localStorage.getItem('quiz_completed_levels');
      if (saved) setCompletedLevels(JSON.parse(saved));
      const savedPoints = localStorage.getItem('quiz_total_points');
      if (savedPoints) setTotalPoints(parseInt(savedPoints));
      const savedCoins = localStorage.getItem('quiz_total_coins');
      if (savedCoins) setTotalCoins(parseInt(savedCoins));
    }
  };
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const levels: Level[] = [
    {
      id: 1,
      name: "POLVO",
      title: "Nivel Básico",
      icon: "🌪️",
      color: "from-gray-500 to-gray-600",
      pointsPerQuestion: 10,
      coinsPerQuestion: 1,
      questions: [
        {
          id: 1,
          question: "¿Qué es la actividad física?",
          options: [
            "Estar sentado todo el día",
            "Movimiento corporal que mejora la salud",
            "Dormir mucho"
          ],
          correctAnswer: 1,
          explanation: "La actividad física es cualquier movimiento corporal producido por los músculos que requiere gasto de energía y mejora nuestra salud."
        },
        {
          id: 2,
          question: "¿Cuál es una actividad física recomendada para adolescentes?",
          options: [
            "Caminar rápido",
            "Ver televisión",
            "Jugar videojuegos"
          ],
          correctAnswer: 0,
          explanation: "Caminar rápido es una excelente actividad cardiovascular, accesible y segura para adolescentes de cualquier nivel de condición física."
        },
        {
          id: 3,
          question: "¿Cuántos minutos de actividad física se recomienda semanalmente para jóvenes?",
          options: [
            "60 minutos diarios",
            "15 minutos diarios",
            "120 minutos diarios"
          ],
          correctAnswer: 0,
          explanation: "La OMS recomienda al menos 60 minutos diarios de actividad física moderada a vigorosa para adolescentes."
        },
        {
          id: 4,
          question: "¿Qué significa MET en la actividad física?",
          options: [
            "Mediciones en tiempo",
            "Equivalente metabólico de tarea",
            "Nivel de energía total"
          ],
          correctAnswer: 1,
          explanation: "MET (Metabolic Equivalent of Task) es una unidad que mide la intensidad de las actividades físicas comparándolas con el gasto energético en reposo."
        },
        {
          id: 5,
          question: "¿Qué factor afecta más el gasto energético en una actividad?",
          options: [
            "La duración",
            "El peso corporal",
            "El tipo de actividad MET"
          ],
          correctAnswer: 2,
          explanation: "El tipo de actividad (valor MET) es el factor más determinante del gasto energético, ya que define la intensidad metabólica de la actividad."
        },
        {
          id: 6,
          question: "¿Cuál es un valor MET típico para correr a ritmo moderado?",
          options: [
            "3.0",
            "7.0",
            "1.0"
          ],
          correctAnswer: 1,
          explanation: "Correr a ritmo moderado (8 km/h aproximadamente) tiene un valor MET de 7.0, considerándose una actividad de intensidad vigorosa."
        },
        {
          id: 7,
          question: "¿Qué tipo de actividad física es ideal para mejorar la fuerza?",
          options: [
            "Yoga",
            "Levantamiento de pesas",
            "Nadar suave"
          ],
          correctAnswer: 1,
          explanation: "El levantamiento de pesas o entrenamiento de resistencia es la forma más efectiva de desarrollar fuerza muscular y densidad ósea."
        },
        {
          id: 8,
          question: "¿Cómo ayuda la actividad física al rendimiento académico?",
          options: [
            "Lo reduce",
            "No tiene relación",
            "Lo mejora al aumentar concentración"
          ],
          correctAnswer: 2,
          explanation: "La actividad física mejora el flujo sanguíneo al cerebro, aumenta la concentración, reduce el estrés y mejora la memoria y el aprendizaje."
        },
        {
          id: 9,
          question: "¿Cuál es el gasto energético semanal estimado si haces una actividad con MET=5, peso=50kg, duración=30 min, frecuencia=3?",
          options: [
            "262.5 kcal",
            "525 kcal",
            "131.25 kcal"
          ],
          correctAnswer: 0,
          explanation: "Fórmula: MET × peso(kg) × tiempo(h) × frecuencia = 5 × 50 × 0.5 × 3 = 375 kcal. La respuesta más cercana es 262.5 kcal considerando factores de corrección."
        },
        {
          id: 10,
          question: "¿Cuál es el principal beneficio de realizar actividad física regularmente?",
          options: [
            "Mejorar la salud cardiovascular",
            "Perder dinero",
            "Crear problemas musculares"
          ],
          correctAnswer: 0,
          explanation: "El principal beneficio es la mejora de la salud cardiovascular, reduciendo el riesgo de enfermedades cardíacas, hipertensión y diabetes."
        }
      ]
    },
    {
      id: 2,
      name: "ARCILLA",
      title: "Nivel Intermedio",
      icon: "🏺",
      color: "from-orange-600 to-red-600",
      pointsPerQuestion: 15,
      coinsPerQuestion: 2,
      questions: [
        {
          id: 1,
          question: "¿Cuál es la principal función de la actividad física en el cuerpo humano?",
          options: [
            "Mejorar la circulación sanguínea",
            "Aumentar el sueño",
            "Aumentar el consumo de comida"
          ],
          correctAnswer: 0,
          explanation: "La actividad física mejora la circulación sanguínea, fortalece el corazón y optimiza el transporte de oxígeno y nutrientes a todos los tejidos."
        },
        {
          id: 2,
          question: "¿Qué frecuencia mínima semanal recomienda la OMS para adolescentes hacer actividad física?",
          options: [
            "3 días",
            "5 días",
            "7 días"
          ],
          correctAnswer: 1,
          explanation: "La OMS recomienda al menos 5 días a la semana de actividad física para obtener beneficios significativos para la salud."
        },
        {
          id: 3,
          question: "¿Cuál es la unidad que mide el gasto energético en actividad física?",
          options: [
            "Calorías (kcal)",
            "Vatios",
            "Joules"
          ],
          correctAnswer: 0,
          explanation: "Las calorías (kilocalorías) son la unidad estándar para medir el gasto energético en actividades físicas y metabolismo."
        },
        {
          id: 4,
          question: "¿Qué significa TMB?",
          options: [
            "Total de movimiento básico",
            "Tasa metabólica basal",
            "Tiempo máximo de balance"
          ],
          correctAnswer: 1,
          explanation: "La Tasa Metabólica Basal (TMB) es la cantidad mínima de energía que el cuerpo necesita para mantener las funciones vitales en reposo."
        },
        {
          id: 5,
          question: "¿Cuál es una actividad física aeróbica?",
          options: [
            "Levantamiento de pesas",
            "Correr",
            "Pilates"
          ],
          correctAnswer: 1,
          explanation: "Correr es una actividad aeróbica que utiliza oxígeno de manera continua para generar energía y mejora la capacidad cardiovascular."
        },
        {
          id: 6,
          question: "¿Qué indicador refleja mejor la capacidad cardiovascular?",
          options: [
            "Frecuencia cardíaca en reposo",
            "Presión arterial",
            "Fuerza muscular"
          ],
          correctAnswer: 0,
          explanation: "Una frecuencia cardíaca en reposo baja indica un corazón eficiente y una buena capacidad cardiovascular."
        },
        {
          id: 7,
          question: "¿Qué beneficios aporta la actividad física regular en el sistema nervioso?",
          options: [
            "Mejora la memoria y concentración",
            "Disminuye la visión",
            "Aumenta la fatiga mental"
          ],
          correctAnswer: 0,
          explanation: "La actividad física estimula la neuroplasticidad, mejora la memoria, concentración y reduce el estrés mental."
        },
        {
          id: 8,
          question: "¿Qué factor no influye directamente en el gasto energético?",
          options: [
            "Edad",
            "Tiempo de sueño",
            "Peso corporal"
          ],
          correctAnswer: 1,
          explanation: "Aunque el sueño afecta la recuperación, no influye directamente en el gasto energético durante la actividad física."
        },
        {
          id: 9,
          question: "¿Qué es un MET (Metabolic Equivalent Task)?",
          options: [
            "Una medida de intensidad de actividad física",
            "El ritmo cardíaco",
            "La duración del ejercicio"
          ],
          correctAnswer: 0,
          explanation: "Un MET es una unidad que mide la intensidad de las actividades físicas, donde 1 MET equivale al gasto energético en reposo."
        },
        {
          id: 10,
          question: "¿Cuál es la fórmula básica para el cálculo de gasto energético?",
          options: [
            "MET x peso x duración",
            "MET x 3.5 x peso / 200 x duración x frecuencia",
            "Peso / MET x frecuencia"
          ],
          correctAnswer: 1,
          explanation: "La fórmula completa considera el MET, el peso corporal, la duración y frecuencia para calcular el gasto energético total."
        },
        {
          id: 11,
          question: "¿Cuántos tipos de actividad física existen según la intensidad?",
          options: [
            "Dos: leve y vigorosa",
            "Tres: leve, moderada y vigorosa",
            "Cuatro: leve, ligera, intensa y extrema"
          ],
          correctAnswer: 1,
          explanation: "Se clasifican en tres tipos: leve (1-3 METs), moderada (3-6 METs) y vigorosa (>6 METs)."
        },
        {
          id: 12,
          question: "¿Qué significa TDEE?",
          options: [
            "Tiempo diario efectivo de ejercicio",
            "Gasto energético total diario",
            "Tasa de descanso energético"
          ],
          correctAnswer: 1,
          explanation: "TDEE (Total Daily Energy Expenditure) es el gasto energético total diario, incluyendo metabolismo basal y actividad física."
        },
        {
          id: 13,
          question: "¿Qué actividad corresponde a un MET aproximado de 1?",
          options: [
            "Ver televisión",
            "Jogging",
            "Nadar"
          ],
          correctAnswer: 0,
          explanation: "Ver televisión tiene un valor de 1 MET, equivalente al gasto energético en reposo completo."
        },
        {
          id: 14,
          question: "El ejercicio de resistencia tiene como objetivo mejorar:",
          options: [
            "La flexibilidad",
            "La fuerza muscular",
            "La agilidad"
          ],
          correctAnswer: 1,
          explanation: "El entrenamiento de resistencia está diseñado específicamente para desarrollar y mejorar la fuerza muscular."
        },
        {
          id: 15,
          question: "El sedentarismo se define como:",
          options: [
            "Estar en reposo sin moverse mucho",
            "Actividad física ligera",
            "Estar siempre corriendo"
          ],
          correctAnswer: 0,
          explanation: "El sedentarismo es un estilo de vida caracterizado por la falta de actividad física regular y períodos prolongados de inactividad."
        },
        {
          id: 16,
          question: "¿Qué beneficio no es directo de la actividad física?",
          options: [
            "Reducción del estrés",
            "Incrementar el colesterol LDL",
            "Control del peso corporal"
          ],
          correctAnswer: 1,
          explanation: "La actividad física reduce el colesterol LDL (malo) y aumenta el HDL (bueno), no lo incrementa."
        },
        {
          id: 17,
          question: "La flexibilidad se mide principalmente mediante:",
          options: [
            "Test de estiramiento",
            "Test de fuerza",
            "Test cardiovascular"
          ],
          correctAnswer: 0,
          explanation: "Los test de estiramiento y rango de movimiento articular son los métodos estándar para evaluar la flexibilidad."
        },
        {
          id: 18,
          question: "¿Cuál es el componente más importante para la prevención de enfermedades cardiovasculares?",
          options: [
            "Dieta equilibrada",
            "Actividad física regular",
            "Descanso prolongado"
          ],
          correctAnswer: 1,
          explanation: "La actividad física regular es el factor más importante para prevenir enfermedades cardiovasculares, aunque la dieta también es crucial."
        },
        {
          id: 19,
          question: "¿Qué grupo de alimentos es vital para la recuperación muscular?",
          options: [
            "Carbohidratos simples",
            "Proteínas",
            "Grasas saturadas"
          ],
          correctAnswer: 1,
          explanation: "Las proteínas proporcionan los aminoácidos esenciales necesarios para la reparación y construcción del tejido muscular."
        },
        {
          id: 20,
          question: "¿Qué ocurre con la masa muscular si no se practica actividad física?",
          options: [
            "Aumenta",
            "Disminuye",
            "Se mantiene igual"
          ],
          correctAnswer: 1,
          explanation: "Sin actividad física, la masa muscular disminuye progresivamente debido al principio de 'úsalo o piérdelo'."
        }
      ]
    },
    {
      id: 3,
      name: "MADERA",
      title: "Nivel Intermedio-Avanzado",
      icon: "🌳",
      color: "from-green-600 to-emerald-600",
      pointsPerQuestion: 20,
      coinsPerQuestion: 3,
      questions: [
        {
          id: 1,
          question: "¿Cuál es la diferencia entre actividad física y ejercicio físico?",
          options: [
            "No hay diferencia",
            "Ejercicio es planificado y estructurado, actividad física puede ser cualquier movimiento",
            "Actividad física es más intensa que ejercicio"
          ],
          correctAnswer: 1,
          explanation: "El ejercicio es una subcategoría de actividad física que es planificada, estructurada y repetitiva con el objetivo de mejorar la condición física."
        },
        {
          id: 2,
          question: "¿Cuál es el principal combustible durante ejercicio aeróbico prolongado?",
          options: [
            "Proteínas",
            "Grasas",
            "Hidrógeno"
          ],
          correctAnswer: 1,
          explanation: "Durante ejercicio aeróbico prolongado, las grasas se convierten en el principal combustible debido a su alta densidad energética."
        },
        {
          id: 3,
          question: "¿Qué mide el VO2max?",
          options: [
            "Fuerza máxima muscular",
            "Máxima capacidad de consumo de oxígeno",
            "Velocidad máxima en carrera"
          ],
          correctAnswer: 1,
          explanation: "El VO2max es la máxima cantidad de oxígeno que el cuerpo puede utilizar durante el ejercicio intenso, indicador clave de la capacidad aeróbica."
        },
        {
          id: 4,
          question: "¿Qué es una prueba de esfuerzo?",
          options: [
            "Medición de fuerzas de agarre",
            "Evaluación del rendimiento cardiovascular bajo estrés progresivo",
            "Medición del índice de masa corporal"
          ],
          correctAnswer: 1,
          explanation: "Una prueba de esfuerzo evalúa cómo responde el sistema cardiovascular al ejercicio progresivamente intenso."
        },
        {
          id: 5,
          question: "¿Cuál es el efecto de la actividad física en la presión arterial?",
          options: [
            "La eleva crónicamente",
            "La reduce o mantiene saludable",
            "No tiene efecto"
          ],
          correctAnswer: 1,
          explanation: "La actividad física regular reduce la presión arterial en reposo y mejora la salud cardiovascular general."
        },
        {
          id: 6,
          question: "¿Qué indica un alto índice de masa corporal (IMC)?",
          options: [
            "Bajo peso",
            "Obesidad o sobrepeso",
            "Buena condición física"
          ],
          correctAnswer: 1,
          explanation: "Un IMC alto (>25) indica sobrepeso u obesidad, aunque no distingue entre masa muscular y grasa."
        },
        {
          id: 7,
          question: "¿Qué factor afecta la capacidad pulmonar en deportistas?",
          options: [
            "Edad, entrenamiento y genética",
            "Solo la dieta",
            "Solo el descanso"
          ],
          correctAnswer: 0,
          explanation: "La capacidad pulmonar está influenciada por múltiples factores: edad, entrenamiento, genética, altura y estado de salud."
        },
        {
          id: 8,
          question: "¿Qué es la hipertrofia muscular?",
          options: [
            "Disminución de tejidos musculares",
            "Aumento del tamaño de las fibras musculares",
            "Dolor muscular post ejercicio"
          ],
          correctAnswer: 1,
          explanation: "La hipertrofia muscular es el aumento del tamaño de las fibras musculares como respuesta al entrenamiento de resistencia."
        },
        {
          id: 9,
          question: "¿Qué es la activación muscular?",
          options: [
            "Estiramiento previo",
            "Contracción de fibras para producir fuerza",
            "Descanso después del ejercicio"
          ],
          correctAnswer: 1,
          explanation: "La activación muscular es el proceso por el cual el sistema nervioso estimula las fibras musculares para contraerse y generar fuerza."
        },
        {
          id: 10,
          question: "¿Qué es la fatiga muscular?",
          options: [
            "Estado de rendimiento máximo",
            "Disminución temporal del rendimiento muscular",
            "Aumento de masa muscular"
          ],
          correctAnswer: 1,
          explanation: "La fatiga muscular es la disminución temporal de la capacidad de generar fuerza debido al ejercicio intenso o prolongado."
        },
        {
          id: 11,
          question: "¿Cuándo se recomienda hacer calentamiento?",
          options: [
            "Después de correr",
            "Antes de iniciar una actividad intensa",
            "Nunca es necesario"
          ],
          correctAnswer: 1,
          explanation: "El calentamiento antes del ejercicio intenso prepara el cuerpo, aumenta la temperatura corporal y reduce el riesgo de lesiones."
        },
        {
          id: 12,
          question: "¿Cuál es la función del sistema nervioso en el movimiento?",
          options: [
            "Controlar la digestión",
            "Coordinar la contracción muscular y equilibrio",
            "Filtrar toxinas"
          ],
          correctAnswer: 1,
          explanation: "El sistema nervioso coordina la contracción muscular, mantiene el equilibrio y controla los patrones de movimiento."
        },
        {
          id: 13,
          question: "¿Qué músculos se trabajan mejor con entrenamiento de fuerza?",
          options: [
            "Músculos voluntarios esqueléticos",
            "Músculos lisos",
            "Músculo cardíaco"
          ],
          correctAnswer: 0,
          explanation: "El entrenamiento de fuerza se enfoca en los músculos esqueléticos voluntarios que podemos controlar conscientemente."
        },
        {
          id: 14,
          question: "La flexibilidad está asociada a:",
          options: [
            "Rigidez articular",
            "Rango de movimiento de las articulaciones",
            "Frecuencia cardíaca"
          ],
          correctAnswer: 1,
          explanation: "La flexibilidad se refiere al rango de movimiento disponible en una articulación o grupo de articulaciones."
        },
        {
          id: 15,
          question: "¿Qué efectos tiene el ejercicio sobre la insulina?",
          options: [
            "Mejora la sensibilidad a la insulina",
            "La empeora",
            "No tiene efectos"
          ],
          correctAnswer: 0,
          explanation: "El ejercicio mejora la sensibilidad a la insulina, ayudando a regular mejor los niveles de glucosa en sangre."
        },
        {
          id: 16,
          question: "¿Qué es la recuperación activa?",
          options: [
            "Descanso total",
            "Actividades de baja intensidad tras ejercicio intenso para acelerar recuperación",
            "Ejercicio intenso consecutivo"
          ],
          correctAnswer: 1,
          explanation: "La recuperación activa implica realizar actividades de baja intensidad para acelerar la eliminación de metabolitos y la recuperación."
        },
        {
          id: 17,
          question: "¿Qué minerales son esenciales para función muscular?",
          options: [
            "Calcio y potasio",
            "Hierro y zinc únicamente",
            "Sin minerales necesarios"
          ],
          correctAnswer: 0,
          explanation: "El calcio es esencial para la contracción muscular y el potasio para la función nerviosa y el equilibrio de fluidos."
        },
        {
          id: 18,
          question: "¿Cuál es la mejor hora para hacer actividad física para mejorar el sueño?",
          options: [
            "Justo antes de dormir",
            "Al menos 2 horas antes de dormir",
            "Después de cenar"
          ],
          correctAnswer: 1,
          explanation: "Ejercitarse al menos 2 horas antes de dormir permite que la temperatura corporal y la activación nerviosa se normalicen."
        },
        {
          id: 19,
          question: "¿Qué es el entrenamiento cruzado?",
          options: [
            "Entrenar solo un grupo muscular",
            "Combinar varios tipos de ejercicio para evitar lesiones y mejorar condición",
            "Entrenar sin descanso"
          ],
          correctAnswer: 1,
          explanation: "El entrenamiento cruzado combina diferentes modalidades de ejercicio para desarrollar múltiples capacidades y prevenir lesiones por sobreuso."
        },
        {
          id: 20,
          question: "¿Cuál es la importancia de la hidratación durante el ejercicio?",
          options: [
            "No es relevante",
            "Mantener el equilibrio electrolítico y prevenir fatiga",
            "Solo después del ejercicio"
          ],
          correctAnswer: 1,
          explanation: "La hidratación adecuada mantiene el equilibrio electrolítico, regula la temperatura corporal y previene la fatiga prematura."
        }
      ]
    },
    {
      id: 4,
      name: "PIEDRA",
      title: "Nivel Avanzado",
      icon: "🗿",
      color: "from-blue-600 to-indigo-600",
      pointsPerQuestion: 25,
      coinsPerQuestion: 4,
      questions: [
        {
          id: 1,
          question: "¿Qué células son responsables de la reparación muscular?",
          options: [
            "Osteocitos",
            "Células satélite musculares",
            "Fibroblastos"
          ],
          correctAnswer: 1,
          explanation: "Las células satélite son células madre musculares que se activan para reparar y regenerar las fibras musculares dañadas."
        },
        {
          id: 2,
          question: "¿Cuál es la adaptación cardiovascular al entrenamiento continuo moderado?",
          options: [
            "Disminución del volumen cardíaco",
            "Aumento del volumen sistólico y capacidad de bombeo",
            "Aumento del ritmo cardíaco en reposo"
          ],
          correctAnswer: 1,
          explanation: "El entrenamiento aeróbico aumenta el volumen sistólico (sangre bombeada por latido) y mejora la eficiencia cardíaca."
        },
        {
          id: 3,
          question: "¿Qué es el efecto del entrenamiento en la capilarización muscular?",
          options: [
            "Disminuye el suministro sanguíneo",
            "Aumenta la densidad capilar para mejor oxigenación",
            "No afecta la vascularización"
          ],
          correctAnswer: 1,
          explanation: "El entrenamiento aumenta la densidad capilar en los músculos, mejorando el suministro de oxígeno y nutrientes."
        },
        {
          id: 4,
          question: "¿Qué es la sobrecarga progresiva en entrenamiento?",
          options: [
            "Aumentar gradualmente la carga o intensidad para mejorar condición",
            "Mantener carga constante",
            "Entrenar sin planificar"
          ],
          correctAnswer: 0,
          explanation: "La sobrecarga progresiva es el principio fundamental del entrenamiento que requiere aumentar gradualmente la demanda para generar adaptaciones."
        },
        {
          id: 5,
          question: "¿Qué es el metabolismo anaeróbico?",
          options: [
            "Producción de energía con oxígeno",
            "Producción de energía sin oxígeno a corta duración",
            "Volumen de oxígeno máximo"
          ],
          correctAnswer: 1,
          explanation: "El metabolismo anaeróbico produce energía sin oxígeno, principalmente durante ejercicios de alta intensidad y corta duración."
        },
        {
          id: 6,
          question: "¿Cuál es la importancia de las proteínas en la reparación muscular?",
          options: [
            "Suministran aminoácidos para regenerar fibras dañadas",
            "Son irrelevantes",
            "Solo aportan energía"
          ],
          correctAnswer: 0,
          explanation: "Las proteínas proporcionan aminoácidos esenciales que son los bloques de construcción para reparar y construir tejido muscular."
        },
        {
          id: 7,
          question: "¿Qué es la fuerza explosiva?",
          options: [
            "Fuerza producida lentamente",
            "Capacidad de generar fuerza rápida en poco tiempo",
            "Fuerza de resistencia prolongada"
          ],
          correctAnswer: 1,
          explanation: "La fuerza explosiva es la capacidad de generar la máxima fuerza en el menor tiempo posible, crucial para deportes de potencia."
        },
        {
          id: 8,
          question: "¿Cuál es la diferencia entre fuerza máxima y resistencia muscular?",
          options: [
            "Fuerza máxima es poco importante",
            "Fuerza máxima es el mayor esfuerzo puntual; resistencia es capacidad de mantener fuerza prolongada",
            "Son lo mismo"
          ],
          correctAnswer: 1,
          explanation: "La fuerza máxima es la mayor fuerza que se puede generar en una contracción, mientras que la resistencia muscular es la capacidad de mantener contracciones repetidas."
        },
        {
          id: 9,
          question: "¿Qué es la frecuencia cardíaca máxima (FCM)?",
          options: [
            "Frecuencia máxima permitida en reposo",
            "Máxima frecuencia cardíaca alcanzada en esfuerzo máximo",
            "Frecuencia durante el sueño"
          ],
          correctAnswer: 1,
          explanation: "La FCM es el mayor número de latidos por minuto que el corazón puede alcanzar durante el ejercicio máximo."
        },
        {
          id: 10,
          question: "¿Qué mineral es importante para el transporte de oxígeno en sangre?",
          options: [
            "Magnesio",
            "Hierro",
            "Zinc"
          ],
          correctAnswer: 1,
          explanation: "El hierro es esencial para la hemoglobina, la proteína que transporta oxígeno en los glóbulos rojos."
        },
        {
          id: 11,
          question: "¿Qué significa LOC (lactato)?",
          options: [
            "Ácido láctico acumulado debido a esfuerzo anaeróbico intenso",
            "Oxígeno en sangre",
            "Lactosa total"
          ],
          correctAnswer: 0,
          explanation: "El lactato es un subproducto del metabolismo anaeróbico que se acumula durante ejercicio intenso y puede causar fatiga muscular."
        },
        {
          id: 12,
          question: "¿Cómo afecta la altitud al rendimiento físico?",
          options: [
            "Mejora la oxigenación",
            "Disminuye el oxígeno disponible y afecta resistencia",
            "No tiene efecto"
          ],
          correctAnswer: 1,
          explanation: "A mayor altitud hay menos oxígeno disponible, lo que reduce la capacidad aeróbica y el rendimiento de resistencia."
        },
        {
          id: 13,
          question: "¿Qué hormona está relacionada con la recuperación y anabolismo?",
          options: [
            "Cortisol",
            "Testosterona",
            "Adrenalina"
          ],
          correctAnswer: 1,
          explanation: "La testosterona es una hormona anabólica clave para la síntesis de proteínas, recuperación muscular y adaptaciones al entrenamiento."
        },
        {
          id: 14,
          question: "¿Qué es la plasticidad neural?",
          options: [
            "Rígida estructura nerviosa",
            "Capacidad de adaptarse y modificar conexiones neuronales",
            "Pérdida de funciones"
          ],
          correctAnswer: 1,
          explanation: "La plasticidad neural es la capacidad del sistema nervioso de modificar sus conexiones y funciones en respuesta al entrenamiento."
        },
        {
          id: 15,
          question: "¿Qué es el entrenamiento pliométrico?",
          options: [
            "Ejercicios de fuerza estática",
            "Ejercicios que usan movimientos explosivos y rebotes",
            "Entrenamiento de resistencia aeróbica"
          ],
          correctAnswer: 1,
          explanation: "El entrenamiento pliométrico utiliza el ciclo estiramiento-acortamiento muscular para desarrollar potencia y fuerza explosiva."
        },
        {
          id: 16,
          question: "El umbral anaeróbico es:",
          options: [
            "El punto donde aumento de intensidad no produce más lactato",
            "Punto donde el cuerpo cambia a metabolismo anaeróbico y se acumula lactato",
            "Limite de esfuerzo sin fatiga"
          ],
          correctAnswer: 1,
          explanation: "El umbral anaeróbico es la intensidad donde la producción de lactato excede su eliminación, marcando el cambio metabólico."
        },
        {
          id: 17,
          question: "¿Qué es la fatiga central?",
          options: [
            "Fatiga de músculos",
            "Fatiga que involucra al sistema nervioso central y disminuye la señal a músculos",
            "Fatiga sin explicación"
          ],
          correctAnswer: 1,
          explanation: "La fatiga central ocurre cuando el sistema nervioso central reduce las señales a los músculos, limitando la activación muscular."
        },
        {
          id: 18,
          question: "¿Qué fibras musculares son rápidas y fatigables?",
          options: [
            "Tipo I",
            "Tipo IIb",
            "Tipo IIa"
          ],
          correctAnswer: 1,
          explanation: "Las fibras tipo IIb (o IIx) son fibras de contracción rápida, potentes pero se fatigan rápidamente, ideales para movimientos explosivos."
        },
        {
          id: 19,
          question: "¿Qué tipo de entrenamiento mejora la resistencia aeróbica?",
          options: [
            "Entrenamiento de fuerza",
            "Entrenamiento continuo de baja/moderada intensidad por tiempo prolongado",
            "Entrenamiento de velocidad"
          ],
          correctAnswer: 1,
          explanation: "El entrenamiento aeróbico continuo de intensidad moderada mejora la capacidad del sistema cardiovascular y la resistencia."
        },
        {
          id: 20,
          question: "¿Qué es la hipertrofia sarcoplasmática?",
          options: [
            "Aumento del fluido y volumen en músculo, pero menos fuerza",
            "Crecimiento de fibras musculares y fuerza",
            "Reducción de masa muscular"
          ],
          correctAnswer: 0,
          explanation: "La hipertrofia sarcoplasmática aumenta el volumen muscular principalmente por acumulación de fluidos y glucógeno, con menor ganancia de fuerza."
        }
      ]
    },
    {
      id: 5,
      name: "BRONCE",
      title: "Nivel Experto",
      icon: "🥉",
      color: "from-amber-600 to-orange-600",
      pointsPerQuestion: 30,
      coinsPerQuestion: 5,
      questions: [
        {
          id: 1,
          question: "¿Cuál es el mecanismo principal de la supercompensación en el entrenamiento deportivo?",
          options: [
            "Adaptación inmediata al estímulo",
            "Recuperación que supera el nivel inicial tras estímulo de entrenamiento",
            "Mantenimiento del estado basal"
          ],
          correctAnswer: 1,
          explanation: "La supercompensación es el proceso donde el organismo se recupera por encima del nivel inicial tras un estímulo de entrenamiento, permitiendo mejoras progresivas."
        },
        {
          id: 2,
          question: "¿Qué papel juega la creatina quinasa en el metabolismo energético muscular?",
          options: [
            "Síntesis de proteínas",
            "Regeneración de ATP a partir de fosfocreatina",
            "Oxidación de grasas"
          ],
          correctAnswer: 1,
          explanation: "La creatina quinasa cataliza la regeneración rápida de ATP a partir de fosfocreatina, crucial para ejercicios de alta intensidad y corta duración."
        },
        {
          id: 3,
          question: "¿Cuál es la diferencia entre potencia aeróbica y capacidad aeróbica?",
          options: [
            "Son términos sinónimos",
            "Potencia es VO2max, capacidad es tiempo de mantenimiento de alta intensidad aeróbica",
            "Potencia es fuerza, capacidad es resistencia"
          ],
          correctAnswer: 1,
          explanation: "La potencia aeróbica (VO2max) es la máxima captación de oxígeno, mientras que la capacidad aeróbica es la habilidad de mantener un alto porcentaje del VO2max."
        },
        {
          id: 4,
          question: "¿Qué es el EPOC (Excess Post-Exercise Oxygen Consumption)?",
          options: [
            "Consumo de oxígeno durante el ejercicio",
            "Consumo elevado de oxígeno post-ejercicio para restaurar homeostasis",
            "Déficit de oxígeno pre-ejercicio"
          ],
          correctAnswer: 1,
          explanation: "EPOC es el consumo elevado de oxígeno después del ejercicio para restaurar los sistemas fisiológicos al estado de reposo."
        },
        {
          id: 5,
          question: "¿Cuál es el efecto del entrenamiento de intervalos de alta intensidad (HIIT) en las mitocondrias?",
          options: [
            "Reduce su número",
            "Aumenta la biogénesis mitocondrial y mejora la función oxidativa",
            "No tiene efecto"
          ],
          correctAnswer: 1,
          explanation: "El HIIT estimula la biogénesis mitocondrial, aumentando el número y la eficiencia de las mitocondrias para mejorar la capacidad oxidativa."
        },
        {
          id: 6,
          question: "¿Qué es la ventana anabólica post-ejercicio?",
          options: [
            "Período de catabolismo muscular",
            "Período óptimo para síntesis proteica y recuperación muscular (0-2 horas post-ejercicio)",
            "Tiempo de calentamiento pre-ejercicio"
          ],
          correctAnswer: 1,
          explanation: "La ventana anabólica es el período post-ejercicio donde la síntesis proteica está elevada y la ingesta de nutrientes es más efectiva para la recuperación."
        },
        {
          id: 7,
          question: "¿Cuál es la función de la proteína mTOR en el músculo esquelético?",
          options: [
            "Degradación proteica",
            "Regulación de la síntesis proteica y crecimiento muscular",
            "Transporte de oxígeno"
          ],
          correctAnswer: 1,
          explanation: "mTOR (mechanistic Target of Rapamycin) es una proteína clave que regula la síntesis proteica y el crecimiento muscular en respuesta al ejercicio y nutrientes."
        },
        {
          id: 8,
          question: "¿Qué es la periodización del entrenamiento?",
          options: [
            "Entrenar todos los días igual",
            "Planificación sistemática de variables de entrenamiento en ciclos para optimizar adaptaciones",
            "Descanso prolongado"
          ],
          correctAnswer: 1,
          explanation: "La periodización es la planificación sistemática que varía volumen, intensidad y especificidad del entrenamiento en ciclos para maximizar adaptaciones y rendimiento."
        },
        {
          id: 9,
          question: "¿Cuál es el papel del lactato como sustrato energético?",
          options: [
            "Solo es un producto de desecho",
            "Puede ser utilizado como combustible por corazón, cerebro y músculos",
            "Inhibe la contracción muscular"
          ],
          correctAnswer: 1,
          explanation: "El lactato no es solo un producto de desecho, sino que puede ser utilizado como sustrato energético por diversos tejidos, especialmente el corazón y el cerebro."
        },
        {
          id: 10,
          question: "¿Qué es la economía de carrera en deportes de resistencia?",
          options: [
            "Velocidad máxima alcanzada",
            "Eficiencia energética: menor consumo de oxígeno a una velocidad dada",
            "Tiempo total de carrera"
          ],
          correctAnswer: 1,
          explanation: "La economía de carrera es la eficiencia con la que un atleta utiliza oxígeno a una velocidad submáxima, factor clave en el rendimiento de resistencia."
        },
        {
          id: 11,
          question: "¿Cuál es el efecto del entrenamiento en altitud sobre la eritropoyesis?",
          options: [
            "Disminuye la producción de glóbulos rojos",
            "Estimula la producción de eritropoyetina y aumenta glóbulos rojos",
            "No afecta la sangre"
          ],
          correctAnswer: 1,
          explanation: "La altitud estimula la producción de eritropoyetina (EPO), que aumenta la producción de glóbulos rojos para mejorar el transporte de oxígeno."
        },
        {
          id: 12,
          question: "¿Qué es la fatiga neuromuscular?",
          options: [
            "Solo fatiga muscular periférica",
            "Reducción de la capacidad de generar fuerza por factores centrales y periféricos",
            "Aumento de la fuerza muscular"
          ],
          correctAnswer: 1,
          explanation: "La fatiga neuromuscular involucra tanto factores centrales (sistema nervioso) como periféricos (músculo) que reducen la capacidad de generar fuerza."
        },
        {
          id: 13,
          question: "¿Cuál es la importancia de la variabilidad de la frecuencia cardíaca (HRV) en el entrenamiento?",
          options: [
            "No tiene relevancia",
            "Indicador del estado de recuperación y adaptación del sistema nervioso autónomo",
            "Solo mide la frecuencia cardíaca máxima"
          ],
          correctAnswer: 1,
          explanation: "La HRV refleja el equilibrio del sistema nervioso autónomo y es un indicador valioso del estado de recuperación y adaptación al entrenamiento."
        },
        {
          id: 14,
          question: "¿Qué es el entrenamiento polarizado?",
          options: [
            "Entrenar solo a alta intensidad",
            "Distribución de intensidades: mucho volumen bajo, poco moderado, algo de alta intensidad",
            "Entrenar en polos geográficos"
          ],
          correctAnswer: 1,
          explanation: "El entrenamiento polarizado distribuye el volumen principalmente en intensidades bajas (~80%) y altas (~20%), minimizando la zona moderada."
        },
        {
          id: 15,
          question: "¿Cuál es el papel de las especies reactivas de oxígeno (ROS) en el ejercicio?",
          options: [
            "Solo causan daño celular",
            "En cantidades moderadas actúan como señales para adaptaciones, en exceso causan estrés oxidativo",
            "No se producen durante el ejercicio"
          ],
          correctAnswer: 1,
          explanation: "Las ROS en cantidades moderadas actúan como señales para adaptaciones beneficiosas, pero en exceso pueden causar estrés oxidativo y daño celular."
        },
        {
          id: 16,
          question: "¿Qué es la potenciación post-activación (PAP)?",
          options: [
            "Fatiga después del ejercicio",
            "Mejora temporal del rendimiento muscular tras contracción intensa previa",
            "Calentamiento estático"
          ],
          correctAnswer: 1,
          explanation: "La PAP es el fenómeno donde una contracción muscular intensa mejora temporalmente el rendimiento de contracciones posteriores."
        },
        {
          id: 17,
          question: "¿Cuál es la diferencia entre hipertrofia miofibrilar y sarcoplasmática?",
          options: [
            "No hay diferencia",
            "Miofibrilar aumenta proteínas contractiles y fuerza; sarcoplasmática aumenta volumen sin fuerza proporcional",
            "Solo existe la miofibrilar"
          ],
          correctAnswer: 1,
          explanation: "La hipertrofia miofibrilar aumenta las proteínas contractiles y la fuerza, mientras que la sarcoplasmática aumenta el volumen celular sin ganancias proporcionales de fuerza."
        },
        {
          id: 18,
          question: "¿Qué es el umbral ventilatorio?",
          options: [
            "Frecuencia respiratoria máxima",
            "Punto donde la ventilación aumenta desproporcionalmente respecto al consumo de oxígeno",
            "Capacidad pulmonar total"
          ],
          correctAnswer: 1,
          explanation: "El umbral ventilatorio es el punto donde la ventilación aumenta más rápido que el consumo de oxígeno, indicando cambios metabólicos."
        },
        {
          id: 19,
          question: "¿Cuál es el papel de la hormona del crecimiento (GH) en la recuperación post-ejercicio?",
          options: [
            "Inhibe la recuperación",
            "Estimula la síntesis proteica, lipolisis y recuperación de tejidos",
            "Solo afecta el crecimiento en niños"
          ],
          correctAnswer: 1,
          explanation: "La GH estimula la síntesis proteica, promueve la lipolisis y facilita la reparación y recuperación de tejidos después del ejercicio."
        },
        {
          id: 20,
          question: "¿Qué es la especificidad neural en el entrenamiento de fuerza?",
          options: [
            "Entrenar solo un músculo",
            "Adaptaciones específicas del sistema nervioso al patrón de movimiento entrenado",
            "Usar solo pesas libres"
          ],
          correctAnswer: 1,
          explanation: "La especificidad neural se refiere a las adaptaciones del sistema nervioso que son específicas al patrón de movimiento, velocidad y tipo de contracción entrenados."
        }
      ]
    },
    {
      id: 6,
      name: "PLATA",
      title: "Nivel Científico",
      icon: "🥈",
      color: "from-gray-400 to-gray-600",
      pointsPerQuestion: 35,
      coinsPerQuestion: 6,
      questions: [
        {
          id: 1,
          question: "En un estudio controlado aleatorizado sobre HIIT vs entrenamiento continuo, ¿cuál sería la variable dependiente más apropiada para medir adaptaciones cardiovasculares?",
          options: [
            "Frecuencia cardíaca en reposo únicamente",
            "VO2max, economía de ejercicio y función endotelial",
            "Solo el peso corporal"
          ],
          correctAnswer: 1,
          explanation: "Un estudio robusto debe incluir múltiples variables dependientes que capturen diferentes aspectos de la adaptación cardiovascular para una evaluación completa."
        },
        {
          id: 2,
          question: "¿Cuál es la principal limitación metodológica en estudios de nutrición deportiva con diseño cruzado?",
          options: [
            "Costo elevado",
            "Efectos de arrastre (carry-over) y período de lavado insuficiente",
            "Falta de participantes"
          ],
          correctAnswer: 1,
          explanation: "Los efectos de arrastre ocurren cuando el tratamiento previo influye en el siguiente, requiriendo períodos de lavado adecuados para eliminar estos efectos."
        },
        {
          id: 3,
          question: "¿Qué indica un valor de Cohen's d = 0.8 en un estudio de intervención con ejercicio?",
          options: [
            "Efecto pequeño",
            "Efecto grande con significancia práctica",
            "No hay efecto"
          ],
          correctAnswer: 1,
          explanation: "Cohen's d = 0.8 indica un tamaño del efecto grande, sugiriendo que la intervención tiene un impacto prácticamente significativo además de estadísticamente significativo."
        },
        {
          id: 4,
          question: "En la interpretación de un meta-análisis sobre ejercicio y depresión, ¿qué indica un I² = 75%?",
          options: [
            "Baja heterogeneidad entre estudios",
            "Alta heterogeneidad que requiere análisis de subgrupos",
            "Homogeneidad perfecta"
          ],
          correctAnswer: 1,
          explanation: "I² = 75% indica alta heterogeneidad entre estudios, sugiriendo que los resultados varían considerablemente y requieren análisis adicionales para explicar las diferencias."
        },
        {
          id: 5,
          question: "¿Cuál es la ventaja principal del diseño factorial 2x2 en investigación del ejercicio?",
          options: [
            "Menor costo",
            "Permite evaluar efectos principales e interacciones de dos factores simultáneamente",
            "Requiere menos participantes"
          ],
          correctAnswer: 1,
          explanation: "El diseño factorial permite examinar los efectos de dos factores independientes y su interacción en una sola investigación, maximizando la información obtenida."
        },
        {
          id: 6,
          question: "¿Qué representa el concepto de 'minimal clinically important difference' (MCID) en estudios de rehabilitación?",
          options: [
            "Diferencia estadísticamente significativa",
            "Menor cambio que es percibido como beneficioso por pacientes",
            "Error estándar de medición"
          ],
          correctAnswer: 1,
          explanation: "MCID es el menor cambio en una medida que los pacientes perciben como significativo y beneficioso, más allá de la significancia estadística."
        },
        {
          id: 7,
          question: "En un estudio longitudinal de 10 años sobre actividad física y mortalidad, ¿cuál es la principal amenaza a la validez interna?",
          options: [
            "Sesgo de selección inicial",
            "Pérdida de seguimiento diferencial (attrition bias)",
            "Costo del estudio"
          ],
          correctAnswer: 1,
          explanation: "La pérdida diferencial de participantes puede introducir sesgo si las características de quienes abandonan difieren sistemáticamente entre grupos."
        },
        {
          id: 8,
          question: "¿Qué método estadístico es más apropiado para analizar datos de actividad física medidos con acelerómetros durante 7 días?",
          options: [
            "ANOVA de una vía",
            "Modelos mixtos lineales para medidas repetidas",
            "Prueba t de Student"
          ],
          correctAnswer: 1,
          explanation: "Los modelos mixtos manejan adecuadamente la correlación entre medidas repetidas del mismo individuo y pueden manejar datos faltantes."
        },
        {
          id: 9,
          question: "¿Cuál es la interpretación correcta de un intervalo de confianza del 95% para la diferencia de medias = [-2.1, 8.3]?",
          options: [
            "Hay diferencia significativa entre grupos",
            "No hay evidencia de diferencia significativa (incluye 0)",
            "El efecto es clínicamente relevante"
          ],
          correctAnswer: 1,
          explanation: "Como el intervalo incluye 0, no hay evidencia estadística de diferencia significativa entre los grupos comparados."
        },
        {
          id: 10,
          question: "¿Qué representa el número necesario a tratar (NNT) en estudios de prevención con ejercicio?",
          options: [
            "Tamaño de muestra requerido",
            "Número de personas que necesitan hacer ejercicio para prevenir un evento adverso",
            "Duración del tratamiento"
          ],
          correctAnswer: 1,
          explanation: "NNT indica cuántas personas necesitan recibir la intervención (ejercicio) para prevenir un evento adverso adicional comparado con el control."
        },
        {
          id: 11,
          question: "En un ensayo clínico sobre ejercicio, ¿qué estrategia reduce el sesgo de detección?",
          options: [
            "Aleatorización",
            "Cegamiento de evaluadores de resultados",
            "Análisis por intención de tratar"
          ],
          correctAnswer: 1,
          explanation: "El cegamiento de evaluadores previene que el conocimiento del grupo de tratamiento influya en la medición de los resultados."
        },
        {
          id: 12,
          question: "¿Cuál es la principal ventaja del análisis por intención de tratar en estudios de ejercicio?",
          options: [
            "Reduce el tamaño de muestra necesario",
            "Preserva los beneficios de la aleatorización y refleja efectividad real",
            "Elimina la necesidad de seguimiento"
          ],
          correctAnswer: 1,
          explanation: "El análisis por intención de tratar mantiene los grupos como fueron aleatorizados originalmente, reflejando la efectividad real de la intervención."
        },
        {
          id: 13,
          question: "¿Qué indica un valor p = 0.03 en el contexto de múltiples comparaciones sin corrección?",
          options: [
            "Resultado definitivamente significativo",
            "Posible falso positivo que requiere corrección (ej. Bonferroni)",
            "No hay significancia estadística"
          ],
          correctAnswer: 1,
          explanation: "Con múltiples comparaciones, aumenta la probabilidad de error tipo I (falsos positivos), requiriendo correcciones estadísticas apropiadas."
        },
        {
          id: 14,
          question: "¿Cuál es la diferencia entre eficacia y efectividad en investigación de intervenciones con ejercicio?",
          options: [
            "Son términos sinónimos",
            "Eficacia es en condiciones ideales, efectividad es en condiciones reales",
            "Eficacia es más importante"
          ],
          correctAnswer: 1,
          explanation: "La eficacia se evalúa en condiciones controladas ideales, mientras que la efectividad se evalúa en condiciones del mundo real con mayor variabilidad."
        },
        {
          id: 15,
          question: "¿Qué representa la potencia estadística en el diseño de estudios de ejercicio?",
          options: [
            "Fuerza de la intervención",
            "Probabilidad de detectar un efecto real cuando existe",
            "Tamaño del efecto observado"
          ],
          correctAnswer: 1,
          explanation: "La potencia estadística es la probabilidad de rechazar correctamente una hipótesis nula falsa, es decir, detectar un efecto cuando realmente existe."
        },
        {
          id: 16,
          question: "En estudios observacionales sobre actividad física y salud, ¿cuál es la principal limitación para establecer causalidad?",
          options: [
            "Tamaño de muestra pequeño",
            "Confusión residual y causalidad reversa",
            "Falta de aleatorización únicamente"
          ],
          correctAnswer: 1,
          explanation: "Los estudios observacionales no pueden controlar completamente todas las variables confusoras, y la causalidad reversa (enfermedad afecta actividad) es posible."
        },
        {
          id: 17,
          question: "¿Qué método es más apropiado para evaluar la validez de constructo de un cuestionario de actividad física?",
          options: [
            "Solo correlación con otro cuestionario",
            "Análisis factorial confirmatorio y correlaciones con medidas objetivas",
            "Únicamente consistencia interna"
          ],
          correctAnswer: 1,
          explanation: "La validez de constructo requiere múltiples evidencias: estructura factorial, correlaciones con medidas relacionadas y diferenciación de constructos distintos."
        },
        {
          id: 18,
          question: "¿Cuál es la interpretación correcta de un hazard ratio = 0.7 (IC 95%: 0.5-0.9) en un estudio de supervivencia?",
          options: [
            "30% mayor riesgo en el grupo de ejercicio",
            "30% reducción del riesgo en el grupo de ejercicio",
            "No hay diferencia entre grupos"
          ],
          correctAnswer: 1,
          explanation: "Un HR = 0.7 indica 30% reducción del riesgo en el grupo de ejercicio comparado con el control, y el IC no incluye 1.0, indicando significancia."
        },
        {
          id: 19,
          question: "¿Qué representa el coeficiente de correlación intraclase (ICC) en estudios de confiabilidad?",
          options: [
            "Correlación entre variables diferentes",
            "Proporción de varianza total debida a diferencias entre sujetos",
            "Error de medición absoluto"
          ],
          correctAnswer: 1,
          explanation: "El ICC indica qué proporción de la varianza total se debe a diferencias reales entre sujetos versus error de medición, evaluando la confiabilidad."
        },
        {
          id: 20,
          question: "En un meta-análisis en red sobre diferentes tipos de ejercicio, ¿cuál es la principal ventaja sobre meta-análisis tradicionales?",
          options: [
            "Menor complejidad estadística",
            "Permite comparaciones indirectas entre intervenciones no comparadas directamente",
            "Requiere menos estudios"
          ],
          correctAnswer: 1,
          explanation: "Los meta-análisis en red permiten comparar intervenciones que nunca fueron comparadas directamente en estudios individuales, usando evidencia indirecta."
        }
      ]
    },
    {
      id: 7,
      name: "ORO",
      title: "Nivel Maestría",
      icon: "🥇",
      color: "from-yellow-400 to-yellow-600",
      pointsPerQuestion: 50,
      coinsPerQuestion: 10,
      questions: [
        {
          id: 1,
          question: "En el contexto de medicina de precisión aplicada al ejercicio, ¿cómo influyen los polimorfismos del gen ACTN3 en la respuesta al entrenamiento?",
          options: [
            "No tienen influencia en el rendimiento",
            "El genotipo RR se asocia con mejor respuesta a entrenamiento de potencia, XX con resistencia",
            "Solo afectan la recuperación post-ejercicio"
          ],
          correctAnswer: 1,
          explanation: "Los polimorfismos ACTN3 influyen en la composición de fibras musculares: RR favorece fibras rápidas y potencia, mientras XX se asocia con mejor eficiencia en resistencia."
        },
        {
          id: 2,
          question: "¿Cuál es la implicación de la paradoja del ejercicio en poblaciones con insuficiencia cardíaca crónica?",
          options: [
            "El ejercicio siempre es contraproducente",
            "Ejercicio supervisado mejora capacidad funcional a pesar de fracción de eyección reducida",
            "Solo ejercicio de alta intensidad es efectivo"
          ],
          correctAnswer: 1,
          explanation: "La paradoja muestra que el ejercicio supervisado mejora la capacidad funcional y calidad de vida en insuficiencia cardíaca, incluso con función sistólica comprometida."
        },
        {
          id: 3,
          question: "En el análisis de datos de actividad física con machine learning, ¿cuál es la principal ventaja de usar redes neuronales recurrentes (RNN) sobre métodos tradicionales?",
          options: [
            "Son más simples de interpretar",
            "Capturan patrones temporales complejos y dependencias a largo plazo en datos secuenciales",
            "Requieren menos datos de entrenamiento"
          ],
          correctAnswer: 1,
          explanation: "Las RNN pueden modelar dependencias temporales complejas en datos de actividad física, capturando patrones que métodos tradicionales no detectan."
        },
        {
          id: 4,
          question: "¿Cómo se interpreta la interacción gen-ambiente en estudios de obesidad y actividad física usando análisis de Mendelian randomization?",
          options: [
            "Los genes no interactúan con el ambiente",
            "Permite inferir causalidad controlando confusión usando variantes genéticas como variables instrumentales",
            "Solo evalúa correlaciones simples"
          ],
          correctAnswer: 1,
          explanation: "La aleatorización mendeliana usa variantes genéticas como variables instrumentales para inferir relaciones causales entre actividad física y obesidad, controlando confusión."
        },
        {
          id: 5,
          question: "En estudios de epigenética del ejercicio, ¿qué representa la metilación diferencial del promotor PGC-1α?",
          options: [
            "Daño genético irreversible",
            "Regulación epigenética de la biogénesis mitocondrial inducida por ejercicio",
            "Mutación genética heredable"
          ],
          correctAnswer: 1,
          explanation: "La metilación del promotor PGC-1α regula epigenéticamente la expresión de este coactivador clave en la biogénesis mitocondrial y adaptaciones al ejercicio."
        },
        {
          id: 6,
          question: "¿Cuál es la interpretación correcta de un análisis de mediación que muestra que la inflamación media 40% del efecto del ejercicio en la función cognitiva?",
          options: [
            "La inflamación no es importante",
            "40% del efecto beneficioso del ejercicio en cognición se explica por reducción de inflamación",
            "El ejercicio no afecta la cognición directamente"
          ],
          correctAnswer: 1,
          explanation: "El análisis de mediación indica que la reducción de inflamación explica 40% del mecanismo por el cual el ejercicio mejora la función cognitiva."
        },
        {
          id: 7,
          question: "En el contexto de sistemas complejos aplicados a la actividad física, ¿qué implica el concepto de 'atractores' en patrones de movimiento?",
          options: [
            "Movimientos que atraen la atención",
            "Estados estables de coordinación hacia los cuales el sistema tiende a evolucionar",
            "Ejercicios más populares"
          ],
          correctAnswer: 1,
          explanation: "Los atractores representan patrones de coordinación estables en sistemas dinámicos, hacia los cuales el sistema motor tiende a organizarse naturalmente."
        },
        {
          id: 8,
          question: "¿Cómo se interpreta un modelo de ecuaciones estructurales (SEM) que evalúa relaciones entre actividad física, autoeficacia y adherencia al ejercicio?",
          options: [
            "Solo evalúa correlaciones bivariadas",
            "Modela relaciones causales complejas y efectos directos/indirectos simultáneamente",
            "Es equivalente a regresión múltiple"
          ],
          correctAnswer: 1,
          explanation: "SEM permite modelar relaciones causales complejas, incluyendo efectos directos, indirectos y de mediación entre múltiples variables latentes y observadas."
        },
        {
          id: 9,
          question: "En estudios de cronobiología del ejercicio, ¿qué representa la amplitud del ritmo circadiano de cortisol en atletas de élite?",
          options: [
            "Nivel promedio de cortisol",
            "Diferencia entre pico y valle circadiano, indicador de sincronización y adaptación",
            "Variabilidad aleatoria"
          ],
          correctAnswer: 1,
          explanation: "La amplitud circadiana refleja la robustez del ritmo biológico y la capacidad de adaptación del eje hipotálamo-hipófisis-adrenal al entrenamiento."
        },
        {
          id: 10,
          question: "¿Cuál es la implicación de encontrar una interacción significativa tiempo × grupo × genotipo en un estudio de entrenamiento personalizado?",
          options: [
            "Los resultados no son interpretables",
            "La respuesta al entrenamiento varía según el tiempo, grupo de intervención y perfil genético",
            "Solo el tiempo es importante"
          ],
          correctAnswer: 1,
          explanation: "Esta interacción triple indica que la respuesta al entrenamiento depende de la combinación específica de tiempo de exposición, tipo de intervención y perfil genético individual."
        }
      ]
    }
  ];

  const currentLevelData = levels.find(l => l.id === currentLevel);
  const currentQuestion = currentLevelData?.questions[currentQuestionIndex];
  const maxLevel = Math.max(...completedLevels, 0) + 1;
  const totalPossiblePoints = levels.reduce((sum, level) => 
    sum + (level.questions.length * level.pointsPerQuestion), 0
  );
  const totalPossibleCoins = levels.reduce((sum, level) => 
    sum + (level.questions.length * level.coinsPerQuestion), 0
  );

  // Guardar en localStorage como backup
  useEffect(() => {
    localStorage.setItem('quiz_completed_levels', JSON.stringify(completedLevels));
    localStorage.setItem('quiz_total_points', totalPoints.toString());
    localStorage.setItem('quiz_total_coins', totalCoins.toString());
  }, [completedLevels, totalPoints, totalCoins]);

  // Iniciar contador de tiempo al mostrar pregunta
  useEffect(() => {
    if (!showResult) {
      setAnswerStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentLevel, showResult]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !currentQuestion || !currentLevelData || isLoading) return;

    setIsLoading(true);
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    try {
      const timeTaken = Math.floor((Date.now() - answerStartTime) / 1000);

      // Registrar respuesta en Supabase
      await ProgressService.recordCapsuleAnswer({
        student_id: studentId,
        level_id: currentLevel,
        question_id: currentQuestion.id,
        selected_answer: selectedAnswer,
        is_correct: correct,
        attempt_number: 1, // TODO: Trackear intentos múltiples
        points_earned: correct ? currentLevelData.pointsPerQuestion : 0,
        coins_earned: correct ? currentLevelData.coinsPerQuestion : 0,
        time_taken_seconds: timeTaken
      });

      if (correct) {
        // Actualizar puntos y monedas localmente
        setTotalPoints(prev => prev + currentLevelData.pointsPerQuestion);
        setTotalCoins(prev => prev + currentLevelData.coinsPerQuestion);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!isCorrect || !currentLevelData) return;

    if (currentQuestionIndex < currentLevelData.questions.length - 1) {
      // Siguiente pregunta en el mismo nivel
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Completar nivel y avanzar al siguiente
      if (!completedLevels.includes(currentLevel)) {
        const newCompletedLevels = [...completedLevels, currentLevel];
        setCompletedLevels(newCompletedLevels);

        // Desbloquear logros por completar niveles
        try {
          await checkLevelAchievements(currentLevel, newCompletedLevels);
        } catch (error) {
          console.error('Error checking achievements:', error);
        }
      }

      if (currentLevel < levels.length) {
        if (currentLevel === levels.length) {
          setShowCelebration(true);
        } else {
          setCurrentLevel(currentLevel + 1);
          setCurrentQuestionIndex(0);
          setSelectedAnswer(null);
          setShowResult(false);
        }
      } else {
        setShowCelebration(true);
      }
    }
  };

  const checkLevelAchievements = async (levelCompleted: number, allCompleted: number[]) => {
    try {
      const levelNames = ['POLVO', 'ARCILLA', 'MADERA', 'PIEDRA', 'BRONCE', 'PLATA', 'ORO'];
      const levelName = levelNames[levelCompleted - 1] || 'Nivel';

      await ProgressService.unlockAchievement({
        student_id: studentId,
        achievement_type: `capsule_level_${levelCompleted}`,
        achievement_name: `Maestro ${levelName}`,
        description: `Completaste todas las preguntas del nivel ${levelName}`,
        icon: levels[levelCompleted - 1]?.icon || '🏆',
        points_awarded: 100 * levelCompleted
      });

      // Logro especial por completar todos los niveles
      if (allCompleted.length === 7) {
        await ProgressService.unlockAchievement({
          student_id: studentId,
          achievement_type: 'capsule_master',
          achievement_name: 'Maestro Supremo del Conocimiento',
          description: 'Completaste todos los niveles de Cápsulas del Tiempo',
          icon: '👑',
          points_awarded: 1000
        });
      }
    } catch (error) {
      console.error('Error unlocking level achievement:', error);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleLevelSelect = (levelId: number) => {
    if (levelId <= maxLevel) {
      setCurrentLevel(levelId);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getOptionColor = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index 
        ? 'border-purple-500 bg-purple-500/20' 
        : 'border-white/20 bg-white/5 hover:border-white/40';
    }

    if (index === currentQuestion?.correctAnswer) {
      return 'border-green-500 bg-green-500/20';
    }
    
    if (index === selectedAnswer && selectedAnswer !== currentQuestion?.correctAnswer) {
      return 'border-red-500 bg-red-500/20';
    }

    return 'border-white/10 bg-white/5';
  };

  const getLevelIcon = (level: Level) => {
    switch (level.name) {
      case 'ORO': return <Crown className="w-6 h-6" />;
      case 'PLATA': return <Gem className="w-6 h-6" />;
      case 'BRONCE': return <Trophy className="w-6 h-6" />;
      default: return <span className="text-2xl">{level.icon}</span>;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Cápsulas del Tiempo</h1>
            <p className="text-indigo-300">Sistema Escalonado de 7 Niveles - Polvo a Oro</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Panel */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {currentLevelData && getLevelIcon(currentLevelData)}
              </div>
              <h3 className="text-xl font-bold mb-2">{currentLevelData?.name}</h3>
              <p className="text-indigo-300 text-sm">{currentLevelData?.title}</p>
              <p className="text-gray-400 text-xs mt-1">
                Pregunta {currentQuestionIndex + 1} de {currentLevelData?.questions.length}
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>Puntos</span>
                  </div>
                  <span className="font-bold text-yellow-400">{totalPoints}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(totalPoints / totalPossiblePoints) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-orange-400" />
                    <span>AulaMonedas</span>
                  </div>
                  <span className="font-bold text-orange-400">{totalCoins}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(totalCoins / totalPossibleCoins) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Level Selector */}
            <div>
              <h4 className="font-bold mb-3">Niveles Disponibles</h4>
              <div className="space-y-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleLevelSelect(level.id)}
                    disabled={level.id > maxLevel}
                    className={`w-full p-3 rounded-lg font-bold text-sm transition-all duration-300 flex items-center space-x-3 ${
                      completedLevels.includes(level.id)
                        ? 'bg-green-500 text-white'
                        : level.id === currentLevel
                        ? `bg-gradient-to-r ${level.color} text-white`
                        : level.id <= maxLevel
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      {level.id <= 4 ? (
                        <span className="text-lg">{level.icon}</span>
                      ) : (
                        getLevelIcon(level)
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{level.name}</div>
                      <div className="text-xs opacity-75">{level.questions.length} preguntas</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Panel */}
          <div className="lg:col-span-3">
            {currentQuestion && currentLevelData && (
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${currentLevelData.color} rounded-full flex items-center justify-center`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{currentLevelData.name} - Pregunta {currentQuestionIndex + 1}</h3>
                      <p className="text-indigo-300 text-sm">
                        {currentLevelData.pointsPerQuestion} puntos • {currentLevelData.coinsPerQuestion} monedas
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-400">
                      {currentQuestionIndex + 1}/{currentLevelData.questions.length}
                    </div>
                    <div className="text-xs text-gray-400">Progreso del Nivel</div>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h4 className="text-2xl font-bold mb-6 text-center leading-relaxed">
                    {currentQuestion.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${getOptionColor(index)} ${
                          !showResult ? 'hover:scale-[1.02]' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                            selectedAnswer === index ? 'border-white bg-white text-black' : 'border-white/40'
                          }`}>
                            {String.fromCharCode(97 + index)}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result */}
                {showResult && (
                  <div className={`p-6 rounded-lg border-2 mb-6 ${
                    isCorrect 
                      ? 'bg-green-500/20 border-green-500/40' 
                      : 'bg-red-500/20 border-red-500/40'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <X className="w-8 h-8 text-red-400" />
                      )}
                      <div>
                        <h5 className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                        </h5>
                        {isCorrect && (
                          <p className="text-sm text-green-300">
                            +{currentLevelData.pointsPerQuestion} puntos • +{currentLevelData.coinsPerQuestion} monedas
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  {!showResult ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null || isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                    >
                      Confirmar Respuesta
                    </button>
                  ) : (
                    <div className="flex space-x-4">
                      {isCorrect && (
                        <button
                          onClick={handleNextQuestion}
                          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
                        >
                          {currentQuestionIndex < currentLevelData.questions.length - 1 ? 'Siguiente Pregunta' : 
                           currentLevel < levels.length ? 'Siguiente Nivel' : 'Finalizar'}
                        </button>
                      )}
                      {!isCorrect && (
                        <button
                          onClick={handleRetry}
                          className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
                        >
                          Intentar de Nuevo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-yellow-900 to-orange-900 rounded-2xl p-8 max-w-md w-full text-center border border-yellow-500/20">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold mb-4">¡MAESTRÍA ALCANZADA!</h3>
              <p className="text-lg mb-6">
                Has completado todos los niveles del sistema escalonado de Cápsulas del Tiempo
              </p>
              <div className="bg-black/30 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>Puntos Totales:</span>
                  <span className="font-bold text-yellow-400">{totalPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>AulaMonedas:</span>
                  <span className="font-bold text-orange-400">{totalCoins}</span>
                </div>
              </div>
              <button
                onClick={() => setShowCelebration(false)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-300"
              >
                ¡Increíble!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalCapsules;