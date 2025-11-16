import { supabase } from '../lib/supabase';

export interface SurveyQuestion {
  id: number;
  text: string;
  variable: string;
}

export interface SurveyResponse {
  questionId: number;
  variable: string;
  questionText: string;
  likertValue: number;
}

export interface SurveySession {
  id: string;
  student_id: string;
  teacher_evaluated: string;
  total_score: number;
  is_completed: boolean;
  completed_at: string;
  created_at: string;
}

export interface SurveyStatistics {
  variable_name: string;
  mean_score: number;
  std_deviation: number;
  min_score: number;
  max_score: number;
  response_count: number;
  frequency_distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  calculated_at: string;
}

export interface DetailedStatistics {
  totalResponses: number;
  overallMean: number;
  variableStats: SurveyStatistics[];
  questionStats: {
    variable: string;
    questionNumber: number;
    questionText: string;
    mean: number;
    frequencies: { [key: string]: number };
  }[];
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    variable: 'Adaptación de estrategias',
    text: 'El docente emplea una variedad de estrategias de enseñanza (por ejemplo, aprendizaje cooperativo, uso de TIC, dinámicas grupales) en sus clases.'
  },
  {
    id: 2,
    variable: 'Adaptación de estrategias',
    text: 'El docente adapta las estrategias de enseñanza según el contexto y las características del grupo de estudiantes.'
  },
  {
    id: 3,
    variable: 'Adaptación de estrategias',
    text: 'El docente modifica sus estrategias de enseñanza cuando observa que no son efectivas para el aprendizaje.'
  },
  {
    id: 4,
    variable: 'Adaptación de estrategias',
    text: 'El docente incorpora recursos o materiales didácticos diversos para facilitar la comprensión de los contenidos.'
  },
  {
    id: 5,
    variable: 'Atención a necesidades',
    text: 'El docente identifica las necesidades específicas de aprendizaje de los estudiantes (por ejemplo, estilos de aprendizaje, dificultades, intereses).'
  },
  {
    id: 6,
    variable: 'Atención a necesidades',
    text: 'El docente ajusta el ritmo de enseñanza según el nivel de comprensión de los estudiantes.'
  },
  {
    id: 7,
    variable: 'Atención a necesidades',
    text: 'El docente ofrece actividades diferenciadas para atender a estudiantes con distintos ritmos de aprendizaje.'
  },
  {
    id: 8,
    variable: 'Atención a necesidades',
    text: 'El docente proporciona apoyo adicional (como tutorías o recursos) a los estudiantes que lo necesitan.'
  },
  {
    id: 9,
    variable: 'Reflexión pedagógica',
    text: 'El docente evalúa regularmente el impacto de sus estrategias de enseñanza en el aprendizaje de los estudiantes.'
  },
  {
    id: 10,
    variable: 'Reflexión pedagógica',
    text: 'El docente utiliza retroalimentación de los estudiantes para mejorar su práctica pedagógica.'
  },
  {
    id: 11,
    variable: 'Reflexión pedagógica',
    text: 'El docente reflexiona sobre los resultados de las evaluaciones para ajustar su enseñanza.'
  },
  {
    id: 12,
    variable: 'Reflexión pedagógica',
    text: 'El docente documenta o registra sus reflexiones sobre su práctica pedagógica para su mejora continua.'
  }
];

export const LIKERT_SCALE = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' }
];

export class SurveyService {
  static async checkIfCompleted(studentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('survey_sessions')
        .select('is_completed')
        .eq('student_id', studentId)
        .eq('is_completed', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking survey completion:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkIfCompleted:', error);
      return false;
    }
  }

  static async getStudentSession(studentId: string): Promise<SurveySession | null> {
    try {
      const { data, error } = await supabase
        .from('survey_sessions')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching student session:', error);
        return null;
      }

      return data as SurveySession;
    } catch (error) {
      console.error('Error in getStudentSession:', error);
      return null;
    }
  }

  static async submitSurvey(
    studentId: string,
    responses: SurveyResponse[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const isCompleted = await this.checkIfCompleted(studentId);
      if (isCompleted) {
        return { success: false, error: 'Ya has completado la encuesta' };
      }

      const totalScore = responses.reduce((sum, r) => sum + r.likertValue, 0) / responses.length;

      const { data: session, error: sessionError } = await supabase
        .from('survey_sessions')
        .insert({
          student_id: studentId,
          teacher_evaluated: 'Antony Tabima Murillo',
          total_score: totalScore,
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating survey session:', sessionError);
        return { success: false, error: 'Error al guardar la encuesta' };
      }

      const responseRecords = responses.map((response, index) => ({
        session_id: session.id,
        student_id: studentId,
        variable_name: response.variable,
        question_number: (index % 4) + 1,
        question_text: response.questionText,
        likert_value: response.likertValue
      }));

      const { error: responsesError } = await supabase
        .from('survey_responses')
        .insert(responseRecords);

      if (responsesError) {
        console.error('Error saving survey responses:', responsesError);
        return { success: false, error: 'Error al guardar las respuestas' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in submitSurvey:', error);
      return { success: false, error: 'Error inesperado al enviar la encuesta' };
    }
  }

  static async getStudentResponses(studentId: string): Promise<SurveyResponse[]> {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('student_id', studentId)
        .order('answered_at', { ascending: true });

      if (error) {
        console.error('Error fetching student responses:', error);
        return [];
      }

      return data.map((r, index) => ({
        questionId: index + 1,
        variable: r.variable_name,
        questionText: r.question_text,
        likertValue: r.likert_value
      }));
    } catch (error) {
      console.error('Error in getStudentResponses:', error);
      return [];
    }
  }

  static async getStatistics(): Promise<SurveyStatistics[]> {
    try {
      const { data, error } = await supabase
        .from('survey_statistics')
        .select('*')
        .order('variable_name', { ascending: true });

      if (error) {
        console.error('Error fetching statistics:', error);
        return [];
      }

      return data as SurveyStatistics[];
    } catch (error) {
      console.error('Error in getStatistics:', error);
      return [];
    }
  }

  static async getDetailedStatistics(): Promise<DetailedStatistics | null> {
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('survey_sessions')
        .select('*')
        .eq('is_completed', true);

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return null;
      }

      const { data: allResponses, error: responsesError } = await supabase
        .from('survey_responses')
        .select('*');

      if (responsesError) {
        console.error('Error fetching responses:', responsesError);
        return null;
      }

      const variableStats = await this.getStatistics();

      const overallMean = sessions.reduce((sum, s) => sum + parseFloat(s.total_score), 0) / sessions.length || 0;

      const questionStatsMap: { [key: string]: any } = {};
      allResponses.forEach(response => {
        const key = `${response.variable_name}_${response.question_number}`;
        if (!questionStatsMap[key]) {
          questionStatsMap[key] = {
            variable: response.variable_name,
            questionNumber: response.question_number,
            questionText: response.question_text,
            values: [],
            frequencies: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
          };
        }
        questionStatsMap[key].values.push(response.likert_value);
        questionStatsMap[key].frequencies[response.likert_value.toString()]++;
      });

      const questionStats = Object.values(questionStatsMap).map((stat: any) => ({
        variable: stat.variable,
        questionNumber: stat.questionNumber,
        questionText: stat.questionText,
        mean: stat.values.reduce((sum: number, v: number) => sum + v, 0) / stat.values.length || 0,
        frequencies: stat.frequencies
      }));

      return {
        totalResponses: sessions.length,
        overallMean: parseFloat(overallMean.toFixed(2)),
        variableStats,
        questionStats
      };
    } catch (error) {
      console.error('Error in getDetailedStatistics:', error);
      return null;
    }
  }

  static async exportToCSV(): Promise<string> {
    try {
      const { data: responses, error } = await supabase
        .from('survey_responses')
        .select('*')
        .order('student_id', { ascending: true })
        .order('answered_at', { ascending: true });

      if (error) {
        console.error('Error fetching responses for export:', error);
        return '';
      }

      const headers = [
        'ID_Estudiante',
        'Variable',
        'Numero_Pregunta',
        'Pregunta',
        'Valor_Likert',
        'Fecha_Respuesta'
      ];

      const rows = responses.map(r => [
        r.student_id,
        r.variable_name,
        r.question_number,
        `"${r.question_text}"`,
        r.likert_value,
        r.answered_at
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error in exportToCSV:', error);
      return '';
    }
  }

  static async exportStatisticsToCSV(): Promise<string> {
    try {
      const stats = await this.getDetailedStatistics();
      if (!stats) return '';

      const headers = [
        'Variable',
        'Numero_Pregunta',
        'Pregunta',
        'Media',
        'Frecuencia_1',
        'Frecuencia_2',
        'Frecuencia_3',
        'Frecuencia_4',
        'Frecuencia_5'
      ];

      const rows = stats.questionStats.map(q => [
        q.variable,
        q.questionNumber,
        `"${q.questionText}"`,
        q.mean.toFixed(2),
        q.frequencies['1'],
        q.frequencies['2'],
        q.frequencies['3'],
        q.frequencies['4'],
        q.frequencies['5']
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error in exportStatisticsToCSV:', error);
      return '';
    }
  }

  static downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
