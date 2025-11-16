import React, { useState, useEffect } from 'react';
import { Activity, Apple, TrendingUp, BookOpen, Heart, Target, Award, Zap, User, Bot, Coins, Users, ClipboardList, Rocket, Database } from 'lucide-react';
import { ProgressService } from '../services/progressService';
import { SurveyService } from '../services/surveyService';

interface DashboardProps {
  userData: {
    id: string;
    name: string;
    currentLevel: number;
    totalPoints: number;
    achievements: string[];
    tipo_usuario?: 'estudiante' | 'publico';
  };
  onNavigate: (view: string) => void;
  onOpenNutriBot: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onNavigate, onOpenNutriBot }) => {
  const [userProgress, setUserProgress] = useState<any>(null);
  const [completedActivitiesCount, setCompletedActivitiesCount] = useState(0);
  const [completedCapsulesCount, setCompletedCapsulesCount] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [userData.id]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Cargar progreso del usuario
      const progress = await ProgressService.getOrCreateUserProgress(userData.id);
      setUserProgress(progress);

      // Cargar actividades completadas
      const activities = await ProgressService.getCompletedActivities(userData.id);
      const mainQuests = activities.filter(a => a.activity_type === 'main_quest').length;
      setCompletedActivitiesCount(mainQuests);

      // Cargar cápsulas completadas
      const completedLevels = await ProgressService.getCompletedCapsuleLevels(userData.id);
      setCompletedCapsulesCount(completedLevels.length);

      // Cargar logros
      const userAchievements = await ProgressService.getUserAchievements(userData.id);
      setAchievements(userAchievements);

      // Verificar si completó la encuesta
      const surveyCompleted = await SurveyService.checkIfCompleted(userData.id);
      setIsSurveyCompleted(surveyCompleted);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback a datos locales si falla
      const activities = localStorage.getItem(`activities_${userData.id}`);
      const nutrition = localStorage.getItem(`nutrition_${userData.id}`);
      if (activities) setCompletedActivitiesCount(JSON.parse(activities).length);
    } finally {
      setIsLoading(false);
    }
  };

  const levelProgress = userProgress
    ? ((userProgress.total_points % 500) / 500) * 100
    : ((userData.totalPoints % 500) / 500) * 100;

  const aulaCoins = userProgress?.aula_coins || Math.floor(userData.totalPoints / 10);
  const totalPoints = userProgress?.total_points || userData.totalPoints;
  const currentLevel = userProgress?.current_level || userData.currentLevel;

  const progress = {
    activities: completedActivitiesCount,
    nutrition: 0 // TODO: Implementar tracking nutricional
  };

  const moduleCards = [
    {
      id: 'activity',
      title: 'Actividad Física',
      subtitle: 'Niveles 1-5',
      description: `${progress.activities}/5 niveles completados`,
      icon: Activity,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      progress: (progress.activities / 5) * 100
    },
    {
      id: 'nutrition',
      title: 'Diario Nutricional',
      subtitle: 'Niveles 6-10',
      description: `${progress.nutrition}/5 niveles completados`,
      icon: Apple,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      progress: (progress.nutrition / 5) * 100
    },
    {
      id: 'progress',
      title: 'Mi Progreso',
      subtitle: 'Estadísticas',
      description: 'Visualiza tu evolución',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'status',
      title: 'Estado Nutricional',
      subtitle: 'IMC y más',
      description: 'Datos desde Google Drive',
      icon: Heart,
      gradient: 'from-red-500 to-orange-500',
      bgGradient: 'from-red-500/20 to-orange-500/20'
    },
    {
      id: 'education',
      title: 'Cápsulas del Tiempo',
      subtitle: 'Educación',
      description: 'Contenido interactivo',
      icon: BookOpen,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/20 to-purple-500/20'
    },
    {
      id: 'coins',
      title: 'AulaMonedas',
      subtitle: 'Recompensas',
      description: 'Tu moneda virtual',
      icon: Coins,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: 'videos',
      title: 'Videos Educativos',
      subtitle: 'Multimedia',
      description: 'Contenido audiovisual',
      icon: BookOpen,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-500/20 to-pink-500/20'
    },
    {
      id: 'researcher',
      title: 'El Investigador',
      subtitle: 'Antony Tabima',
      description: 'Conoce al líder del proyecto',
      icon: User,
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-500/20 to-indigo-500/20'
    },
    {
      id: 'foro',
      title: 'Foro Departamental',
      subtitle: 'Educación 2025',
      description: 'Experiencia interactiva del foro',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'survey',
      title: 'Encuesta',
      subtitle: 'Evaluación Pedagógica',
      description: isSurveyCompleted ? '✓ Completada - 100 puntos' : 'Evalúa la práctica docente',
      icon: ClipboardList,
      gradient: 'from-teal-500 to-cyan-500',
      bgGradient: 'from-teal-500/20 to-cyan-500/20'
    },
    {
      id: 'emprende',
      title: 'EmprendeQuindío',
      subtitle: 'Ramón Messa Londoño',
      description: 'Marketplace Escolar del Quindío',
      icon: Rocket,
      gradient: 'from-green-600 to-yellow-500',
      bgGradient: 'from-green-600/20 to-yellow-500/20'
    },
    {
      id: 'session-one',
      title: 'Datos Sesión 1',
      subtitle: 'Pre y Post Test',
      description: 'Visualiza mediciones antropométricas',
      icon: Database,
      gradient: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-500/20 to-blue-500/20'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
          <h2 className="text-3xl font-bold mb-2">
            ¡Hola, {userData.name}! 👋
          </h2>
          <p className="text-purple-300 text-lg">
            Bienvenido a tu aventura de salud y bienestar
          </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {userProgress && (
              <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-purple-400">{userProgress.current_streak}</span>
                  <span className="text-sm text-gray-400">días racha</span>
                </div>
              </div>
            )}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-500/20">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-yellow-400">{aulaCoins}</span>
                <span className="text-sm text-gray-400">AulaMonedas</span>
              </div>
            </div>
            
            <button
              onClick={onOpenNutriBot}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Bot className="w-5 h-5" />
              <span className="font-semibold">NutriBot</span>
            </button>
          </div>
        </div>

        {userData.tipo_usuario === 'publico' && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-cyan-300 font-semibold mb-1">Perfil Público Activo</h4>
                <p className="text-cyan-200 text-sm">
                  Estás usando la plataforma como usuario público. Puedes explorar todos los módulos educativos,
                  gamificación y comunidad. Para acceder a evaluaciones físicas completas, contacta a tu institución educativa.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nivel {currentLevel}</h3>
                <p className="text-purple-300">Progreso actual</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">{totalPoints}</p>
              <p className="text-sm text-gray-400">Puntos totales</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">
            {Math.round(levelProgress)}% hacia el nivel {currentLevel + 1}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {moduleCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer hover:scale-105 transition-all duration-300 hover:border-white/20`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className={`text-sm bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent font-semibold mb-2`}>
                  {card.subtitle}
                </p>
                <p className="text-gray-300 text-sm">{card.description}</p>
                
                {/* Progress bar for activity and nutrition modules */}
                {(card.id === 'activity' || card.id === 'nutrition') && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${card.gradient} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${card.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{Math.round(card.progress || 0)}% completado</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Achievements */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold">Logros Recientes</h3>
          </div>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.slice(0, 6).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                  <span className="text-2xl">{achievement.icon || '🏆'}</span>
                  <span className="text-sm font-medium">{achievement.achievement_name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>¡Completa actividades para desbloquear logros!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;