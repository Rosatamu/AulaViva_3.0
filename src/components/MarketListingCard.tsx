import React from 'react';
import { ShoppingCart, Eye, Star, Edit, Trash2 } from 'lucide-react';
import { MarketListing } from '../services/marketService';

interface MarketListingCardProps {
  listing: MarketListing;
  onAddToCart?: (listing: MarketListing) => void;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MarketListingCard: React.FC<MarketListingCardProps> = ({
  listing,
  onAddToCart,
  isOwner = false,
  onEdit,
  onDelete
}) => {
  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Panadería': 'bg-amber-600',
      'Postres': 'bg-pink-500',
      'Innovadores': 'bg-quindio-yellow',
      'Cultivos': 'bg-quindio-green',
      'Manualidades': 'bg-pink-500',
      'Alimentos': 'bg-green-500',
      'Tecnología': 'bg-blue-500',
      'Servicios': 'bg-purple-500',
      'Arte': 'bg-yellow-500',
      'Deporte': 'bg-red-500',
      'Educación': 'bg-indigo-500',
      'Otros': 'bg-gray-500'
    };
    return colors[categoria] || 'bg-gray-500';
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
      <div className="h-48 bg-gradient-to-br from-quindio-green/30 to-quindio-yellow/30 flex items-center justify-center text-4xl relative overflow-hidden">
        {listing.imagen_url ? (
          <img
            src={listing.imagen_url}
            alt={listing.titulo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          '📦'
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold flex-1">{listing.titulo}</h3>
          <span className={`${getCategoryColor(listing.categoria)} text-xs px-2 py-1 rounded-full text-white font-semibold`}>
            {listing.categoria}
          </span>
        </div>

        {listing.badge_emprendimiento && (
          <div className="mb-2">
            <span className="bg-quindio-yellow text-black text-xs px-3 py-1 rounded-full font-bold inline-block">
              🏆 Emprendimiento Escolar
            </span>
          </div>
        )}

        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{listing.descripcion}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
          {listing.rating !== undefined && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{listing.rating.toFixed(1)}</span>
            </div>
          )}
          {listing.ventas !== undefined && (
            <div className="flex items-center space-x-1">
              <ShoppingCart className="w-4 h-4" />
              <span>{listing.ventas} ventas</span>
            </div>
          )}
          {listing.vistas !== undefined && (
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{listing.vistas}</span>
            </div>
          )}
        </div>

        {listing.impacto_social && (
          <div className="bg-quindio-green/10 rounded-lg p-2 mb-3 border border-quindio-green/30">
            <p className="text-xs text-green-300">💚 {listing.impacto_social}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-quindio-yellow">${listing.precio.toLocaleString()} COP</p>
            <p className="text-xs text-gray-400">{listing.ubicacion || listing.institucion || 'Quindío'}</p>
            {listing.tipo_productor && (
              <p className="text-xs text-quindio-yellow font-semibold mt-1">
                {listing.tipo_productor === 'SENA' ? '🎓 SENA' : listing.tipo_productor === 'Familiar' ? '👨‍👩‍👧 Familiar' : '🎒 Escolar'}
              </p>
            )}
          </div>

          {isOwner ? (
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart?.(listing)}
              className="px-4 py-2 bg-quindio-green hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center space-x-2 text-white"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketListingCard;
