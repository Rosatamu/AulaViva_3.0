import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { MarketService } from '../services/marketService';
import { CATEGORIAS_MARKETPLACE, INSTITUCIONES_QUINDIO } from '../services/mockEmprendeData';
import { UserData } from '../types/User';

interface CreateListingFormProps {
  userData: UserData;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateListingForm: React.FC<CreateListingFormProps> = ({ userData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    institucion: userData.institucion || '',
    impacto_social: '',
    imagen_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.titulo || !formData.descripcion || !formData.precio || !formData.categoria) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const listing = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        imagen_url: formData.imagen_url || 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
        ubicacion: formData.institucion || 'Quindío',
        telefono_contacto: '',
        email_contacto: userData.email || '',
        seller_id: userData.id,
        seller_name: userData.name,
        activo: true,
        destacado: false
      };

      const result = await MarketService.createListing(listing);

      if (result) {
        onSuccess();
      } else {
        setError('Error al crear el producto. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Publicar Producto</h2>
        <button
          onClick={onCancel}
          className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título del Producto *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Cuaderno artesanal"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción *</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe tu producto..."
              rows={4}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Precio (COP) *</label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="10000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoría *</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecciona...</option>
                {CATEGORIAS_MARKETPLACE.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Institución</label>
            <select
              value={formData.institucion}
              onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {INSTITUCIONES_QUINDIO.map(inst => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Impacto Social</label>
            <input
              type="text"
              value={formData.impacto_social}
              onChange={(e) => setFormData({ ...formData, impacto_social: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Apoyo a artesanos locales"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL de Imagen (opcional)</label>
            <input
              type="url"
              value={formData.imagen_url}
              onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Publicar Producto</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingForm;
