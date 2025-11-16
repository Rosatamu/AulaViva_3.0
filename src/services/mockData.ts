// Datos simulados realistas para la aplicación
export const mockUsers = [
  {
    id: '001',
    nombres: 'Ana María',
    apellidos: 'González López',
    edad: 14,
    peso: 52,
    talla: 158,
    imc: 20.8,
    clasificacion: 'Normal',
    energia: 2100,
    carbohidratos: 315,
    proteinas: 84,
    actividad_fisica: 3
  },
  {
    id: '002',
    nombres: 'Carlos Andrés',
    apellidos: 'Ramírez Torres',
    edad: 15,
    peso: 68,
    talla: 172,
    imc: 23.0,
    clasificacion: 'Normal',
    energia: 2400,
    carbohidratos: 360,
    proteinas: 96,
    actividad_fisica: 4
  },
  {
    id: '003',
    nombres: 'María José',
    apellidos: 'Hernández Silva',
    edad: 13,
    peso: 45,
    talla: 152,
    imc: 19.5,
    clasificacion: 'Normal',
    energia: 1900,
    carbohidratos: 285,
    proteinas: 76,
    actividad_fisica: 2
  },
  {
    id: '004',
    nombres: 'Diego Alejandro',
    apellidos: 'Morales Castro',
    edad: 16,
    peso: 75,
    talla: 175,
    imc: 24.5,
    clasificacion: 'Sobrepeso',
    energia: 2600,
    carbohidratos: 390,
    proteinas: 104,
    actividad_fisica: 3
  },
  {
    id: '005',
    nombres: 'Valentina',
    apellidos: 'Rodríguez Peña',
    edad: 14,
    peso: 48,
    talla: 160,
    imc: 18.8,
    clasificacion: 'Normal',
    energia: 2000,
    carbohidratos: 300,
    proteinas: 80,
    actividad_fisica: 5
  },
  {
    id: '006',
    nombres: 'Sebastián',
    apellidos: 'López Vargas',
    edad: 15,
    peso: 62,
    talla: 168,
    imc: 22.0,
    clasificacion: 'Normal',
    energia: 2300,
    carbohidratos: 345,
    proteinas: 92,
    actividad_fisica: 4
  },
  {
    id: '007',
    nombres: 'Isabella',
    apellidos: 'Martínez Ruiz',
    edad: 13,
    peso: 42,
    talla: 150,
    imc: 18.7,
    clasificacion: 'Normal',
    energia: 1850,
    carbohidratos: 278,
    proteinas: 74,
    actividad_fisica: 3
  },
  {
    id: '008',
    nombres: 'Mateo',
    apellidos: 'García Jiménez',
    edad: 16,
    peso: 70,
    talla: 178,
    imc: 22.1,
    clasificacion: 'Normal',
    energia: 2500,
    carbohidratos: 375,
    proteinas: 100,
    actividad_fisica: 5
  }
];

export const getRandomTip = () => {
  const tips = [
    "💧 Beber agua es como darle combustible premium a tu cuerpo",
    "🏃‍♂️ Cada paso cuenta para ser más fuerte",
    "🥗 Los colores en tu plato son vitaminas disfrazadas",
    "😴 Dormir bien es el superpoder secreto de los campeones",
    "🧘‍♀️ Respirar profundo es como resetear tu mente",
    "🍎 Una manzana al día mantiene al doctor en la lejanía",
    "💪 Tu cuerpo es tu templo, cuídalo con amor",
    "🌟 Pequeños cambios crean grandes transformaciones"
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

export const getMotivationalMessage = (level: number) => {
  const messages = [
    "¡Estás comenzando una aventura increíble! 🚀",
    "¡Vas por buen camino, sigue así! 💪",
    "¡Eres imparable! Tu progreso es inspirador 🌟",
    "¡Wow! Estás dominando estos hábitos 🏆",
    "¡Eres un ejemplo a seguir! 👑",
    "¡Increíble dedicación! Sigues creciendo 🌱",
    "¡Eres una estrella de la salud! ⭐",
    "¡Fantástico! Tu constancia es admirable 🎯",
    "¡Casi en la cima! Eres increíble 🏔️",
    "¡LEYENDA! Has completado tu transformación 🎉"
  ];
  return messages[Math.min(level - 1, messages.length - 1)];
};