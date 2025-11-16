import React, { useState } from 'react';
import { Trophy, Send, CheckCircle, Sparkles } from 'lucide-react';
import { ConcursoService } from '../services/concursoService';
import { INSTITUCIONES_QUINDIO, CATEGORIAS_CONCURSO } from '../services/mockEmprendeData';
import { UserData } from '../types/User';

interface QuickProjectSubmitProps {
  userData: UserData;
  onBack: () => void;
}

const QuickProjectSubmit: React.FC<QuickProjectSubmitProps> = ({ userData, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    nombreProyecto: '',
    categoria: '',
    descripcionCorta: '',
    impactoEsperado: '',
    nombreLider: userData.name || '',
    institucion: userData.grado || INSTITUCIONES_QUINDIO[0],
    email: '',
    telefono: '',
    videoUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombreProyecto || !formData.categoria || !formData.descripcionCorta) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const equipoData = {
        lider: { nombre: formData.nombreLider, grado: '11' },
        miembros: [],
        docente: { nombre: 'Docente Asesor', area: 'Emprendimiento' },
        rector: { nombre: 'Rector IE' },
        contacto: { telefono: formData.telefono, email: formData.email }
      };

      await ConcursoService.createPostulacion({
        id_usuario: userData.id,
        equipo: equipoData,
        descripcion_proyecto: `${formData.nombreProyecto}\n\n${formData.descripcionCorta}\n\nImpacto: ${formData.impactoEsperado}`,
        video_url: formData.videoUrl || undefined,
        institucion: formData.institucion,
        categoria_concurso: formData.categoria,
        estado: 'enviado'
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Error al enviar el proyecto. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-900/40 to-yellow-900/40 backdrop-blur-sm rounded-2xl p-12 border border-green-500/30 text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-green-400">¡Proyecto Registrado!</h2>
          <p className="text-xl text-gray-300 mb-8">
            Tu proyecto <strong className="text-yellow-400">{formData.nombreProyecto}</strong> ha sido registrado exitosamente para el Festival EmprendeQuindío 2025.
          </p>
          <div className="bg-black/30 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-400 mb-2">Detalles de tu proyecto:</p>
            <div className="space-y-2 text-left">
              <p className="text-white"><strong>Categoría:</strong> {formData.categoria}</p>
              <p className="text-white"><strong>Institución:</strong> {formData.institucion}</p>
              <p className="text-white"><strong>Líder:</strong> {formData.nombreLider}</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
          >
            Volver al Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Trophy className="w-10 h-10 text-yellow-400 mr-3" />
            <div>
              <h2 className="text-3xl font-bold text-yellow-400">Registra tu Proyecto</h2>
              <p className="text-gray-400">Festival EmprendeQuindío 2025</p>
            </div>
          </div>
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>

        <div className="bg-gradient-to-r from-green-900/30 to-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-200">
            💡 <strong>Tip para ganar:</strong> Sé claro, conciso y enfócate en el impacto social de tu proyecto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                value={formData.nombreProyecto}
                onChange={e => setFormData(prev => ({ ...prev, nombreProyecto: e.target.value }))}
                placeholder="Ej: EcoTech Quindío"
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoría *</label>
              <select
                value={formData.categoria}
                onChange={e => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Seleccionar</option>
                {CATEGORIAS_CONCURSO.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Institución *</label>
              <select
                value={formData.institucion}
                onChange={e => setFormData(prev => ({ ...prev, institucion: e.target.value }))}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {INSTITUCIONES_QUINDIO.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción del Proyecto * (Máx 500 caracteres)
            </label>
            <textarea
              value={formData.descripcionCorta}
              onChange={e => setFormData(prev => ({ ...prev, descripcionCorta: e.target.value }))}
              placeholder="¿Qué problema resuelve tu proyecto? ¿Cómo funciona tu solución?"
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1">{formData.descripcionCorta.length}/500 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Impacto Social Esperado *
            </label>
            <textarea
              value={formData.impactoEsperado}
              onChange={e => setFormData(prev => ({ ...prev, impactoEsperado: e.target.value }))}
              placeholder="¿A cuántas personas beneficia? ¿Qué cambio positivo genera en la comunidad?"
              maxLength={300}
              rows={3}
              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1">{formData.impactoEsperado.length}/300 caracteres</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Líder del Proyecto</label>
              <input
                type="text"
                value={formData.nombreLider}
                onChange={e => setFormData(prev => ({ ...prev, nombreLider: e.target.value }))}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email de Contacto</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={e => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="3001234567"
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Video del Proyecto (Opcional)</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={e => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold text-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Registrar Proyecto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickProjectSubmit;
