import React, { useState } from 'react';
import { ArrowLeft, Award, BookOpen, Lightbulb, Cpu, Trophy, ExternalLink, Users, Target, BarChart3, Zap } from 'lucide-react';

interface ForoDepartamentalProps {
  onBack: () => void;
}

const ForoDepartamental: React.FC<ForoDepartamentalProps> = ({ onBack }) => {
  const [screen, setScreen] = useState("welcome");
  const [score, setScore] = useState(0);

  // Función para manejar respuestas de trivia
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 10);
      alert("✅ ¡Correcto! Ganaste 10 puntos.");
    } else {
      alert("❌ Respuesta incorrecta. Intenta de nuevo.");
    }
  };

  const ForoScreens = () => {
    switch (screen) {
      case "welcome":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Foro Departamental de Educación 2025</h1>
              <p className="text-lg text-gray-300">
                Bienvenidos al Foro Departamental de Educación 2025. Aquí conocerás cómo Aula Viva 
                transforma la educación rural mediante la gamificación, la ciencia y la innovación. 
                Avanza por cada sección, participa en la trivia y descubre cómo construimos Aula Viva.
              </p>
              
              {/* Imagen representativa */}
              <div className="my-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/20">
                <div className="text-4xl mb-2">🏫📱⚽</div>
                <p className="text-sm text-gray-400">Educación rural moderna con tecnología y deporte</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setScreen("introduccion")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Introducción</span>
              </button>
              
              <button
                onClick={() => setScreen("problema")}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Target className="w-5 h-5" />
                <span>Problema</span>
              </button>
              
              <button
                onClick={() => setScreen("metodologia")}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Metodología</span>
              </button>
              
              <button
                onClick={() => setScreen("innovacion-aula")}
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Innovación</span>
              </button>
              
              <button
                onClick={() => setScreen("ciencia")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Award className="w-5 h-5" />
                <span>Ciencia</span>
              </button>
              
              <button
                onClick={() => setScreen("innovacion")}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Lightbulb className="w-5 h-5" />
                <span>Innovación</span>
              </button>
              
              <button
                onClick={() => setScreen("tecnologia")}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Cpu className="w-5 h-5" />
                <span>Tecnología</span>
              </button>
              
              <button
                onClick={() => setScreen("trivia")}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Trophy className="w-5 h-5" />
                <span>Trivia</span>
              </button>
            </div>
          </div>
        );

      case "introduccion":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-blue-400">Introducción + Contexto</h2>
            </div>
            
            <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/20 mb-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                Aula Viva surge como respuesta al reto de motivar y retener a los estudiantes rurales. 
                Integra salud, tecnología y juego para transformar el aprendizaje y mejorar la calidad 
                de vida escolar.
              </p>
            </div>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-500/20 mb-6 text-center">
              <div className="text-6xl mb-4">🏫⚡🎮</div>
              <p className="text-sm text-gray-400">Transformación: Escuela tradicional → Escuela gamificada</p>
            </div>
            
            <button
              onClick={() => setScreen("problema")}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Continuar: Problema y Objetivos
            </button>
          </div>
        );

      case "problema":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-400">Problema + Objetivos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/20">
                <h3 className="text-lg font-bold text-red-400 mb-3">🚨 Problema</h3>
                <p className="text-gray-300">
                  Desmotivación y riesgo de deserción escolar en contextos rurales.
                </p>
              </div>
              
              <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20">
                <h3 className="text-lg font-bold text-green-400 mb-3">🎯 Objetivos</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Motivar a los estudiantes</li>
                  <li>• Promover hábitos saludables</li>
                  <li>• Usar análisis de datos</li>
                  <li>• Crear un modelo replicable</li>
                </ul>
              </div>
            </div>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-green-500/20 to-red-500/20 rounded-lg p-6 border border-red-500/20 mb-6 text-center">
              <div className="text-6xl mb-4">🥗⚽ vs 🍟📱</div>
              <p className="text-sm text-gray-400">Hábitos saludables vs sedentarismo</p>
            </div>
            
            <button
              onClick={() => setScreen("metodologia")}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Continuar: Metodología y Datos
            </button>
          </div>
        );

      case "metodologia":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-400">Metodología + Datos</h2>
            </div>
            
            <div className="bg-indigo-500/10 rounded-lg p-6 border border-indigo-500/20 mb-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    <strong>Investigación aplicada</strong> con datos de 49 estudiantes (peso, talla, IMC, alimentación, actividad física).
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    <strong>Análisis en Google Colab</strong> con estadísticas descriptivas e inferenciales.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    <strong>App gamificada</strong> desarrollada con Bolt.new.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg p-6 border border-indigo-500/20 mb-6 text-center">
              <div className="text-6xl mb-4">📊📱💻</div>
              <p className="text-sm text-gray-400">Google Colab + Aula Viva App</p>
            </div>
            
            <button
              onClick={() => setScreen("innovacion-aula")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Continuar: La Innovación Aula Viva
            </button>
          </div>
        );

      case "innovacion-aula":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-pink-400">La Innovación Aula Viva</h2>
            </div>
            
            <div className="bg-pink-500/10 rounded-lg p-6 border border-pink-500/20 mb-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    <strong>Gamificación educativa</strong> con niveles, AulaMonedas, logros y retroalimentación inmediata.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    <strong>Uso de React, Tailwind, Supabase</strong> y Bolt.new.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <p className="text-gray-300">
                    <strong>Proyecto escalable y replicable</strong> en otras instituciones.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-6 border border-pink-500/20 mb-6 text-center">
              <div className="text-6xl mb-4">💚🎮🌐</div>
              <p className="text-sm text-gray-400">Salud + Tecnología + Comunidad</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setScreen("ciencia")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Explorar Ciencia
              </button>
              <button
                onClick={() => setScreen("innovacion")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Ver Innovación
              </button>
              <button
                onClick={() => setScreen("tecnologia")}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Conocer Tecnología
              </button>
            </div>
          </div>
        );

      case "ciencia":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-400">Ciencia</h2>
            </div>
            
            <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20 mb-6">
              <p className="text-gray-300 leading-relaxed">
                La base científica de Aula Viva está en el monitoreo continuo y el análisis de datos.
                Se recolectaron medidas antropométricas (peso, talla, IMC) y datos de consumo alimentario.
                Con Google Colab se generaron estadísticas descriptivas y gráficos que orientan la toma 
                de decisiones en educación y salud.
              </p>
            </div>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-6 border border-green-500/20 mb-6 text-center">
              <div className="text-6xl mb-4">📊👥⚖️</div>
              <p className="text-sm text-gray-400">Gráficos estadísticos y mediciones antropométricas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">49</div>
                <div className="text-sm text-gray-400">Estudiantes</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">85%</div>
                <div className="text-sm text-gray-400">Mejora en hábitos</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">18</div>
                <div className="text-sm text-gray-400">Meses de estudio</div>
              </div>
            </div>
            
            <button
              onClick={() => setScreen("trivia")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Pasar a la Trivia
            </button>
          </div>
        );

      case "innovacion":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-purple-400">Innovación</h2>
            </div>
            
            <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20 mb-6">
              <p className="text-gray-300 leading-relaxed">
                Aula Viva es innovación porque integra tres elementos únicos en un mismo ecosistema:
                Salud (nutrición + actividad física), Gamificación (niveles, logros, AulaMonedas), 
                y Tecnología accesible (Bolt.new, Supabase, React, Colab).
                Esto no es una simple app: es un modelo educativo que transforma la escuela rural 
                en un espacio vivo, participativo y motivador.
              </p>
            </div>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/20 mb-6 text-center">
              <div className="text-6xl mb-4">💚🎮💻</div>
              <p className="text-sm text-gray-400">Salud – Gamificación – Tecnología</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Salud: nutrición + actividad física</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Gamificación: niveles, logros, AulaMonedas</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Tecnología accesible: Bolt.new, Supabase, React</span>
              </div>
            </div>
            
            <button
              onClick={() => setScreen("trivia")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Pasar a la Trivia
            </button>
          </div>
        );

      case "tecnologia":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-orange-400">Tecnología</h2>
            </div>
            
            <div className="bg-orange-500/10 rounded-lg p-6 border border-orange-500/20 mb-6">
              <p className="text-gray-300 leading-relaxed">
                La tecnología detrás de Aula Viva incluye: Frontend (React + Tailwind), 
                Backend (Supabase), Inteligencia Artificial (GPT para NutriBot), 
                Análisis de Datos (Google Colab + Python), y Despliegue (Bolt.new, Vercel o Netlify).
                Todo diseñado para ser escalable y replicable en instituciones educativas.
              </p>
            </div>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-6 border border-orange-500/20 mb-6 text-center">
              <div className="text-6xl mb-4">⚛️🗄️🤖</div>
              <p className="text-sm text-gray-400">Stack tecnológico moderno y escalable</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-bold text-orange-400 mb-2">Frontend</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• React + TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Lucide React Icons</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-bold text-orange-400 mb-2">Backend</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Supabase PostgreSQL</li>
                  <li>• Google Colab</li>
                  <li>• GPT para NutriBot</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setScreen("trivia")}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Pasar a la Trivia
            </button>
          </div>
        );

      case "trivia":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">Trivia del Foro</h2>
                <p className="text-gray-400">Pon a prueba tus conocimientos</p>
              </div>
            </div>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/20 mb-6 text-center">
              <div className="text-4xl mb-2">🎯🧠❓</div>
              <p className="text-sm text-gray-400">Trivia interactiva del foro</p>
            </div>
            
            <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/20 mb-6">
              <p className="text-lg font-semibold mb-4">Pregunta: ¿Cuál es uno de los pilares de Aula Viva?</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer(true)}
                  className="w-full text-left bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  A) Monitoreo en tiempo real y gamificación
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="w-full text-left bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  B) Solo clases magistrales tradicionales
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="w-full text-left bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  C) Uso exclusivo de libros impresos
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="bg-yellow-500/20 rounded-lg px-4 py-2 border border-yellow-500/30">
                <span className="font-bold text-yellow-400">Puntaje acumulado: {score}</span>
              </div>
              <button
                onClick={() => setScreen("conclusiones")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Finalizar
              </button>
            </div>
          </div>
        );

      case "conclusiones":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-green-400">Conclusiones y Sostenibilidad</h2>
            <p className="text-lg text-gray-300 mb-4">
              Gamificación = motivación y permanencia escolar. Plataforma escalable y replicable. 
              Alineada con ODS 3, 4 y 10.
            </p>
            
            {/* Imagen representativa */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-6 border border-green-500/20 mb-6">
              <div className="text-6xl mb-4">🏆📱🌟</div>
              <p className="text-sm text-gray-400">"De la ruralidad a la ciudad: forjando campeones"</p>
            </div>
            
            <p className="text-lg text-gray-300 mb-4">
              Has completado la experiencia del Foro y obtuviste un puntaje total de <span className="font-bold text-yellow-400">{score} puntos</span>.
            </p>
            <p className="text-xl mb-8">🏅 Medalla Aula Viva – Foro 2025</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <a
                href="https://tu-pdf-link"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Ver Guía PDF</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Cpu className="w-5 h-5" />
                <span>Ir a Bolt.new</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <button
              onClick={() => setScreen("guia-practica")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 mb-4"
            >
              Ver Guía Práctica para Docentes
            </button>
            
            <button
              onClick={() => setScreen("welcome")}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 mr-4"
            >
              Reiniciar Foro
            </button>
          </div>
        );

      case "guia-practica":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-400">Guía Práctica para Docentes</h2>
                <p className="text-gray-400">Prompts listos para crear apps educativas en Bolt.new</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Matemáticas */}
              <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">📐</span>
                  <div>
                    <h3 className="text-xl font-bold text-blue-400">Matemáticas</h3>
                    <p className="text-sm text-gray-400">Estándar MEN: Razonamiento y resolución de problemas</p>
                    <p className="text-sm text-blue-300">Ejemplo práctico: Fracciones en contexto</p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Prompt de ejemplo (listo para copiar):</p>
                  <code className="text-sm text-green-300 block whitespace-pre-wrap">
{`Crea una aplicación educativa gamificada para estudiantes de secundaria sobre fracciones. 
Los estudiantes resolverán ejercicios visuales con ejemplos de la vida real (pizzas, frutas, grupos en clase). 
Cada respuesta correcta da puntos, desbloquea niveles y otorga medallas virtuales. 
Debe haber retroalimentación inmediata y una barra de progreso. 
Diseño: colorido, moderno y amigable para los estudiantes. 
Alineado con los estándares MEN: usar el razonamiento matemático y la resolución de problemas en contextos cotidianos.`}
                  </code>
                </div>
              </div>

              {/* Español */}
              <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">📜</span>
                  <div>
                    <h3 className="text-xl font-bold text-green-400">Español</h3>
                    <p className="text-sm text-gray-400">Estándar MEN: Comprensión lectora y producción textual</p>
                    <p className="text-sm text-green-300">Ejemplo práctico: Construcción de una historia</p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Prompt de ejemplo (listo para copiar):</p>
                  <code className="text-sm text-green-300 block whitespace-pre-wrap">
{`Diseña una aplicación educativa gamificada para fortalecer las competencias en lengua castellana. 
Los estudiantes leerán textos cortos (fábulas o leyendas colombianas) y responderán preguntas de comprensión. 
Cada respuesta correcta les da AulaMonedas para desbloquear fragmentos de una historia y construir su propia versión. 
Niveles: básico (comprensión literal), intermedio (inferencial), avanzado (interpretación crítica). 
Incluye retroalimentación motivadora como "¡Excelente interpretación!" o "Vuelve a intentarlo". 
Alineado con los estándares MEN: comprensión de lectura, escritura y comunicación en distintos contextos.`}
                  </code>
                </div>
              </div>

              {/* Biología */}
              <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">🔬</span>
                  <div>
                    <h3 className="text-xl font-bold text-red-400">Biología</h3>
                    <p className="text-sm text-gray-400">Estándar MEN: Indagación científica y conocimiento de los seres vivos</p>
                    <p className="text-sm text-red-300">Ejemplo práctico: La célula como ciudad</p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Prompt de ejemplo (listo para copiar):</p>
                  <code className="text-sm text-green-300 block whitespace-pre-wrap">
{`Construye una aplicación gamificada donde los estudiantes exploren la célula como si fuera una ciudad. 
Cada orgánulo es un lugar (núcleo = alcaldía, mitocondria = planta de energía). 
Los estudiantes completan misiones para identificar funciones de cada orgánulo. 
Las respuestas correctas dan puntos y medallas de "Joven Científico". 
Incluye íconos visuales (fábricas, edificios, plantas). 
Niveles: célula procariota, célula eucariota y sistemas del cuerpo humano. 
Alineado con los estándares MEN: indagación, explicación científica y comprensión de los seres vivos.`}
                  </code>
                </div>
              </div>

              {/* Uso General */}
              <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">🧩</span>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">Uso general en distintas áreas</h3>
                    <p className="text-sm text-gray-400">Idea: adaptable para cualquier docente</p>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Prompt de ejemplo (listo para copiar):</p>
                  <code className="text-sm text-green-300 block whitespace-pre-wrap">
{`Genera una aplicación gamificada donde los estudiantes avancen por niveles completando retos de una materia. 
Cada nivel presenta un concepto (ejemplo: reglas gramaticales, ecuaciones matemáticas o fenómenos científicos). 
Las respuestas correctas otorgan AulaMonedas y desbloquean minijuegos o misiones. 
Incluye tablas de clasificación, avatares y medallas para aumentar la motivación. 
Alineado con los estándares MEN: pensamiento crítico, resolución de problemas y aprendizaje autónomo.`}
                  </code>
                </div>
              </div>
            </div>

            {/* Mensaje de cierre */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/20 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-purple-400 mb-4">Mensaje de cierre en la guía</h3>
                <p className="text-gray-300 mb-4">
                  Esta guía está pensada para que los docentes experimenten directamente en sus clases.
                  Al copiar un prompt en Bolt.new, en menos de 5 minutos podrán crear un prototipo de app gamificada alineada con los estándares MEN.
                </p>
                <p className="text-lg font-semibold text-purple-300">
                  La gamificación no es solo diversión: es una estrategia para construir aprendizajes significativos, motivadores y memorables.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setScreen("conclusiones")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Volver a Conclusiones
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Foro Departamental</h1>
            <p className="text-blue-300">Experiencia educativa interactiva</p>
          </div>
        </div>

        {/* Content */}
        <ForoScreens />
      </div>
    </div>
  );
};

export default ForoDepartamental;