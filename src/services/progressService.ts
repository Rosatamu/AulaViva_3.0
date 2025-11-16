import { supabase } from '../lib/supabase';

export interface UserProgress {
  id: string;
  student_id: string;
  current_level: number;
  total_points: number;
  aula_coins: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompletedActivity {
  id?: string;
  student_id: string;
  activity_level: number;
  activity_type: 'main_quest' | 'side_quest';
  points_earned: number;
  coins_earned: number;
  duration_minutes?: number;
  notes?: string;
  completed_at?: string;
}

export interface CompletedCapsule {
  id?: string;
  student_id: string;
  level_id: number;
  question_id: number;
  selected_answer: number;
  is_correct: boolean;
  attempt_number: number;
  points_earned: number;
  coins_earned: number;
  time_taken_seconds?: number;
  answered_at?: string;
}

export interface Achievement {
  id?: string;
  student_id: string;
  achievement_type: string;
  achievement_name: string;
  description?: string;
  icon?: string;
  points_awarded: number;
  unlocked_at?: string;
}

export interface WeeklyStat {
  student_id: string;
  week_start_date: string;
  activities_completed: number;
  capsules_completed: number;
  total_points_week: number;
  total_coins_week: number;
  active_days: number;
}

export class ProgressService {
  /**
   * Obtener o crear progreso del usuario
   */
  static async getOrCreateUserProgress(studentId: string): Promise<UserProgress> {
    try {
      // Intentar obtener progreso existente
      const { data: existing, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user progress:', fetchError);
        throw new Error('Error al obtener progreso del usuario');
      }

      if (existing) {
        return existing as UserProgress;
      }

      // Si no existe, crear nuevo registro
      const { data: newProgress, error: insertError } = await supabase
        .from('user_progress')
        .insert({
          student_id: studentId,
          current_level: 1,
          total_points: 0,
          aula_coins: 0,
          current_streak: 0,
          longest_streak: 0
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user progress:', insertError);
        throw new Error('Error al crear progreso del usuario');
      }

      return newProgress as UserProgress;
    } catch (error) {
      console.error('Error in getOrCreateUserProgress:', error);
      throw error;
    }
  }

  /**
   * Actualizar puntos y nivel del usuario
   */
  static async updateUserProgress(
    studentId: string,
    pointsToAdd: number,
    coinsToAdd: number
  ): Promise<UserProgress> {
    try {
      const currentProgress = await this.getOrCreateUserProgress(studentId);

      const newTotalPoints = currentProgress.total_points + pointsToAdd;
      const newTotalCoins = currentProgress.aula_coins + coinsToAdd;

      // Calcular nuevo nivel (cada 500 puntos = 1 nivel)
      const newLevel = Math.floor(newTotalPoints / 500) + 1;

      const { data, error } = await supabase
        .from('user_progress')
        .update({
          total_points: newTotalPoints,
          aula_coins: newTotalCoins,
          current_level: Math.max(currentProgress.current_level, newLevel)
        })
        .eq('student_id', studentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user progress:', error);
        throw new Error('Error al actualizar progreso');
      }

      return data as UserProgress;
    } catch (error) {
      console.error('Error in updateUserProgress:', error);
      throw error;
    }
  }

  /**
   * Registrar actividad completada
   */
  static async recordCompletedActivity(
    activity: CompletedActivity
  ): Promise<CompletedActivity> {
    try {
      // Verificar si ya fue completada (evitar duplicados)
      const { data: existing } = await supabase
        .from('completed_activities')
        .select('*')
        .eq('student_id', activity.student_id)
        .eq('activity_level', activity.activity_level)
        .eq('activity_type', activity.activity_type)
        .maybeSingle();

      if (existing) {
        console.log('Activity already completed, skipping duplicate');
        return existing as CompletedActivity;
      }

      // Registrar actividad
      const { data, error } = await supabase
        .from('completed_activities')
        .insert(activity)
        .select()
        .single();

      if (error) {
        console.error('Error recording activity:', error);
        throw new Error('Error al registrar actividad');
      }

      // Actualizar progreso del usuario
      await this.updateUserProgress(
        activity.student_id,
        activity.points_earned,
        activity.coins_earned
      );

      // Actualizar estadísticas semanales
      await this.updateWeeklyStats(activity.student_id);

      return data as CompletedActivity;
    } catch (error) {
      console.error('Error in recordCompletedActivity:', error);
      throw error;
    }
  }

  /**
   * Obtener actividades completadas del usuario
   */
  static async getCompletedActivities(
    studentId: string,
    activityType?: 'main_quest' | 'side_quest'
  ): Promise<CompletedActivity[]> {
    try {
      let query = supabase
        .from('completed_activities')
        .select('*')
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false });

      if (activityType) {
        query = query.eq('activity_type', activityType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching completed activities:', error);
        throw new Error('Error al obtener actividades completadas');
      }

      return data as CompletedActivity[];
    } catch (error) {
      console.error('Error in getCompletedActivities:', error);
      throw error;
    }
  }

  /**
   * Registrar respuesta de cápsula educativa
   */
  static async recordCapsuleAnswer(
    capsule: CompletedCapsule
  ): Promise<CompletedCapsule> {
    try {
      const { data, error } = await supabase
        .from('completed_capsules')
        .insert(capsule)
        .select()
        .single();

      if (error) {
        console.error('Error recording capsule answer:', error);
        throw new Error('Error al registrar respuesta');
      }

      // Solo actualizar progreso si la respuesta es correcta
      if (capsule.is_correct) {
        await this.updateUserProgress(
          capsule.student_id,
          capsule.points_earned,
          capsule.coins_earned
        );
      }

      return data as CompletedCapsule;
    } catch (error) {
      console.error('Error in recordCapsuleAnswer:', error);
      throw error;
    }
  }

  /**
   * Obtener progreso de cápsulas por nivel
   */
  static async getCapsuleProgress(
    studentId: string,
    levelId?: number
  ): Promise<CompletedCapsule[]> {
    try {
      let query = supabase
        .from('completed_capsules')
        .select('*')
        .eq('student_id', studentId)
        .eq('is_correct', true)
        .order('answered_at', { ascending: false });

      if (levelId) {
        query = query.eq('level_id', levelId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching capsule progress:', error);
        throw new Error('Error al obtener progreso de cápsulas');
      }

      return data as CompletedCapsule[];
    } catch (error) {
      console.error('Error in getCapsuleProgress:', error);
      throw error;
    }
  }

  /**
   * Obtener niveles completados de cápsulas
   */
  static async getCompletedCapsuleLevels(studentId: string): Promise<number[]> {
    try {
      const capsules = await this.getCapsuleProgress(studentId);

      // Agrupar por nivel y contar preguntas correctas
      const levelCounts: { [key: number]: Set<number> } = {};

      capsules.forEach(capsule => {
        if (!levelCounts[capsule.level_id]) {
          levelCounts[capsule.level_id] = new Set();
        }
        levelCounts[capsule.level_id].add(capsule.question_id);
      });

      // Definir número de preguntas por nivel
      const questionsPerLevel = [10, 20, 20, 20, 20, 20, 10]; // POLVO a ORO

      // Determinar niveles completados
      const completedLevels: number[] = [];

      Object.entries(levelCounts).forEach(([levelId, questions]) => {
        const level = parseInt(levelId);
        const requiredQuestions = questionsPerLevel[level - 1] || 10;

        if (questions.size >= requiredQuestions) {
          completedLevels.push(level);
        }
      });

      return completedLevels;
    } catch (error) {
      console.error('Error in getCompletedCapsuleLevels:', error);
      return [];
    }
  }

  /**
   * Desbloquear logro
   */
  static async unlockAchievement(achievement: Achievement): Promise<Achievement> {
    try {
      // Verificar si ya fue desbloqueado
      const { data: existing } = await supabase
        .from('achievements')
        .select('*')
        .eq('student_id', achievement.student_id)
        .eq('achievement_type', achievement.achievement_type)
        .eq('achievement_name', achievement.achievement_name)
        .maybeSingle();

      if (existing) {
        console.log('Achievement already unlocked');
        return existing as Achievement;
      }

      const { data, error } = await supabase
        .from('achievements')
        .insert(achievement)
        .select()
        .single();

      if (error) {
        console.error('Error unlocking achievement:', error);
        throw new Error('Error al desbloquear logro');
      }

      // Actualizar puntos si el logro otorga puntos
      if (achievement.points_awarded > 0) {
        await this.updateUserProgress(
          achievement.student_id,
          achievement.points_awarded,
          0
        );
      }

      return data as Achievement;
    } catch (error) {
      console.error('Error in unlockAchievement:', error);
      throw error;
    }
  }

  /**
   * Obtener logros del usuario
   */
  static async getUserAchievements(studentId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('student_id', studentId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        throw new Error('Error al obtener logros');
      }

      return data as Achievement[];
    } catch (error) {
      console.error('Error in getUserAchievements:', error);
      throw error;
    }
  }

  /**
   * Actualizar estadísticas semanales
   */
  static async updateWeeklyStats(studentId: string): Promise<void> {
    try {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Inicio de semana (domingo)
      const weekStartStr = weekStart.toISOString().split('T')[0];

      // Obtener actividades y cápsulas de la semana
      const { data: activities } = await supabase
        .from('completed_activities')
        .select('*')
        .eq('student_id', studentId)
        .gte('completed_at', weekStart.toISOString());

      const { data: capsules } = await supabase
        .from('completed_capsules')
        .select('*')
        .eq('student_id', studentId)
        .eq('is_correct', true)
        .gte('answered_at', weekStart.toISOString());

      const activitiesCount = activities?.length || 0;
      const capsulesCount = capsules?.length || 0;

      const totalPointsWeek = [
        ...(activities || []).map(a => a.points_earned),
        ...(capsules || []).map(c => c.points_earned)
      ].reduce((sum, points) => sum + points, 0);

      const totalCoinsWeek = [
        ...(activities || []).map(a => a.coins_earned),
        ...(capsules || []).map(c => c.coins_earned)
      ].reduce((sum, coins) => sum + coins, 0);

      // Calcular días activos únicos
      const uniqueDates = new Set([
        ...(activities || []).map(a => a.completed_at.split('T')[0]),
        ...(capsules || []).map(c => c.answered_at.split('T')[0])
      ]);

      const stats: WeeklyStat = {
        student_id: studentId,
        week_start_date: weekStartStr,
        activities_completed: activitiesCount,
        capsules_completed: capsulesCount,
        total_points_week: totalPointsWeek,
        total_coins_week: totalCoinsWeek,
        active_days: uniqueDates.size
      };

      // Upsert (insertar o actualizar)
      const { error } = await supabase
        .from('weekly_stats')
        .upsert(stats, {
          onConflict: 'student_id,week_start_date'
        });

      if (error) {
        console.error('Error updating weekly stats:', error);
      }
    } catch (error) {
      console.error('Error in updateWeeklyStats:', error);
    }
  }

  /**
   * Obtener estadísticas semanales históricas
   */
  static async getWeeklyStatsHistory(
    studentId: string,
    weeksBack: number = 4
  ): Promise<WeeklyStat[]> {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - (weeksBack * 7));

      const { data, error } = await supabase
        .from('weekly_stats')
        .select('*')
        .eq('student_id', studentId)
        .gte('week_start_date', startDate.toISOString().split('T')[0])
        .order('week_start_date', { ascending: true });

      if (error) {
        console.error('Error fetching weekly stats:', error);
        throw new Error('Error al obtener estadísticas semanales');
      }

      return data as WeeklyStat[];
    } catch (error) {
      console.error('Error in getWeeklyStatsHistory:', error);
      throw error;
    }
  }

  /**
   * Migrar datos de localStorage a Supabase
   */
  static async migrateFromLocalStorage(studentId: string): Promise<void> {
    try {
      console.log('Starting migration from localStorage to Supabase...');

      // Migrar actividades completadas
      const activitiesKey = `activities_${studentId}`;
      const activitiesData = localStorage.getItem(activitiesKey);
      if (activitiesData) {
        const activityLevels = JSON.parse(activitiesData) as number[];
        for (const level of activityLevels) {
          await this.recordCompletedActivity({
            student_id: studentId,
            activity_level: level,
            activity_type: 'main_quest',
            points_earned: [100, 150, 200, 250, 300][level - 1] || 100,
            coins_earned: [10, 15, 20, 25, 30][level - 1] || 10
          });
        }
      }

      // Migrar side quests
      const sideQuestsKey = `sideQuests_${studentId}`;
      const sideQuestsData = localStorage.getItem(sideQuestsKey);
      if (sideQuestsData) {
        const sideQuestLevels = JSON.parse(sideQuestsData) as number[];
        for (const level of sideQuestLevels) {
          await this.recordCompletedActivity({
            student_id: studentId,
            activity_level: level,
            activity_type: 'side_quest',
            points_earned: [50, 75, 100, 125, 150][level - 1] || 50,
            coins_earned: [5, 8, 10, 12, 15][level - 1] || 5
          });
        }
      }

      // Migrar datos de cápsulas educativas
      const quizPointsKey = 'quiz_total_points';
      const quizCoinsKey = 'quiz_total_coins';
      const completedLevelsKey = 'quiz_completed_levels';

      const quizPoints = localStorage.getItem(quizPointsKey);
      const quizCoins = localStorage.getItem(quizCoinsKey);
      const completedLevels = localStorage.getItem(completedLevelsKey);

      if (quizPoints || quizCoins) {
        // Actualizar puntos y monedas de cápsulas
        const points = parseInt(quizPoints || '0');
        const coins = parseInt(quizCoins || '0');
        if (points > 0 || coins > 0) {
          await this.updateUserProgress(studentId, points, coins);
        }
      }

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }
}
