import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Star, Timer, Flame, Camera, Award, Bot } from 'lucide-react';
import NutriBot from './NutriBot';
import { ProgressService } from '../services/progressService';

interface EnhancedActivityModuleProps {
  userData: any;
  setUserData: (data: any) => void;
  onBack: () => void;
}

const EnhancedActivityModule: React.FC<EnhancedActivityModuleProps> = ({ userData, setUserData, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [completedSideQuests, setCompletedSideQuests] = useState<number[]>([]);
  const [showNutriBot, setShowNutriBot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar actividades completadas desde Supabase
  useEffect(() => {
    loadCompletedActivities();
  }, [userData.id]);

  const loadCompletedActivities = async () => {
    try {
      const activities = await ProgressService.getCompletedActivities(userData.id);

      const mainQuests = activities
        .filter(a => a.activity_type === 'main_quest')
        .map(a => a.activity_level);

      const sideQuests = activities
        .filter(a => a.activity_type === 'side_quest')
        .map(a => a.activity_level);

      setCompletedActivities([...new Set(mainQuests)]);
      setCompletedSideQuests([...new Set(sideQuests)]);
    } catch (error) {
      console.error('Error loading activities:', error);
      // Fallback a localStorage si falla
      const savedActivities = localStorage.getItem(`activities_${userData.id}`);
      const savedSideQuests = localStorage.getItem(`sideQuests_${userData.id}`);
      if (savedActivities) setCompletedActivities(JSON.parse(savedActivities));
      if (savedSideQuests) setCompletedSideQuests(JSON.parse(savedSideQuests));
    }
  };

  const activityLevels = [
    {
      level: 1,
      title: 'Movimiento Diario',
      description: 'Registro de pasos + desafío de movimiento',
      duration: '15 min',
      points: 100,
      aulaCoins: 10,
      icon: '🚶‍♂️',
      difficulty: 'Fácil',
      image: 'https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Mi rincón activo',
        description: 'Toma una foto o haz un dibujo de tu espacio favorito para hacer ejercicio',
        points: 50,
        aulaCoins: 5
      },
      activities: [
        'Caminar 2000 pasos',
        'Subir y bajar escaleras 3 veces',
        'Estiramientos básicos (5 min)',
        'Registro en la app'
      ]
    },
    {
      level: 2,
      title: 'Fortalecer músculos',
      description: '3 rutinas guiadas por video + registro',
      duration: '20 min',
      points: 150,
      aulaCoins: 15,
      icon: '💪',
      difficulty: 'Fácil',
      image: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Mi fuerza en casa',
        description: 'Graba un video corto mostrando tu ejercicio favorito',
        points: 75,
        aulaCoins: 8
      },
      activities: [
        'Flexiones (adaptadas a tu nivel)',
        'Sentadillas (10 repeticiones)',
        'Plancha (30 segundos)',
        'Ejercicios con peso corporal'
      ]
    },
    {
      level: 3,
      title: 'Reducir sedentarismo',
      description: 'Contador de minutos sin pantalla',
      duration: '25 min',
      points: 200,
      aulaCoins: 20,
      icon: '📱',
      difficulty: 'Moderado',
      image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Mis 5 descansos activos',
        description: 'Documenta 5 momentos donde dejaste la pantalla para moverte',
        points: 100,
        aulaCoins: 10
      },
      activities: [
        'Pausas activas cada hora',
        'Tiempo sin pantallas (2 horas)',
        'Actividades al aire libre',
        'Juegos físicos tradicionales'
      ]
    },
    {
      level: 4,
      title: 'Sueño reparador',
      description: 'Cuestionario + seguimiento de horarios',
      duration: '30 min',
      points: 250,
      aulaCoins: 25,
      icon: '😴',
      difficulty: 'Moderado',
      image: 'https://images.pexels.com/photos/935777/pexels-photo-935777.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Diario de sueño',
        description: 'Registra tu rutina de sueño durante una semana',
        points: 125,
        aulaCoins: 12
      },
      activities: [
        'Dormir 8-9 horas',
        'Rutina de relajación',
        'Evitar pantallas antes de dormir',
        'Ambiente adecuado para descansar'
      ]
    },
    {
      level: 5,
      title: 'Postura y respiración',
      description: 'Yoga/respiración consciente guiada',
      duration: '35 min',
      points: 300,
      aulaCoins: 30,
      icon: '🧘‍♀️',
      difficulty: 'Difícil',
      image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=400',
      sideQuest: {
        title: 'Selfie en postura saludable',
        description: 'Toma una foto mostrando tu mejor postura',
        points: 150,
        aulaCoins: 15
      },
      activities: [
        'Ejercicios de respiración (10 min)',
        'Posturas de yoga básicas',
        'Corrección de postura',
        'Mindfulness y relajación'
      ]
    }
  ];

  const handleCompleteActivity = async (level: number) => {
    if (completedActivities.includes(level) || isLoading) return;

    setIsLoading(true);
    try {
      const activity = activityLevels.find(a => a.level === level);
      if (!activity) return;

      // Registrar en Supabase
      await ProgressService.recordCompletedActivity({
        student_id: userData.id,
        activity_level: level,
        activity_type: 'main_quest',
        points_earned: activity.points,
        coins_earned: activity.aulaCoins,
        duration_minutes: parseInt(activity.duration)
      });

      // Actualizar estado local
      const newCompleted = [...completedActivities, level];
      setCompletedActivities(newCompleted);

      // Backup en localStorage
      localStorage.setItem(`activities_${userData.id}`, JSON.stringify(newCompleted));

      // Actualizar datos del usuario
      const updatedProgress = await ProgressService.getOrCreateUserProgress(userData.id);
      setUserData({
        ...userData,
        totalPoints: updatedProgress.total_points,
        currentLevel: updatedProgress.current_level
      });

      // Verificar logros
      await checkAndUnlockAchievements(newCompleted.length, 'activity');
    } catch (error) {
      console.error('Error completing activity:', error);
      alert('Error al completar la actividad. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSideQuest = async (level: number) => {
    if (completedSideQuests.includes(level) || isLoading) return;

    setIsLoading(true);
    try {
      const activity = activityLevels.find(a => a.level === level);
      if (!activity) return;

      // Registrar en Supabase
      await ProgressService.recordCompletedActivity({
        student_id: userData.id,
        activity_level: level,
        activity_type: 'side_quest',
        points_earned: activity.sideQuest.points,
        coins_earned: activity.sideQuest.aulaCoins,
        notes: activity.sideQuest.description
      });

      // Actualizar estado local
      const newCompleted = [...completedSideQuests, level];
      setCompletedSideQuests(newCompleted);

      // Backup en localStorage
      localStorage.setItem(`sideQuests_${userData.id}`, JSON.stringify(newCompleted));

      // Actualizar datos del usuario
      const updatedProgress = await ProgressService.getOrCreateUserProgress(userData.id);
      setUserData({
        ...userData,
        totalPoints: updatedProgress.total_points,
        currentLevel: updatedProgress.current_level
      });

      // Verificar logros
      await checkAndUnlockAchievements(newCompleted.length, 'side_quest');
    } catch (error) {
      console.error('Error completing side quest:', error);
      alert('Error al completar el side quest. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndUnlockAchievements = async (completedCount: number, type: 'activity' | 'side_quest') => {
    try {
      if (type === 'activity' && completedCount === 5) {
        await ProgressService.unlockAchievement({
          student_id: userData.id,
          achievement_type: 'activity_master',
          achievement_name: 'Maestro de Actividad',
          description: 'Completaste todas las actividades físicas',
          icon: '🏆',
          points_awarded: 500
        });
      }

      if (type === 'side_quest' && completedCount === 5) {
        await ProgressService.unlockAchievement({
          student_id: userData.id,
          achievement_type: 'quest_master',
          achievement_name: 'Maestro de Side Quests',
          description: 'Completaste todos los side quests',
          icon: '⭐',
          points_awarded: 300
        });
      }
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const selectedActivity = activityLevels.find(a => a.level === selectedLevel);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Hábitos de Actividad Física</h1>
              <p className="text-purple-300">Niveles 1-5 • Estilo Quest + Recompensas</p>
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
            <h2 className="text-xl font-bold mb-6">Selecciona tu nivel de actividad</h2>
            <div className="space-y-4">
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
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-10 bg-cover bg-center"
                    style={{ backgroundImage: `url(${activity.image})` }}
                  ></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 relative z-10">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-4xl">{activity.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold">Nivel {activity.level}</h3>
                          <h4 className="text-purple-300 font-semibold">{activity.title}</h4>
                          <p className="text-sm text-gray-400">{activity.description}</p>
                        </div>
                      </div>

                      {/* Activities List */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {activity.activities.map((act, index) => (
                          <div key={index} className="text-xs bg-white/5 rounded px-2 py-1">
                            {act}
                          </div>
                        ))}
                      </div>

                      {/* Side Quest */}
                      <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Camera className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-semibold text-yellow-400">Side Quest</span>
                          {completedSideQuests.includes(activity.level) && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <h5 className="text-sm font-bold mb-1">{activity.sideQuest.title}</h5>
                        <p className="text-xs text-gray-400 mb-2">{activity.sideQuest.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-xs text-yellow-400">
                            <Star className="w-3 h-3" />
                            <span>+{activity.sideQuest.points} pts</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-orange-400">
                            <Award className="w-3 h-3" />
                            <span>+{activity.sideQuest.aulaCoins} monedas</span>
                          </div>
                        </div>
                      </div>

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
                          <div className="flex items-center space-x-1 text-sm text-orange-400">
                            <Award className="w-4 h-4" />
                            <span>{activity.aulaCoins} monedas</span>
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

                    {completedActivities.includes(activity.level) && (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 relative z-10" />
                    )}
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
                  <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-orange-400" />
                      <span>AulaMonedas</span>
                    </div>
                    <span className="font-semibold">{selectedActivity.aulaCoins} monedas</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleCompleteActivity(selectedActivity.level)}
                    disabled={completedActivities.includes(selectedActivity.level) || isLoading}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${isLoading ? 'opacity-50 cursor-wait' : ''} ${
                      completedActivities.includes(selectedActivity.level)
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {completedActivities.includes(selectedActivity.level) ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>¡Actividad Completada!</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          <span>Comenzar Quest</span>
                        </>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => handleCompleteSideQuest(selectedActivity.level)}
                    disabled={completedSideQuests.includes(selectedActivity.level) || isLoading}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${isLoading ? 'opacity-50 cursor-wait' : ''} ${
                      completedSideQuests.includes(selectedActivity.level)
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {completedSideQuests.includes(selectedActivity.level) ? (
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
        currentContext="actividad"
      />
    </div>
  );
};

export default EnhancedActivityModule;