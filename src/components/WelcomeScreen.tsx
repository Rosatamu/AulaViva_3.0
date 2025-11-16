import React, { useState, useEffect } from 'react';
import { Star, Heart, Activity, Apple, Clock, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    setShowAnimation(true);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-6 overflow-hidden">
      <div className="relative w-full max-w-4xl">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-16 h-16 bg-blue-500/20 rounded-full animate-bounce transition-all duration-1000 ${showAnimation ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}></div>
          <div className={`absolute top-40 right-20 w-12 h-12 bg-green-500/20 rounded-full animate-bounce transition-all duration-1000 ${showAnimation ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute bottom-32 left-20 w-20 h-20 bg-purple-500/20 rounded-full animate-bounce transition-all duration-1000 ${showAnimation ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1.5s' }}></div>
          <div className={`absolute bottom-20 right-10 w-14 h-14 bg-pink-500/20 rounded-full animate-bounce transition-all duration-1000 ${showAnimation ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`text-center transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo y Título */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Aula Viva
                </h1>
                <p className="text-purple-300 text-lg">IE Ramón Messa Londoño - Quimbaya</p>
              </div>
            </div>

            {/* Reloj Digital */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/20 inline-block">
              <div className="flex items-center justify-center space-x-3 text-4xl font-mono text-purple-300 mb-2">
                <Clock className="w-8 h-8" />
                <span>{formatTime(currentTime)}</span>
              </div>
              <p className="text-sm text-gray-400">
                {currentTime.toLocaleDateString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Mensaje Principal */}
          <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-purple-500/20 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Heart className="w-8 h-8 text-red-400 animate-pulse" />
              <Activity className="w-8 h-8 text-blue-400" />
              <Apple className="w-8 h-8 text-green-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              "Tu cuerpo también va a clase."
            </h2>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
              ¡Actívalo y aliméntalo bien!
            </h3>
            
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Bienvenido a tu aventura de salud y bienestar. Aquí aprenderás hábitos saludables 
              mientras juegas, ganas puntos y desbloqueas logros increíbles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-bold text-blue-400 mb-1">Actividad Física</h4>
                <p className="text-sm text-gray-400">Niveles 1-5</p>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <Apple className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="font-bold text-green-400 mb-1">Nutrición</h4>
                <p className="text-sm text-gray-400">Niveles 6-10</p>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="font-bold text-purple-400 mb-1">Logros</h4>
                <p className="text-sm text-gray-400">AulaMonedas</p>
              </div>
            </div>
          </div>

          {/* Botón de Continuar */}
          <button
            onClick={onContinue}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <div className="flex items-center space-x-3">
              <span>Comenzar Aventura</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Información del Proyecto */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Investigación liderada por:
            </p>
            <p className="text-purple-300 font-semibold">
              Docente Antony Tabima Murillo, Magíster
            </p>
            <p className="text-gray-500 text-xs">
              Investigador en Actividad Física y Deporte
            </p>
          </div>
          <a
            href="https://www.youtube.com/@antonytabimam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <span className="text-lg">📺</span>
            <span className="font-semibold">Canal de YouTube</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;