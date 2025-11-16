import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Star, User, Award } from 'lucide-react';

interface VideoLibraryProps {
  onBack: () => void;
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({ onBack }) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<number[]>([]);

  const videos = [
    {
      id: 1,
      title: 'EJERCICIO para Niños de 11 a 14 Años en CASA',
      description: 'Rutina completa para entrenar el cuerpo, estar en forma y saludables con Pino Profesor',
      youtubeId: 'DUiFUh_0T3k',
      duration: '12:45',
      points: 250,
      category: 'Actividad Física',
      level: 'Básico',
      thumbnail: 'https://img.youtube.com/vi/DUiFUh_0T3k/maxresdefault.jpg',
      topics: ['Ejercicio en casa', 'Rutinas para adolescentes', 'Entrenamiento sin equipo', 'Motivación deportiva'],
      instructor: 'Pino Profesor (Fabián Andrés Pino)',
      instructorBio: 'Docente, motivador y entrenador. Maestría en Educación y Desarrollo Humano, Especialista en Lúdica Educativa y Licenciado en Educación Física y Deportes.'
    },
    {
      id: 2,
      title: 'Rutina rápida de Brazos + Cardio [Casa sin equipo]',
      description: 'Entrenamiento intensivo de brazos combinado con cardio, sin necesidad de equipos',
      youtubeId: 'p1K-2tV7MYc',
      duration: '30:32',
      points: 300,
      category: 'Actividad Física',
      level: 'Intermedio',
      thumbnail: 'https://img.youtube.com/vi/p1K-2tV7MYc/maxresdefault.jpg',
      topics: ['Entrenamiento de brazos', 'Cardio intensivo', 'Ejercicio sin equipo', 'Rutina en casa'],
      instructor: 'Pino Profesor (Fabián Andrés Pino)',
      instructorBio: 'Docente, motivador y entrenador. Maestría en Educación y Desarrollo Humano, Especialista en Lúdica Educativa y Licenciado en Educación Física y Deportes.'
    },
    {
      id: 3,
      title: 'Rutina rápida de Pecho + Cardio en casa sin equipo',
      description: 'Fortalecimiento del pecho combinado con ejercicios cardiovasculares',
      youtubeId: 'TIQ4U77YyGU',
      duration: '25:09',
      points: 280,
      category: 'Actividad Física',
      level: 'Intermedio',
      thumbnail: 'https://img.youtube.com/vi/TIQ4U77YyGU/maxresdefault.jpg',
      topics: ['Entrenamiento de pecho', 'Cardio en casa', 'Ejercicios funcionales', 'Rutina completa'],
      instructor: 'Pino Profesor (Fabián Andrés Pino)',
      instructorBio: 'Docente, motivador y entrenador. Maestría en Educación y Desarrollo Humano, Especialista en Lúdica Educativa y Licenciado en Educación Física y Deportes.'
    },
    {
      id: 4,
      title: 'Estiramiento Cuerpo Completo [Para Después del Ejercicio]',
      description: 'Rutina de estiramientos completa para la recuperación post-ejercicio',
      youtubeId: 'Os7i6qMNWQ8',
      duration: '16:53',
      points: 180,
      category: 'Actividad Física',
      level: 'Básico',
      thumbnail: 'https://img.youtube.com/vi/Os7i6qMNWQ8/maxresdefault.jpg',
      topics: ['Estiramientos', 'Recuperación muscular', 'Flexibilidad', 'Relajación'],
      instructor: 'Pino Profesor (Fabián Andrés Pino)',
      instructorBio: 'Docente, motivador y entrenador. Maestría en Educación y Desarrollo Humano, Especialista en Lúdica Educativa y Licenciado en Educación Física y Deportes.'
    },
    {
      id: 5,
      title: 'Fundamentos de Nutrición Deportiva',
      description: 'Aprende los conceptos básicos de alimentación para el rendimiento físico',
      youtubeId: 'Qif8LZQb_gI',
      duration: '15:30',
      points: 200,
      category: 'Nutrición',
      level: 'Básico',
      thumbnail: 'https://img.youtube.com/vi/Qif8LZQb_gI/maxresdefault.jpg',
      topics: ['Macronutrientes', 'Hidratación', 'Timing nutricional', 'Suplementación básica']
    },
    {
      id: 6,
      title: 'Ejercicio y Salud en Adolescentes',
      description: 'La importancia de la actividad física durante la adolescencia',
      youtubeId: '7XneU7e2U0c',
      duration: '12:45',
      points: 180,
      category: 'Actividad Física',
      level: 'Básico',
      thumbnail: 'https://img.youtube.com/vi/7XneU7e2U0c/maxresdefault.jpg',
      topics: ['Desarrollo físico', 'Beneficios del ejercicio', 'Prevención de lesiones', 'Motivación']
    },
    {
      id: 7,
      title: 'Alimentación Saludable para Jóvenes',
      description: 'Guía práctica de alimentación balanceada para adolescentes',
      youtubeId: '_3C5Z1QgJZU',
      duration: '18:22',
      points: 220,
      category: 'Nutrición',
      level: 'Intermedio',
      thumbnail: 'https://img.youtube.com/vi/_3C5Z1QgJZU/maxresdefault.jpg',
      topics: ['Alimentación balanceada', 'Grupos alimentarios', 'Planificación de comidas', 'Hábitos saludables']
    },
    {
      id: 8,
      title: 'Hábitos de Vida Saludable',
      description: 'Construye rutinas saludables que perduren toda la vida',
      youtubeId: 'pJLD_vqActE',
      duration: '20:45',
      points: 250,
      category: 'Estilo de Vida',
      level: 'Avanzado',
      thumbnail: 'https://img.youtube.com/vi/pJLD_vqActE/maxresdefault.jpg',
      topics: ['Rutinas saludables', 'Disciplina', 'Motivación a largo plazo', 'Cambio de hábitos']
    }
  ];

  const handleWatchVideo = (videoId: number) => {
    if (!watchedVideos.includes(videoId)) {
      setWatchedVideos([...watchedVideos, videoId]);
      // Aquí se actualizarían los puntos del usuario
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Nutrición':
        return 'from-green-500 to-emerald-500';
      case 'Actividad Física':
        return 'from-blue-500 to-cyan-500';
      case 'Estilo de Vida':
        return 'from-purple-500 to-pink-500';
      case 'Psicología':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const selectedVideoData = videos.find(v => v.id === selectedVideo);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Biblioteca de Videos</h1>
            <p className="text-red-300">Contenido educativo audiovisual</p>
          </div>
        </div>

        {!selectedVideo ? (
          <>
            {/* Progress Overview */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-red-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Tu Progreso en Videos</h3>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-400">{watchedVideos.length}/{videos.length}</p>
                  <p className="text-sm text-gray-400">Videos completados</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(watchedVideos.length / videos.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">
                {Math.round((watchedVideos.length / videos.length) * 100)}% completado
              </p>
            </div>

            {/* Categories Filter */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-red-500/20">
              <h3 className="text-lg font-bold mb-4">Categorías Disponibles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Nutrición', 'Actividad Física', 'Estilo de Vida', 'Psicología'].map((category) => {
                  const categoryVideos = videos.filter(v => v.category === category);
                  const watchedInCategory = categoryVideos.filter(v => watchedVideos.includes(v.id)).length;
                  
                  return (
                    <div key={category} className={`p-4 rounded-lg border bg-gradient-to-br ${getCategoryColor(category)}/10 border-opacity-20`}>
                      <h4 className="font-bold text-sm mb-2">{category}</h4>
                      <p className="text-xs text-gray-400">{watchedInCategory}/{categoryVideos.length} completados</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className={`bg-gradient-to-r ${getCategoryColor(category)} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${categoryVideos.length > 0 ? (watchedInCategory / categoryVideos.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video.id)}
                  className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-red-500/20 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    {watchedVideos.includes(video.id) && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Visto
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-gradient-to-r ${getCategoryColor(video.category)}`}>
                      {video.category}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{video.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-blue-400">
                          <Clock className="w-4 h-4" />
                          <span>{video.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-yellow-400">
                          <Star className="w-4 h-4" />
                          <span>{video.points} pts</span>
                        </div>
                      </div>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                        {video.level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Video Detail View */
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setSelectedVideo(null)}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la biblioteca</span>
            </button>

            {selectedVideoData && (
              <>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-red-500/20">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-gradient-to-r ${getCategoryColor(selectedVideoData.category)}`}>
                        {selectedVideoData.category}
                      </div>
                      <h2 className="text-3xl font-bold mb-4">{selectedVideoData.title}</h2>
                      <p className="text-gray-300 text-lg mb-6">{selectedVideoData.description}</p>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-blue-400">
                          <Clock className="w-5 h-5" />
                          <span>{selectedVideoData.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-yellow-400">
                          <Star className="w-5 h-5" />
                          <span>{selectedVideoData.points} puntos</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleWatchVideo(selectedVideoData.id)}
                      disabled={watchedVideos.includes(selectedVideoData.id)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        watchedVideos.includes(selectedVideoData.id)
                          ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white hover:scale-105'
                      }`}
                    >
                      {watchedVideos.includes(selectedVideoData.id) ? '¡Completado!' : 'Marcar como Visto'}
                    </button>
                  </div>

                  {/* Topics */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-3">Temas que aprenderás:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedVideoData.topics.map((topic, index) => (
                        <div key={index} className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                          <span className="text-sm font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Instructor Info */}
                  {selectedVideoData.instructor && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-purple-300">Instructor:</h4>
                      <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                        <h5 className="font-bold text-purple-300 mb-2">{selectedVideoData.instructor}</h5>
                        <p className="text-sm text-gray-300">{selectedVideoData.instructorBio}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Embedded Video */}
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                  <h3 className="text-xl font-bold mb-4">Video Educativo</h3>
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedVideoData.youtubeId}`}
                      title={selectedVideoData.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLibrary;