import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle, Apple, Coffee, Sandwich, Cookie, Salad, Camera, Bot, Award, Star } from 'lucide-react';
import NutriBot from './NutriBot';

interface EnhancedNutritionModuleProps {
  userData: any;
  setUserData: (data: any) => void;
  onBack: () => void;
}

const EnhancedNutritionModule: React.FC<EnhancedNutritionModuleProps> = ({ userData, setUserData, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState(6);
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    const saved = localStorage.getItem(`nutrition_${userData.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [completedSideQuests, setCompletedSideQuests] = useState<number[]>(() => {
    const saved = localStorage.getItem(`nutritionSideQuests_${userData.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showNutriBot, setShowNutriBot] = useState(false);

  const nutritionLevels = [
    {
      level: 6,
      title: '¿Qué como a diario?',
      description: 'Registro fotográfico de comidas (3 días)',
      icon: Camera,
      color: 'from-orange-500 to-yellow-500',
      points: 150,
      aulaCoins: 15,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Mi plato saludable',
        description: 'Crea un diseño visual de tu plato ideal usando Canva o dibujo',
        points: 75,
        aulaCoins: 8
      },
      activities: [
        'Fotografiar desayuno, almuerzo y cena',
        'Registrar snacks y bebidas',
        'Identificar colores en el plato',
        'Reflexión con NutriBot'
      ]
    },
    {
      level: 7,
      title: 'Macronutrientes',
      description: 'Juego de clasificación de alimentos',
      icon: Apple,
      color: 'from-green-500 to-emerald-500',
      points: 175,
      aulaCoins: 18,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Equilibra tu plato',
        description: 'Juego interactivo de arrastrar y soltar alimentos',
        points: 90,
        aulaCoins: 9
      },
      activities: [
        'Clasificar proteínas, carbohidratos y grasas',
        'Juego de memoria nutricional',
        'Crear combinaciones balanceadas',
        'Quiz interactivo'
      ]
    },
    {
      level: 8,
      title: 'Hidratación',
      description: 'Seguimiento de vasos de agua',
      icon: Coffee,
      color: 'from-blue-500 to-cyan-500',
      points: 125,
      aulaCoins: 12,
      image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Agua vs. otras bebidas',
        description: 'Compara y registra diferentes tipos de bebidas',
        points: 65,
        aulaCoins: 7
      },
      activities: [
        'Contador de vasos de agua (8 al día)',
        'Registro de otras bebidas',
        'Calculadora de hidratación',
        'Recordatorios personalizados'
      ]
    },
    {
      level: 9,
      title: 'Etiquetas Nutricionales',
      description: 'Lectura y análisis gamificado',
      icon: Sandwich,
      color: 'from-purple-500 to-pink-500',
      points: 200,
      aulaCoins: 20,
      image: 'https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Explorador de etiquetas',
        description: 'Encuentra y analiza 5 etiquetas diferentes',
        points: 100,
        aulaCoins: 10
      },
      activities: [
        'Escanear códigos de barras',
        'Interpretar información nutricional',
        'Comparar productos similares',
        'Tomar decisiones informadas'
      ]
    },
    {
      level: 10,
      title: 'Comer con conciencia',
      description: 'Mindful eating + reflexión guiada por GPT',
      icon: Salad,
      color: 'from-indigo-500 to-purple-500',
      points: 250,
      aulaCoins: 25,
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Cápsula del sabor',
        description: 'Graba un audio describiendo tu experiencia de mindful eating',
        points: 125,
        aulaCoins: 12
      },
      activities: [
        'Ejercicios de alimentación consciente',
        'Reflexión sobre sensaciones',
        'Diario de emociones y comida',
        'Sesión guiada con NutriBot'
      ]
    }
  ];

  const handleCompleteLevel = (level: number) => {
    if (!completedLevels.includes(level)) {
      const nutritionLevel = nutritionLevels.find(n => n.level === level);
      const newCompleted = [...completedLevels, level];
      setCompletedLevels(newCompleted);
      localStorage.setItem(`nutrition_${userData.id}`, JSON.stringify(newCompleted));
      
      setUserData({
        ...userData,
        totalPoints: userData.totalPoints + (nutritionLevel?.points || 0),
        currentLevel: Math.max(userData.currentLevel, level + 1)
      });
    }
  };

  const handleCompleteSideQuest = (level: number) => {
    if (!completedSideQuests.includes(level)) {
      const nutritionLevel = nutritionLevels.find(n => n.level === level);
      const newCompleted = [...completedSideQuests, level];
      setCompletedSideQuests(newCompleted);
      localStorage.setItem(`nutritionSideQuests_${userData.id}`, JSON.stringify(newCompleted));
      
      setUserData({
        ...userData,
        totalPoints: userData.totalPoints + (nutritionLevel?.sideQuest.points || 0)
      });
    }
  };

  const selectedNutrition = nutritionLevels.find(n => n.level === selectedLevel);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Nutrición Consciente</h1>
              <p className="text-green-300">Niveles 6-10 • Registro visual y gamificado</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowNutriBot(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Bot className="w-5 h-5" />
            <span className="font-semibold">NutriBot</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Level Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Selecciona tu nivel nutricional</h2>
            <div className="space-y-4">
              {nutritionLevels.map((nutrition) => {
                const IconComponent = nutrition.icon;
                
                return (
                  <div
                    key={nutrition.level}
                    onClick={() => setSelectedLevel(nutrition.level)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedLevel === nutrition.level
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-white/10 bg-black/30 hover:border-white/20'
                    } ${
                      completedLevels.includes(nutrition.level)
                        ? 'bg-green-500/20 border-green-500'
                        : ''
                    }`}
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-10 bg-cover bg-center"
                      style={{ backgroundImage: `url(${nutrition.image})` }}
                    ></div>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1 relative z-10">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-16 h-16 bg-gradient-to-r ${nutrition.color} rounded-xl flex items-center justify-center`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">Nivel {nutrition.level}</h3>
                            <h4 className="text-green-300 font-semibold">{nutrition.title}</h4>
                            <p className="text-sm text-gray-400">{nutrition.description}</p>
                          </div>
                        </div>

                        {/* Activities List */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {nutrition.activities.map((activity, index) => (
                            <div key={index} className="text-xs bg-white/5 rounded px-2 py-1">
                              {activity}
                            </div>
                          ))}
                        </div>

                        {/* Side Quest */}
                        <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Camera className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400">Side Quest</span>
                            {completedSideQuests.includes(nutrition.level) && (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <h5 className="text-sm font-bold mb-1">{nutrition.sideQuest.title}</h5>
                          <p className="text-xs text-gray-400 mb-2">{nutrition.sideQuest.description}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-xs text-yellow-400">
                              <Star className="w-3 h-3" />
                              <span>+{nutrition.sideQuest.points} pts</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-orange-400">
                              <Award className="w-3 h-3" />
                              <span>+{nutrition.sideQuest.aulaCoins} monedas</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-sm text-yellow-400">
                              <Star className="w-4 h-4" />
                              <span>{nutrition.points} pts</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-orange-400">
                              <Award className="w-4 h-4" />
                              <span>{nutrition.aulaCoins} monedas</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {completedLevels.includes(nutrition.level) && (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 relative z-10" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nutrition Detail */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 h-fit sticky top-24">
            {selectedNutrition && (
              <>
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${selectedNutrition.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <selectedNutrition.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{selectedNutrition.title}</h3>
                  <p className="text-green-300 mb-4">{selectedNutrition.description}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>Puntos</span>
                    </div>
                    <span className="font-semibold">{selectedNutrition.points} pts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-orange-400" />
                      <span>AulaMonedas</span>
                    </div>
                    <span className="font-semibold">{selectedNutrition.aulaCoins} monedas</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleCompleteLevel(selectedNutrition.level)}
                    disabled={completedLevels.includes(selectedNutrition.level)}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      completedLevels.includes(selectedNutrition.level)
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {completedLevels.includes(selectedNutrition.level) ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>¡Nivel Completado!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>Comenzar Nivel</span>
                        </>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => handleCompleteSideQuest(selectedNutrition.level)}
                    disabled={completedSideQuests.includes(selectedNutrition.level)}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      completedSideQuests.includes(selectedNutrition.level)
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {completedSideQuests.includes(selectedNutrition.level) ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>¡Side Quest Completado!</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4" />
                          <span>Completar Side Quest</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <NutriBot
        isOpen={showNutriBot}
        onClose={() => setShowNutriBot(false)}
        userData={userData}
        currentContext="nutricion"
      />
    </div>
  );
};

export default EnhancedNutritionModule;