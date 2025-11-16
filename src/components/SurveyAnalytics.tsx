import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Users, TrendingUp, FileSpreadsheet } from 'lucide-react';
import { SurveyService, SurveyStatistics, DetailedStatistics } from '../services/surveyService';

const SurveyAnalytics: React.FC = () => {
  const [statistics, setStatistics] = useState<SurveyStatistics[]>([]);
  const [detailedStats, setDetailedStats] = useState<DetailedStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setIsLoading(true);
    const stats = await SurveyService.getStatistics();
    const detailed = await SurveyService.getDetailedStatistics();
    setStatistics(stats);
    setDetailedStats(detailed);
    setIsLoading(false);
  };

  const handleExportResponses = async () => {
    const csv = await SurveyService.exportToCSV();
    if (csv) {
      const timestamp = new Date().toISOString().split('T')[0];
      SurveyService.downloadCSV(csv, `encuesta_respuestas_${timestamp}.csv`);
    }
  };

  const handleExportStatistics = async () => {
    const csv = await SurveyService.exportStatisticsToCSV();
    if (csv) {
      const timestamp = new Date().toISOString().split('T')[0];
      SurveyService.downloadCSV(csv, `encuesta_estadisticas_${timestamp}.csv`);
    }
  };

  const getLikertLabel = (value: number): string => {
    const labels = ['Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo'];
    return labels[value - 1] || '';
  };

  const getColorForScore = (score: number): string => {
    if (score >= 4.5) return 'text-green-400';
    if (score >= 4.0) return 'text-blue-400';
    if (score >= 3.5) return 'text-yellow-400';
    if (score >= 3.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getInterpretation = (mean: number): string => {
    if (mean >= 4.5) return 'Excelente - Alto nivel de acuerdo';
    if (mean >= 4.0) return 'Muy bueno - Acuerdo notable';
    if (mean >= 3.5) return 'Bueno - Acuerdo moderado';
    if (mean >= 3.0) return 'Aceptable - Tendencia positiva';
    if (mean >= 2.5) return 'Regular - Área de mejora';
    return 'Bajo - Requiere atención';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Cargando análisis estadístico...</p>
        </div>
      </div>
    );
  }

  if (!detailedStats || detailedStats.totalResponses === 0) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/20 text-center">
        <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Sin Datos Disponibles</h3>
        <p className="text-gray-400">
          Aún no hay encuestas completadas. Los análisis estadísticos aparecerán aquí cuando los estudiantes comiencen a responder.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
              Análisis Estadístico de Encuestas
            </h2>
            <p className="text-gray-400">Resultados agregados de evaluación pedagógica</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportResponses}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-semibold">Exportar Respuestas</span>
            </button>
            <button
              onClick={handleExportStatistics}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="text-sm font-semibold">Exportar Estadísticas</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-gray-400">Estudiantes Participantes</span>
            </div>
            <p className="text-4xl font-bold text-blue-400">{detailedStats.totalResponses}</p>
          </div>
          <div className="bg-black/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-gray-400">Promedio General</span>
            </div>
            <p className={`text-4xl font-bold ${getColorForScore(detailedStats.overallMean)}`}>
              {detailedStats.overallMean.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1">de 5.0</p>
          </div>
          <div className="bg-black/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span className="text-gray-400">Total de Respuestas</span>
            </div>
            <p className="text-4xl font-bold text-purple-400">{detailedStats.totalResponses * 12}</p>
            <p className="text-sm text-gray-400 mt-1">12 preguntas por estudiante</p>
          </div>
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h3 className="text-2xl font-bold mb-6">Análisis por Variable</h3>
        <div className="space-y-6">
          {statistics.map((stat, index) => {
            const percentage = (stat.mean_score / 5) * 100;
            const gradients = [
              { from: 'from-blue-500', to: 'to-cyan-500' },
              { from: 'from-green-500', to: 'to-emerald-500' },
              { from: 'from-purple-500', to: 'to-pink-500' }
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <div key={stat.variable_name} className="bg-black/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">{stat.variable_name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Media</p>
                        <p className={`text-2xl font-bold ${getColorForScore(stat.mean_score)}`}>
                          {stat.mean_score.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Desv. Estándar</p>
                        <p className="text-2xl font-bold text-gray-300">{stat.std_deviation.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Mínimo</p>
                        <p className="text-2xl font-bold text-gray-300">{stat.min_score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Máximo</p>
                        <p className="text-2xl font-bold text-gray-300">{stat.max_score}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 italic">{getInterpretation(stat.mean_score)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Progreso Visual</span>
                    <span className="text-sm font-semibold">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${gradient.from} ${gradient.to} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold mb-3 text-gray-400">Distribución de Frecuencias</h5>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((value) => {
                      const count = stat.frequency_distribution[value.toString() as '1' | '2' | '3' | '4' | '5'];
                      const freqPercentage = stat.response_count > 0 ? (count / stat.response_count) * 100 : 0;

                      return (
                        <div key={value} className="bg-black/30 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold mb-1">{value}</div>
                          <div className="text-sm text-gray-400 mb-2">{getLikertLabel(value).split(' ')[0]}</div>
                          <div className="text-xl font-bold text-blue-400">{count}</div>
                          <div className="text-xs text-gray-500">{freqPercentage.toFixed(1)}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
        <h3 className="text-2xl font-bold mb-6">Análisis Detallado por Pregunta</h3>
        <div className="space-y-8">
          {['Adaptación de estrategias', 'Atención a necesidades', 'Reflexión pedagógica'].map((variable) => {
            const questionsByVariable = detailedStats.questionStats.filter(q => q.variable === variable);

            return (
              <div key={variable}>
                <h4 className="text-xl font-bold mb-4 text-blue-400">{variable}</h4>
                <div className="space-y-4">
                  {questionsByVariable.map((question) => (
                    <div key={`${question.variable}_${question.questionNumber}`} className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                              P{question.questionNumber}
                            </span>
                            <span className={`text-lg font-bold ${getColorForScore(question.mean)}`}>
                              {question.mean.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">{question.questionText}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const count = question.frequencies[value.toString()];
                          const total = Object.values(question.frequencies).reduce((sum, c) => sum + c, 0);
                          const percentage = total > 0 ? (count / total) * 100 : 0;
                          const barHeight = percentage;

                          return (
                            <div key={value} className="flex flex-col items-center">
                              <div className="w-full bg-gray-700 rounded-t h-24 flex items-end overflow-hidden">
                                <div
                                  className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 transition-all duration-500"
                                  style={{ height: `${barHeight}%` }}
                                ></div>
                              </div>
                              <div className="text-center mt-2">
                                <div className="text-xs text-gray-400">{value}</div>
                                <div className="text-sm font-bold">{count}</div>
                                <div className="text-xs text-gray-500">{percentage.toFixed(0)}%</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30">
        <h3 className="text-2xl font-bold mb-4">Interpretación de Resultados</h3>
        <div className="space-y-4 text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-2">Escala de Interpretación:</h4>
            <ul className="space-y-1 text-sm">
              <li><span className="text-green-400 font-bold">4.5 - 5.0:</span> Excelente nivel de acuerdo</li>
              <li><span className="text-blue-400 font-bold">4.0 - 4.4:</span> Muy buen nivel de acuerdo</li>
              <li><span className="text-yellow-400 font-bold">3.5 - 3.9:</span> Buen nivel de acuerdo</li>
              <li><span className="text-orange-400 font-bold">3.0 - 3.4:</span> Nivel aceptable</li>
              <li><span className="text-red-400 font-bold">Menos de 3.0:</span> Área que requiere atención</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Sobre la Desviación Estándar:</h4>
            <p className="text-sm">
              Una desviación estándar baja (cercana a 0) indica consenso entre los estudiantes.
              Una desviación alta indica opiniones más diversas sobre ese aspecto de la práctica pedagógica.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Nota Metodológica:</h4>
            <p className="text-sm">
              Los datos presentados corresponden a {detailedStats.totalResponses} estudiantes que completaron la encuesta
              de manera anónima. Los análisis estadísticos incluyen medidas de tendencia central (media),
              dispersión (desviación estándar) y distribución de frecuencias para cada variable evaluada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalytics;
