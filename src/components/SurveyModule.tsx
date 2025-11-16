import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, ClipboardList, Award, BarChart3 } from 'lucide-react';
import { SurveyService, SURVEY_QUESTIONS, LIKERT_SCALE, SurveyResponse } from '../services/surveyService';
import { ProgressService } from '../services/progressService';

interface SurveyModuleProps {
  userData: {
    id: string;
    name: string;
  };
  onBack: () => void;
}

type SurveyStep = 'welcome' | 'questions' | 'review' | 'success' | 'results';

const SurveyModule: React.FC<SurveyModuleProps> = ({ userData, onBack }) => {
  const [currentStep, setCurrentStep] = useState<SurveyStep>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [questionId: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentResponses, setStudentResponses] = useState<SurveyResponse[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    checkSurveyStatus();
  }, [userData.id]);

  const checkSurveyStatus = async () => {
    setIsLoading(true);
    const completed = await SurveyService.checkIfCompleted(userData.id);
    setIsCompleted(completed);

    if (completed) {
      const studentResponses = await SurveyService.getStudentResponses(userData.id);
      setStudentResponses(studentResponses);
    }

    setIsLoading(false);
  };

  const handleResponseSelect = (questionId: number, value: number) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentStep('review');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const surveyResponses: SurveyResponse[] = SURVEY_QUESTIONS.map(question => ({
      questionId: question.id,
      variable: question.variable,
      questionText: question.text,
      likertValue: responses[question.id] || 0
    }));

    const result = await SurveyService.submitSurvey(userData.id, surveyResponses);

    if (result.success) {
      await ProgressService.updateUserProgress(userData.id, 100, 10);

      await ProgressService.unlockAchievement({
        student_id: userData.id,
        achievement_type: 'survey',
        achievement_name: 'Evaluador Comprometido',
        description: 'Completaste la encuesta de evaluación pedagógica',
        icon: '📋',
        points_awarded: 100
      });

      setCurrentStep('success');
      setIsCompleted(true);
    } else {
      alert(result.error || 'Error al enviar la encuesta');
    }

    setIsSubmitting(false);
  };

  const calculateVariableAverage = (variableName: string): number => {
    const variableResponses = studentResponses.filter(r => r.variable === variableName);
    if (variableResponses.length === 0) return 0;
    const sum = variableResponses.reduce((acc, r) => acc + r.likertValue, 0);
    return sum / variableResponses.length;
  };

  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / SURVEY_QUESTIONS.length) * 100;
  const allQuestionsAnswered = SURVEY_QUESTIONS.every(q => responses[q.id] !== undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (isCompleted && !showResults && currentStep !== 'success') {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>

          <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 text-center">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">¡Encuesta Completada!</h2>
            <p className="text-lg text-gray-300 mb-6">
              Ya has completado la encuesta de evaluación pedagógica. ¡Gracias por tu participación!
            </p>
            <p className="text-gray-400 mb-8">
              Tus respuestas han sido guardadas y contribuyen al análisis de la práctica docente.
            </p>
            <button
              onClick={() => setShowResults(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Ver Mis Respuestas</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const variables = ['Adaptación de estrategias', 'Atención a necesidades', 'Reflexión pedagógica'];

    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowResults(false)}
            className="mb-6 flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
              Mis Respuestas
            </h2>
            <p className="text-gray-400">Tus evaluaciones de la práctica pedagógica</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {variables.map((variable, index) => {
              const avg = calculateVariableAverage(variable);
              const percentage = (avg / 5) * 100;
              const gradients = [
                'from-blue-500 to-cyan-500',
                'from-green-500 to-emerald-500',
                'from-purple-500 to-pink-500'
              ];

              return (
                <div key={index} className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="font-bold mb-4 text-lg">{variable}</h3>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="transform -rotate-90" width="128" height="128">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{avg.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-400">Promedio de 5.0</p>
                </div>
              );
            })}
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Detalle de Respuestas</h3>
            <div className="space-y-4">
              {studentResponses.map((response, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm text-gray-400 mb-1">{response.variable}</p>
                  <p className="text-white mb-2">{response.questionText}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 font-bold text-lg">{response.likertValue}</span>
                    <span className="text-gray-400 text-sm">
                      - {LIKERT_SCALE.find(s => s.value === response.likertValue)?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
            <div className="text-center mb-8">
              <ClipboardList className="w-20 h-20 text-blue-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">Encuesta de Evaluación Pedagógica</h1>
              <p className="text-xl text-gray-300">
                Evaluación de la Práctica Docente
              </p>
            </div>

            <div className="bg-black/30 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Instrucciones</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Esta encuesta evalúa la práctica pedagógica de tu docente Antony Tabima Murillo</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Consta de 12 preguntas divididas en 3 áreas de evaluación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Responde con honestidad usando la escala de 1 a 5</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Tiempo estimado: 5-7 minutos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Tus respuestas son confidenciales y contribuyen a la investigación educativa</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 mb-8 border border-yellow-500/30">
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <Award className="w-6 h-6 mr-2 text-yellow-400" />
                Recompensa
              </h3>
              <p className="text-gray-300">
                Al completar la encuesta recibirás <span className="text-yellow-400 font-bold">100 puntos</span> y{' '}
                <span className="text-yellow-400 font-bold">10 AulaMonedas</span> como agradecimiento por tu participación.
              </p>
            </div>

            <div className="bg-black/30 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-3">Áreas de Evaluación</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h4 className="font-bold text-blue-400 mb-2">1. Adaptación de estrategias</h4>
                  <p className="text-sm text-gray-400">Variedad y ajuste de métodos de enseñanza</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <h4 className="font-bold text-green-400 mb-2">2. Atención a necesidades</h4>
                  <p className="text-sm text-gray-400">Respuesta a ritmos y necesidades individuales</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <h4 className="font-bold text-purple-400 mb-2">3. Reflexión pedagógica</h4>
                  <p className="text-sm text-gray-400">Evaluación y mejora continua de la práctica</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('questions')}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Comenzar Encuesta</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'questions') {
    const variableColors = {
      'Adaptación de estrategias': { gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-500/20 to-cyan-500/20' },
      'Atención a necesidades': { gradient: 'from-green-500 to-emerald-500', bg: 'from-green-500/20 to-emerald-500/20' },
      'Reflexión pedagógica': { gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-500/20 to-pink-500/20' }
    };

    const colors = variableColors[currentQuestion.variable as keyof typeof variableColors];

    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Pregunta {currentQuestionIndex + 1} de {SURVEY_QUESTIONS.length}
              </span>
              <span className="text-sm text-gray-400">{Math.round(progress)}% completado</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${colors.gradient} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-6`}>
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${colors.gradient} text-white font-semibold mb-4`}>
                {currentQuestion.variable}
              </span>
              <h2 className="text-2xl font-bold leading-relaxed">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="space-y-3">
              {LIKERT_SCALE.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleResponseSelect(currentQuestion.id, option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group ${
                    responses[currentQuestion.id] === option.value
                      ? `bg-gradient-to-r ${colors.gradient} border-white`
                      : 'bg-black/30 border-white/10 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  <span className={`text-2xl font-bold ${
                    responses[currentQuestion.id] === option.value ? 'text-white' : 'text-gray-500'
                  }`}>
                    {option.value}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-400 mt-6 text-center">
              💡 Tip: También puedes usar las teclas numéricas 1-5 para responder
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNext}
              disabled={responses[currentQuestion.id] === undefined}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                responses[currentQuestion.id] === undefined
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : `bg-gradient-to-r ${colors.gradient} hover:scale-105`
              }`}
            >
              <span>{currentQuestionIndex === SURVEY_QUESTIONS.length - 1 ? 'Revisar' : 'Siguiente'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    const groupedResponses: { [key: string]: typeof SURVEY_QUESTIONS } = {};
    SURVEY_QUESTIONS.forEach(q => {
      if (!groupedResponses[q.variable]) {
        groupedResponses[q.variable] = [];
      }
      groupedResponses[q.variable].push(q);
    });

    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 mb-6">
            <h2 className="text-3xl font-bold mb-2">Revisar Respuestas</h2>
            <p className="text-gray-400">Verifica tus respuestas antes de enviar la encuesta</p>
          </div>

          {!allQuestionsAnswered && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-300 font-semibold">
                ⚠️ Aún faltan preguntas por responder. Por favor, completa todas las preguntas antes de enviar.
              </p>
            </div>
          )}

          <div className="space-y-6 mb-8">
            {Object.entries(groupedResponses).map(([variable, questions]) => (
              <div key={variable} className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4 text-blue-400">{variable}</h3>
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                      <p className="text-gray-300 mb-2">{question.text}</p>
                      <div className="flex items-center space-x-2">
                        {responses[question.id] !== undefined ? (
                          <>
                            <span className="text-yellow-400 font-bold text-lg">{responses[question.id]}</span>
                            <span className="text-gray-400">
                              - {LIKERT_SCALE.find(s => s.value === responses[question.id])?.label}
                            </span>
                          </>
                        ) : (
                          <span className="text-red-400 font-semibold">Sin responder</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                setCurrentStep('questions');
                setCurrentQuestionIndex(0);
              }}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver a las preguntas</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered || isSubmitting}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !allQuestionsAnswered || isSubmitting
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Enviar Encuesta</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-12 border border-green-500/30 text-center">
            <div className="mb-6 animate-bounce">
              <CheckCircle className="w-24 h-24 text-green-400 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-4">¡Encuesta Completada!</h2>
            <p className="text-xl text-gray-300 mb-6">
              Gracias por tu participación, {userData.name}
            </p>
            <div className="bg-black/30 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Recompensas Obtenidas</h3>
              <div className="flex justify-center space-x-8">
                <div>
                  <p className="text-4xl font-bold text-yellow-400">100</p>
                  <p className="text-gray-400">Puntos</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-yellow-400">10</p>
                  <p className="text-gray-400">AulaMonedas</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-8">
              Tus respuestas han sido guardadas y contribuyen al análisis de la práctica pedagógica.
              Ahora formas parte de una investigación educativa importante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowResults(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Ver Mis Respuestas</span>
              </button>
              <button
                onClick={onBack}
                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SurveyModule;
