import React, { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, Star, Timer, Flame } from 'lucide-react';

interface ActivityModuleProps {
  userData: any;
  setUserData: (data: any) => void;
  onBack: () => void;
}

const ActivityModule: React.FC<ActivityModuleProps> = ({ userData, setUserData, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);

  const activityLevels = [
    {
      level: 1,
      title: 'Caminar Básico',
      description: '10-15 minutos de caminata',
      duration: '15 min',
      points: 50,
      icon: '🚶‍♂️',
      difficulty: 'Fácil'
    },
    {
      level: 2,
      title: 'Ejercicios Suaves',
      description: 'Estiramientos y movimientos básicos',
      duration: '20 min',
      points: 100,
      icon: '🧘‍♀️',
      difficulty: 'Fácil'
    },
    {
      level: 3,
      title: 'Actividad Moderada',
      description: 'Caminata rápida o ejercicios dinámicos',
      duration: '25 min',
      points: 150,
      icon: '🏃‍♂️',
      difficulty: 'Moderado'
    },
    {
      level: 4,
      title: 'Entrenamiento Activo',
      description: 'Ejercicios cardiovasculares',
      duration: '30 min',
      points: 200,
      icon: '💪',
      difficulty: 'Moderado'
    },
    {
      level: 5,
      title: 'Desafío Intenso',
      description: 'Rutina completa de alta intensidad',
      duration: '35 min',
      points: 300,
      icon: '🔥',
      difficulty: 'Difícil'
    }
  ];

  const handleCompleteActivity = (level: number) => {
    if (!completedActivities.includes(level)) {
      const activity = activityLevels.find(a => a.level === level);
      setCompletedActivities([...completedActivities, level]);
      setUserData({
        ...userData,
        totalPoints: userData.totalPoints + (activity?.points || 0)
      });
    }
  };

  const selectedActivity = activityLevels.find(a => a.level === selectedLevel);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Actividad Física</h1>
            <p className="text-purple-300">Niveles 1-5 • Muévete y gana puntos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Level Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Selecciona tu nivel de actividad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activityLevels.map((activity) => (
                <div
                  key={activity.level}
                  onClick={() => setSelectedLevel(activity.level)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedLevel === activity.level
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/10 bg-black/30 hover:border-white/20'
                  } ${
                    completedActivities.includes(activity.level)
                      ? 'bg-green-500/20 border-green-500'
                      : ''
                  }`}
                >
                  {completedActivities.includes(activity.level) && (
                    <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-green-400" />
                  )}
                  
                  <div className="text-4xl mb-3">{activity.icon}</div>
                  <h3 className="text-lg font-bold mb-2">Nivel {activity.level}</h3>
                  <h4 className="text-purple-300 font-semibold mb-2">{activity.title}</h4>
                  <p className="text-sm text-gray-400 mb-4">{activity.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-sm text-blue-400">
                        <Timer className="w-4 h-4" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span>{activity.points} pts</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-400' :
                      activity.difficulty === 'Moderado' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {activity.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Detail */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 h-fit sticky top-24">
            {selectedActivity && (
              <>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedActivity.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{selectedActivity.title}</h3>
                  <p className="text-purple-300 mb-4">{selectedActivity.description}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Timer className="w-5 h-5 text-blue-400" />
                      <span>Duración</span>
                    </div>
                    <span className="font-semibold">{selectedActivity.duration}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>Puntos</span>
                    </div>
                    <span className="font-semibold">{selectedActivity.points} pts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-red-400" />
                      <span>Dificultad</span>
                    </div>
                    <span className="font-semibold">{selectedActivity.difficulty}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCompleteActivity(selectedActivity.level)}
                  disabled={completedActivities.includes(selectedActivity.level)}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                    completedActivities.includes(selectedActivity.level)
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {completedActivities.includes(selectedActivity.level) ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>¡Completado!</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Comenzar Actividad</span>
                      </>
                    )}
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModule;