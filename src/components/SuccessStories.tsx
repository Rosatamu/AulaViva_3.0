import React from 'react';
import { Quote, Star, Award, Heart, TrendingUp } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  institution: string;
  photo: string;
  quote: string;
  project: string;
  impact: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'María José Gómez',
    role: 'Estudiante Grado 11',
    institution: 'IE Ciudadela del Sur',
    photo: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    quote: 'EmprendeQuindío cambió mi vida. Lo que empezó como un proyecto escolar ahora es mi primer negocio real.',
    project: 'Eco-Kit Sustentable',
    impact: '50 familias beneficiadas',
    rating: 5
  },
  {
    name: 'Carlos Andrés Ruiz',
    role: 'Docente de Emprendimiento',
    institution: 'Colegio Liceo Nacional',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    quote: 'Esta plataforma permitió que mis estudiantes pasaran de la teoría a la acción. Ver sus ideas convertirse en realidad es invaluable.',
    project: 'Tutorías STEAM',
    impact: '120 estudiantes apoyados',
    rating: 5
  },
  {
    name: 'Laura Martínez',
    role: 'Estudiante Grado 10',
    institution: 'IE Casd Simón Bolívar',
    photo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    quote: 'Nunca imaginé que mi pasión por las artesanías podría generar ingresos. Ahora ayudo económicamente a mi familia.',
    project: 'Artesanías Café Quindío',
    impact: '$850,000 COP generados',
    rating: 5
  }
];

const successMetrics = [
  {
    icon: <Award className="w-8 h-8 text-yellow-400" />,
    value: '94%',
    label: 'Tasa de éxito',
    description: 'De los proyectos continúan activos'
  },
  {
    icon: <Heart className="w-8 h-8 text-pink-400" />,
    value: '4.8/5',
    label: 'Satisfacción',
    description: 'Calificación promedio de usuarios'
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-green-400" />,
    value: '+280%',
    label: 'Crecimiento',
    description: 'En ventas durante 2024'
  },
  {
    icon: <Star className="w-8 h-8 text-blue-400" />,
    value: '1,247',
    label: 'Beneficiarios',
    description: 'Personas impactadas directamente'
  }
];

const SuccessStories: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Quote className="w-12 h-12 text-yellow-400 mr-3" />
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">
            Historias de Éxito
          </h2>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Conoce cómo EmprendeQuindío está transformando vidas y comunidades en todo el departamento
        </p>
      </div>

      {/* Success Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {successMetrics.map((metric, index) => (
          <div key={index} className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              {metric.icon}
            </div>
            <p className="text-3xl font-bold text-white mb-2">{metric.value}</p>
            <p className="text-sm font-semibold text-gray-300 mb-1">{metric.label}</p>
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all transform hover:scale-105"
          >
            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-yellow-400/30 mb-4" />

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>

            {/* Project Info */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-400 mb-1">Proyecto</p>
              <p className="text-sm font-semibold text-green-400">{testimonial.project}</p>
              <p className="text-xs text-gray-400 mt-2">{testimonial.impact}</p>
            </div>

            {/* Author */}
            <div className="flex items-center pt-4 border-t border-white/10">
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/30"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg';
                }}
              />
              <div className="ml-3">
                <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-400">{testimonial.role}</p>
                <p className="text-xs text-gray-500">{testimonial.institution}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Testimonial Section */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Video: Casos de Éxito 2024
            </h3>
            <p className="text-gray-300 mb-6">
              Descubre cómo estudiantes del Quindío están construyendo un futuro mejor a través del emprendimiento.
              Proyectos que comenzaron en el aula ahora impactan miles de vidas.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                'De la idea al negocio en 90 días',
                'Más de $15M COP en ventas generadas',
                'Alianzas con empresas locales',
                'Reconocimiento nacional e internacional'
              ].map((item, i) => (
                <li key={i} className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  {item}
                </li>
              ))}
            </ul>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all transform hover:scale-105">
              Ver Más Historias →
            </button>
          </div>

          <div className="relative">
            <div className="aspect-video bg-black/60 rounded-xl border border-white/20 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Video placeholder"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-yellow-500/90 hover:bg-yellow-400 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                </button>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              ⭐ Destacado
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-green-900/40 to-yellow-900/40 backdrop-blur-sm rounded-xl p-8 border border-green-500/30 text-center">
        <h3 className="text-3xl font-bold mb-4">¿Quieres ser el Próximo Caso de Éxito?</h3>
        <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
          Únete a cientos de emprendedores escolares que ya están transformando el Quindío
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105">
            Publicar Mi Proyecto
          </button>
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-bold text-lg transition-all">
            Conocer Más
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
