import React from 'react';
import { ArrowLeft, Heart, TrendingUp, AlertCircle, CheckCircle, Activity } from 'lucide-react';

interface NutritionalStatusProps {
  userData: {
    name: string;
    weight: number;
    height: number;
    imc: number;
    classification: string;
    age: number;
  };
  onBack: () => void;
}

const NutritionalStatus: React.FC<NutritionalStatusProps> = ({ userData, onBack }) => {
  const getIMCColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'bajo peso':
        return 'text-blue-400';
      case 'normal':
        return 'text-green-400';
      case 'sobrepeso':
        return 'text-yellow-400';
      case 'obesidad':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getIMCIcon = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'bajo peso':
        return <TrendingUp className="w-6 h-6 text-blue-400 rotate-180" />;
      case 'normal':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'sobrepeso':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'obesidad':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Heart className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRecommendations = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'bajo peso':
        return [
          'Aumenta la ingesta calórica con alimentos nutritivos',
          'Incluye proteínas en cada comida',
          'Realiza ejercicios de fortalecimiento',
          'Consulta con un nutricionista'
        ];
      case 'normal':
        return [
          'Mantén una alimentación balanceada',
          'Continúa con actividad física regular',
          'Hidratación adecuada',
          '¡Sigue así, lo estás haciendo muy bien!'
        ];
      case 'sobrepeso':
        return [
          'Reduce las porciones gradualmente',
          'Aumenta la actividad física',
          'Limita alimentos procesados',
          'Incluye más verduras en tus comidas'
        ];
      case 'obesidad':
        return [
          'Consulta con un profesional de la salud',
          'Planifica comidas saludables',
          'Inicia actividad física de forma gradual',
          'Busca apoyo familiar y social'
        ];
      default:
        return ['Mantén hábitos saludables'];
    }
  };

  // Datos simulados de progreso (en producción vendrían de Google Drive)
  const progressData = [
    { fecha: '2024-01', peso: 58, imc: 22.6, clasificacion: 'Sobrepeso' },
    { fecha: '2024-02', peso: 56, imc: 21.9, clasificacion: 'Normal' },
    { fecha: '2024-03', peso: 55, imc: 21.5, clasificacion: 'Normal' },
    { fecha: 'Actual', peso: userData.weight, imc: userData.imc, clasificacion: userData.classification }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Estado Nutricional</h1>
            <p className="text-red-300">Datos desde Google Drive • Clasificación OMS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Status */}
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <Heart className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold">Estado Actual</h3>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">{userData.weight} kg</p>
                  <p className="text-sm text-gray-400">Peso</p>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">{userData.height} cm</p>
                  <p className="text-sm text-gray-400">Talla</p>
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/20">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  {getIMCIcon(userData.classification)}
                  <h4 className="text-2xl font-bold">IMC: {userData.imc}</h4>
                </div>
                <p className={`text-lg font-semibold ${getIMCColor(userData.classification)}`}>
                  {userData.classification}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Clasificación según OMS para {userData.age} años
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold">Recomendaciones</h3>
              </div>

              <div className="space-y-3">
                {getRecommendations(userData.classification).map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-purple-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress History */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">Evolución</h3>
            </div>

            <div className="space-y-4">
              {progressData.map((data, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  index === progressData.length - 1
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-gray-500/10 border-gray-500/20'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{data.fecha}</span>
                    {index === progressData.length - 1 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Actual
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Peso</p>
                      <p className="font-bold text-blue-400">{data.peso} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-400">IMC</p>
                      <p className="font-bold text-purple-400">{data.imc}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Estado</p>
                      <p className={`font-bold ${getIMCColor(data.clasificacion)}`}>
                        {data.clasificacion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-yellow-400">Nota Importante</span>
              </div>
              <p className="text-sm text-gray-300">
                Los datos se actualizan automáticamente desde Google Drive. 
                Para cambios en tus medidas, contacta con tu docente o nutricionista.
              </p>
            </div>
          </div>
        </div>

        {/* API Connection Status */}
        <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">Sistema Aula Viva</h3>
              <p className="text-sm text-gray-400">
                Datos simulados realistas - Sistema educativo
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Activo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionalStatus;