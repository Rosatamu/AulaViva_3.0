import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle, Apple, Coffee, Sandwich, Cookie, Salad } from 'lucide-react';

interface NutritionModuleProps {
  userData: any;
  setUserData: (data: any) => void;
  onBack: () => void;
}

const NutritionModule: React.FC<NutritionModuleProps> = ({ userData, setUserData, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState(6);
  const [dailyFoods, setDailyFoods] = useState<{[key: string]: string[]}>({});

  const nutritionLevels = [
    {
      level: 6,
      title: 'Desayuno Saludable',
      description: 'Registra tu primera comida del día',
      icon: Coffee,
      color: 'from-orange-500 to-yellow-500',
      points: 100,
      mealType: 'desayuno'
    },
    {
      level: 7,
      title: 'Snack Nutritivo',
      description: 'Media mañana o tarde saludable',
      icon: Apple,
      color: 'from-green-500 to-emerald-500',
      points: 75,
      mealType: 'snack'
    },
    {
      level: 8,
      title: 'Almuerzo Balanceado',
      description: 'Comida principal del día',
      icon: Sandwich,
      color: 'from-blue-500 to-cyan-500',
      points: 150,
      mealType: 'almuerzo'
    },
    {
      level: 9,
      title: 'Merienda Consciente',
      description: 'Snack de tarde inteligente',
      icon: Cookie,
      color: 'from-purple-500 to-pink-500',
      points: 75,
      mealType: 'merienda'
    },
    {
      level: 10,
      title: 'Cena Ligera',
      description: 'Última comida del día',
      icon: Salad,
      color: 'from-indigo-500 to-purple-500',
      points: 125,
      mealType: 'cena'
    }
  ];

  const foodOptions = {
    desayuno: ['Avena con frutas', 'Huevos revueltos', 'Yogur natural', 'Tostada integral', 'Frutas frescas', 'Cereales integrales'],
    snack: ['Manzana', 'Nueces', 'Yogur griego', 'Zanahoria', 'Banana', 'Frutos secos'],
    almuerzo: ['Pollo a la plancha', 'Arroz integral', 'Ensalada verde', 'Pescado', 'Verduras al vapor', 'Legumbres'],
    merienda: ['Galletas integrales', 'Smoothie natural', 'Fruta picada', 'Té de hierbas', 'Yogur', 'Granola'],
    cena: ['Sopa de verduras', 'Ensalada mixta', 'Proteína ligera', 'Verduras asadas', 'Té relajante', 'Fruta']
  };

  const selectedMeal = nutritionLevels.find(n => n.level === selectedLevel);

  const addFood = (food: string) => {
    if (!selectedMeal) return;
    
    const mealType = selectedMeal.mealType;
    const currentFoods = dailyFoods[mealType] || [];
    
    if (!currentFoods.includes(food)) {
      setDailyFoods({
        ...dailyFoods,
        [mealType]: [...currentFoods, food]
      });
      
      setUserData({
        ...userData,
        totalPoints: userData.totalPoints + 25
      });
    }
  };

  const removeFood = (food: string) => {
    if (!selectedMeal) return;
    
    const mealType = selectedMeal.mealType;
    const currentFoods = dailyFoods[mealType] || [];
    
    setDailyFoods({
      ...dailyFoods,
      [mealType]: currentFoods.filter(f => f !== food)
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Diario Nutricional</h1>
            <p className="text-green-300">Niveles 6-10 • Registra tus comidas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meal Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Selecciona el tipo de comida</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {nutritionLevels.map((meal) => {
                const IconComponent = meal.icon;
                const currentFoods = dailyFoods[meal.mealType] || [];
                
                return (
                  <div
                    key={meal.level}
                    onClick={() => setSelectedLevel(meal.level)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedLevel === meal.level
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-white/10 bg-black/30 hover:border-white/20'
                    }`}
                  >
                    {currentFoods.length > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {currentFoods.length} items
                      </div>
                    )}
                    
                    <div className={`w-16 h-16 bg-gradient-to-r ${meal.color} rounded-xl flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Nivel {meal.level}</h3>
                    <h4 className="text-green-300 font-semibold mb-2">{meal.title}</h4>
                    <p className="text-sm text-gray-400">{meal.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Food Selection */}
            {selectedMeal && (
              <div>
                <h3 className="text-lg font-bold mb-4">Alimentos para {selectedMeal.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(foodOptions[selectedMeal.mealType as keyof typeof foodOptions] || []).map((food) => (
                    <button
                      key={food}
                      onClick={() => addFood(food)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        (dailyFoods[selectedMeal.mealType] || []).includes(food)
                          ? 'border-green-500 bg-green-500/20'
                          : 'border-white/10 bg-black/30 hover:border-white/20 hover:scale-105'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">{food}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Daily Summary */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-6">Resumen del Día</h3>
            
            {nutritionLevels.map((meal) => {
              const currentFoods = dailyFoods[meal.mealType] || [];
              const IconComponent = meal.icon;
              
              return (
                <div key={meal.level} className="mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${meal.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{meal.title}</h4>
                      <p className="text-xs text-gray-400">{currentFoods.length} items</p>
                    </div>
                  </div>
                  
                  {currentFoods.length > 0 ? (
                    <div className="space-y-2">
                      {currentFoods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                          <span className="text-sm">{food}</span>
                          <button
                            onClick={() => removeFood(food)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Sin registros</p>
                  )}
                </div>
              );
            })}
            
            <div className="pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {Object.values(dailyFoods).flat().length * 25} pts
                </p>
                <p className="text-sm text-gray-400">Puntos de nutrición hoy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionModule;