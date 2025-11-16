import React, { useState } from 'react';
import { ArrowLeft, User, GraduationCap, Award, BookOpen, Target, Users, TrendingUp, Mail, Youtube, Linkedin, Briefcase, ExternalLink, BarChart3 } from 'lucide-react';
import SurveyAnalytics from './SurveyAnalytics';

interface ResearcherSectionProps {
  onBack: () => void;
}

const ResearcherSection: React.FC<ResearcherSectionProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('about');

  const researchData = {
    publications: [
      {
        title: 'Sentido Del Deporte Formativo en los Estudiantes de la Universidad del Quindío',
        year: '2014',
        type: 'Investigación'
      },
      {
        title: 'Análisis Predictivo de la Deserción Universitaria',
        year: '2018',
        type: 'Investigación'
      },
      {
        title: 'Análisis Comparado de los Resultados Deportivos entre Colombia y España en los últimos 10 Juegos Olímpicos',
        year: '2022',
        type: 'Investigación Comparativa'
      },
      {
        title: 'Reglamentación, Uso y Tarifas de los Escenarios Deportivos de Armenia',
        year: '2023',
        type: 'Estudio Técnico'
      },
      {
        title: 'Análisis de Satisfacción de los usuarios del IMDERA de La Ciudad de Armenia',
        year: '2023',
        type: 'Investigación'
      },
      {
        title: 'Guía de Jefes de Misión Juegos Nacionales y Para Nacionales',
        year: '2023',
        type: 'Guía Técnica'
      },
      {
        title: 'Análisis de la satisfacción de los usuarios en los juegos deportivos nacionales y para deportivos',
        year: '2023',
        type: 'Investigación'
      },
      {
        title: 'AI Stars League: Un Modelo de Colaboración para el Futuro de la Educación',
        year: '2025',
        type: 'Artículo LinkedIn Pulse',
        link: 'https://www.linkedin.com/pulse/ai-stars-league-un-modelo-de-colaboraci%C3%B3n-para-el-futuro-tabima-2xmhf'
      },
      {
        title: 'Algoritmos, Inteligencia Artificial y el Futuro de las Redes Sociales: Un Análisis Epistemológico',
        year: '2025',
        type: 'Artículo LinkedIn Pulse',
        link: 'https://www.linkedin.com/pulse/algoritmos-inteligencia-artificial-y-el-futuro-de-las-antony-tabima-ank2e'
      },
      {
        title: 'La Colaboración entre Inteligencia Artificial y Creatividad Humana en la Producción de Videos: Un Análisis Académico',
        year: '2025',
        type: 'Artículo LinkedIn Pulse',
        link: 'https://www.linkedin.com/pulse/la-colaboraci%C3%B3n-entre-inteligencia-artificial-y-humana-antony-tabima-2odme'
      },
      {
        title: 'Oportunidades para la Generación Millennial en la Era de la Inteligencia Artificial',
        year: '2025',
        type: 'Artículo LinkedIn Pulse',
        link: 'https://www.linkedin.com/pulse/oportunidades-para-la-generaci%C3%B3n-millennial-en-era-de-antony-tabima-xz13e'
      },
      {
        title: 'Análisis Comparativo de la Inversión, los Logros Deportivos y la Eficiencia Financiera en España y Colombia en los Juegos Olímpicos (2000-2020)',
        year: '2024',
        type: 'Artículo LinkedIn Pulse',
        link: 'https://www.linkedin.com/pulse/an%C3%A1lisis-comparativo-de-la-inversi%C3%B3n-los-logros-y-en-espa%C3%B1a-tabima-9coff'
      },
      {
        title: 'Transformación y Desafíos en la Educación Superior',
        year: '2024',
        type: 'Artículo LinkedIn Pulse',
        link: 'https://www.linkedin.com/pulse/transformaci%C3%B3n-y-desaf%C3%ADos-en-la-educaci%C3%B3n-superior-antony-tabima-tbvle'
      },
      {
        title: 'París 2024',
        year: '2024',
        type: 'Artículo LinkedIn Pulse',
        link: 'https://www.linkedin.com/pulse/par%C3%ADs-2024-antony-tabima-lgx8f'
      }
    ],
    achievements: [
      'Investigador Principal - Proyecto Aula Viva',
      'Magíster Investigador en Actividad Física y Deporte (Universidad de Granada, España)',
      'Miembro del Comité de Seguimiento - Observatorio Departamental de Educación',
      'Coordinador Académico Juegos Deportivos Nacionales 2023',
      'Consejero Universitario - Universidad del Quindío (10 años)',
      'Especialista en Innovación Tecnológica y Gestión de Equipos'
    ],
    experience: [
      {
        position: 'Miembro del Comité de Seguimiento y Evaluación del Observatorio Departamental de Educación',
        organization: 'Secretaría de Educación Departamental',
        duration: 'feb. 2025 - actualidad · 8 meses',
        location: 'Armenia, Quindío, Colombia · Presencial',
        type: 'Jornada parcial',
        description: 'Representante de los Docentes de las Instituciones Educativas Públicas y Privadas'
      },
      {
        position: 'Docente',
        organization: 'Secretaria de Educacion Departamental - Quindío',
        duration: 'abr. 2024 - actualidad · 1 año 6 meses',
        location: 'Quindío, Colombia',
        type: 'Jornada completa'
      },
      {
        position: 'Coordinador Académico Juegos Deportivos Nacionales y Paranacionales 2023',
        organization: 'Ministerio del Deporte Colombia y Comité Olímpico Colombiano',
        duration: 'jul. 2023 - dic. 2023 · 6 meses',
        location: 'Colombia',
        type: 'Contrato por obra o servicio'
      },
      {
        position: 'Consejero de centro universitario',
        organization: 'Universidad del Quindío',
        duration: 'nov. 2012 - ago. 2023 · 10 años 10 meses',
        location: 'Armenia, Quindío, Colombia',
        type: 'Autónomo',
        description: 'Funciones principales: Avalar el Proyecto Educativo de la Facultad, evaluar y controlar la ejecución del Proyecto Educativo, aprobar los Proyectos Educativos de los programas adscritos, aprobar el plan de acción de la Facultad, recomendar la creación de unidades académicas, revisar y evaluar los planes curriculares, aprobar el plan de labor académica de los profesores, entre otras funciones académicas y administrativas.'
      },
      {
        position: 'Docente catedrático',
        organization: 'Universidad del Quindío',
        duration: 'feb. 2015 - jun. 2021 · Múltiples períodos',
        location: 'Armenia, Quindío, Colombia',
        type: 'Contrato por obra o servicio',
        description: 'Orientar los procesos académicos de docencia directa en: Biomecánica, Actividad Física Para La Salud, Deporte formativo, Didáctica del baloncesto, Teoría de la educación física, Didáctica del microfútbol'
      },
      {
        position: 'Especialista empresarial',
        organization: 'Universidad del Quindío - Vicerrectoría de Extensión y Proyección Social',
        duration: 'feb. 2020 - dic. 2020 · 10 meses',
        location: 'Armenia, Quindío, Colombia',
        type: 'Contrato por obra o servicio',
        description: 'Prestar servicios profesionales en la Unidad de Emprendimiento, Desarrollo Empresarial y Negocios - UEDEN, para apoyar el sistema de emprendimiento mediante la articulación, apoyo, divulgación, acompañamiento y definición de las estrategias del proceso de extensión.'
      },
      {
        position: 'Formador de capacidades',
        organization: 'Alcaldía Municipal de Quimbaya',
        duration: 'mar. 2018 - dic. 2019 · Múltiples períodos',
        location: 'Quimbaya, Quindío, Colombia',
        type: 'Contrato por obra o servicio',
        description: 'Prestación de servicios de apoyo a la gestión en cualificación y capacitación de los monitores de las escuelas de formación deportiva del municipio de Quimbaya.'
      },
      {
        position: 'Profesional Universitario/Administrativo',
        organization: 'Universidad del Quindío - Bienestar Institucional',
        duration: 'feb. 2015 - jun. 2018 · Múltiples períodos',
        location: 'Armenia, Quindío, Colombia',
        type: 'Jornada completa',
        description: 'Elaboración, implementación, seguimiento y medición del impacto de proyectos deportivos. Apoyo en la planeación y ejecución de programas deportivos. Control y seguimiento a convenios y contratos. Planear y gestionar escenarios deportivos.'
      }
    ],
    oldAchievements: [
      'Investigador Principal - Proyecto Aula Viva',
      'Docente IE Ramón Messa Londoño',
      'Mentor en Innovación Educativa'
    ],
    projectStats: {
      students: 156,
      schools: 3,
      months: 18,
      improvements: '85%'
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Sección del Investigador</h1>
            <p className="text-purple-300">Conoce al líder detrás de Aula Viva</p>
          </div>
        </div>

        {/* Researcher Profile */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-500/20">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl font-bold mb-2">Antony Tabima Murillo</h2>
              <p className="text-purple-300 text-xl mb-2">Investigador Principal - Proyecto Aula Viva</p>
              <p className="text-blue-300 text-lg mb-4">Magíster Investigador en Actividad Física y Deporte (Universidad de Granada, España)</p>
              <p className="text-gray-300 mb-4">
                Cuento con más de 10 años de experiencia en el sector de la educación superior en procesos de docencia, 
                investigación, extensión, innovación y medio ambiente. He contribuido a la formulación de políticas educativas, 
                proyectos investigativos y asesoría en emprendimiento. Mi objetivo es seguir aportando al fortalecimiento 
                y transformación del sector educativo, empresarial y del tercer sector.
              </p>
              
              {/* Contact Information */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-3 text-purple-300">Contacto:</h4>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:antonytabimam@ieramonmessa.edu.co"
                    className="flex items-center space-x-2 bg-red-500/20 text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">antonytabimam@ieramonmessa.edu.co</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@antonytabimam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-red-500/20 text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                    <span className="text-sm">YouTube</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/antonytabimam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  Ciencia & Tecnología
                </span>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                  Deporte & Educación Superior
                </span>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                  Innovación Tecnológica
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/30 backdrop-blur-sm rounded-lg p-1 border border-purple-500/20 overflow-x-auto">
          {[
            { id: 'about', label: 'Sobre la Investigación', icon: BookOpen },
            { id: 'experience', label: 'Experiencia Profesional', icon: Briefcase },
            { id: 'publications', label: 'Publicaciones', icon: GraduationCap },
            { id: 'results', label: 'Resultados', icon: TrendingUp },
            { id: 'impact', label: 'Impacto', icon: Users },
            { id: 'survey', label: 'Análisis de Encuestas', icon: BarChart3 }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
          {activeTab === 'about' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Sobre la Investigación Aula Viva</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">Objetivo Principal</h4>
                  <p className="text-gray-300">
                    Desarrollar y evaluar una aplicación gamificada que promueva hábitos saludables 
                    de actividad física y nutrición en adolescentes de instituciones educativas rurales, 
                    utilizando tecnología accesible y metodologías pedagógicas innovadoras.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">Metodología</h4>
                  <p className="text-gray-300">
                    Investigación mixta con enfoque cuasi-experimental, utilizando mediciones 
                    antropométricas, evaluaciones de condición física y análisis de comportamiento 
                    alimentario antes y después de la intervención con la aplicación Aula Viva.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">Población</h4>
                  <p className="text-gray-300">
                    Estudiantes de 6° a 11° grado de la IE Ramón Messa Londoño en Quimbaya, 
                    con edades entre 11 y 17 años, representando la diversidad socioeconómica 
                    y cultural del Eje Cafetero colombiano.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">Formación del Investigador</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <strong>Master Universitario en Investigación</strong> - Universidad de Granada (2021-2022)
                    </p>
                    <p className="text-gray-300">
                      <strong>Maestría en Actividad Física y Gestión Deportiva</strong> - Universidad Europea del Atlántico
                    </p>
                    <p className="text-gray-300">
                      <strong>Experiencia:</strong> Más de 10 años en educación superior, docencia, investigación e innovación
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Experiencia Profesional</h3>
              <div className="space-y-6">
                {researchData.experience.map((exp, index) => (
                  <div key={index} className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-purple-300 mb-2">{exp.position}</h4>
                        <p className="text-white font-semibold mb-1">{exp.organization}</p>
                        <p className="text-gray-300 text-sm mb-1">{exp.duration}</p>
                        <p className="text-gray-400 text-sm mb-1">{exp.location}</p>
                        <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                          {exp.type}
                        </span>
                      </div>
                    </div>
                    {exp.description && (
                      <div className="mt-3 pt-3 border-t border-purple-500/20">
                        <p className="text-sm text-gray-300">{exp.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'publications' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Publicaciones y Contribuciones</h3>
              <div className="space-y-4">
                {researchData.publications.map((pub, index) => (
                  <div key={index} className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {pub.link ? (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-bold text-purple-300 hover:text-purple-200 transition-colors flex items-center space-x-2"
                          >
                            <span>{pub.title}</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <h4 className="text-lg font-bold text-purple-300">{pub.title}</h4>
                        )}
                      </div>
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        {pub.year}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{pub.type}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-purple-300">Logros Académicos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {researchData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Resultados de la Investigación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/20 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-blue-400">{researchData.projectStats.students}</p>
                  <p className="text-sm text-gray-400">Estudiantes Participantes</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-6 border border-green-500/20 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-green-400">{researchData.projectStats.schools}</p>
                  <p className="text-sm text-gray-400">Instituciones</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-purple-400">{researchData.projectStats.months}</p>
                  <p className="text-sm text-gray-400">Meses de Estudio</p>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/20 text-center">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-yellow-400">{researchData.projectStats.improvements}</p>
                  <p className="text-sm text-gray-400">Mejora en Hábitos</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">Hallazgos Principales</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2"></span>
                      <span>Incremento del 85% en la adherencia a rutinas de actividad física</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2"></span>
                      <span>Mejora del 72% en conocimientos nutricionales básicos</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2"></span>
                      <span>Reducción del 45% en comportamientos sedentarios</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2"></span>
                      <span>Aumento del 90% en la motivación hacia hábitos saludables</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Impacto y Proyecciones</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">Impacto Inmediato</h4>
                  <p className="text-gray-300 mb-4">
                    La implementación de Aula Viva ha transformado la percepción de los estudiantes
                    sobre la actividad física y la nutrición, convirtiendo el aprendizaje en una
                    experiencia lúdica y significativa.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">Escalabilidad</h4>
                  <p className="text-gray-300 mb-4">
                    El modelo desarrollado es replicable en otras instituciones educativas rurales
                    de Colombia, adaptándose a diferentes contextos socioeconómicos y culturales.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-300">Futuras Líneas de Investigación</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                      <span>Integración de inteligencia artificial para personalización</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                      <span>Expansión a educación primaria y universitaria</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                      <span>Desarrollo de módulos para necesidades especiales</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                      <span>Colaboración internacional con instituciones similares</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'survey' && (
            <div>
              <SurveyAnalytics />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearcherSection;