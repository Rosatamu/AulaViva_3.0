import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Target, Award, Calendar } from 'lucide-react';
import { ProgressService, WeeklyStat } from '../services/progressService';

interface ProgressViewProps {
  userData: {
    id: string;
    currentLevel: number;
    totalPoints: number;
    achievements: string[];
  };
  onBack: () => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ userData, onBack }) => {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);

  useEffect(() => {
    loadProgressData();
  }, [userData.id]);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);

      // Cargar progreso general
      const progress = await ProgressService.getOrCreateUserProgress(userData.id);
      setUserProgress(progress);

      // Cargar estadísticas semanales (últimas 4 semanas)
      const stats = await ProgressService.getWeeklyStatsHistory(userData.id, 4);
      setWeeklyStats(stats);

      // Cargar logros
      const userAchievements = await ProgressService.getUserAchievements(userData.id);
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generar datos para la semana actual (día por día)
  const getCurrentWeekData = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();
    const currentDay = today.getDay();

    return days.map((day, index) => {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - (currentDay - index));

      // Por ahora usar datos simulados, pero podrías implementar tracking diario
      return {
        day,
        activity: Math.floor(Math.random() * 3) + 1,
        nutrition: Math.floor(Math.random() * 3) + 1,
        total: Math.floor(Math.random() * 300) + 100
      };
    });
  };

  const weeklyData = getCurrentWeekData();
  const maxPoints = Math.max(...weeklyData.map(d => d.total), 1);

  // Calcular progreso por niveles basado en puntos reales
  const calculateLevelData = () => {
    const pointsPerLevel = 500;
    const totalPoints = userProgress?.total_points || userData.totalPoints;
    const currentLevel = userProgress?.current_level || userData.currentLevel;

    return Array.from({ length: 5 }, (_, i) => {
      const level = i + 1;
      const levelThreshold = level * pointsPerLevel;

      if (totalPoints >= levelThreshold) {
        return { level, points: pointsPerLevel, completed: true };
      } else if (level === currentLevel) {
        const currentLevelPoints = totalPoints % pointsPerLevel;
        return { level, points: pointsPerLevel, completed: false, current: currentLevelPoints };
      } else {
        return { level, points: pointsPerLevel, completed: false };
      }
    });
  };

  const levelData = calculateLevelData();

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-300">Cargando progreso...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">Mi Progreso</h1>
            <p className="text-purple-300">Visualiza tu evolución</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Actividad Semanal</h3>
            </div>
            
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="text-xs text-blue-400">Actividad: {day.activity}</div>
                      <div className="text-xs text-green-400">Nutrición: {day.nutrition}</div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(day.total / maxPoints) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{day.total} puntos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">Progreso por Niveles</h3>
            </div>
            
            <div className="space-y-4">
              {levelData.map((level, index) => (
                <div key={level.level} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    level.completed ? 'bg-green-500 text-white' :
                    level.current !== undefined ? 'bg-purple-500 text-white' :
                    'bg-gray-600 text-gray-400'
                  }`}>
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Nivel {level.level}</span>
                      <span className="text-xs text-gray-400">{level.points} pts</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          level.completed ? 'bg-green-500' :
                          level.current !== undefined ? 'bg-purple-500' :
                          'bg-gray-600'
                        }`}
                        style={{ 
                          width: level.completed ? '100%' : 
                                level.current !== undefined ? `${(level.current / level.points) * 100}%` : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Nivel Actual</h3>
                <p className="text-blue-300 text-sm">Tu progreso</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-400">{userProgress?.current_level || userData.currentLevel}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Puntos Totales</h3>
                <p className="text-yellow-300 text-sm">Acumulados</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{userProgress?.total_points || userData.totalPoints}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Logros</h3>
                <p className="text-green-300 text-sm">Obtenidos</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">{achievements.length}</p>
          </div>
        </div>

        {/* Achievements Detail */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold">Mis Logros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.length > 0 ? (
              achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-2xl">
                      {achievement.icon || '🏆'}
                    </div>
                    <div>
                      <h4 className="font-bold text-yellow-400">{achievement.achievement_name}</h4>
                      <p className="text-xs text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aún no has desbloqueado logros</p>
                <p className="text-sm">¡Completa actividades para ganar logros!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;