import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Flame, Zap, Crown } from 'lucide-react';
import { MarketService, MarketListing } from '../services/marketService';
import MarketListingCard from './MarketListingCard';

interface FeaturedProductsProps {
  onAddToCart: (listing: MarketListing) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onAddToCart }) => {
  const [topRated, setTopRated] = useState<MarketListing[]>([]);
  const [mostSold, setMostSold] = useState<MarketListing[]>([]);
  const [newest, setNewest] = useState<MarketListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const allListings = await MarketService.getAllListings();

      const byRating = [...allListings]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      const bySales = [...allListings]
        .sort((a, b) => b.ventas - a.ventas)
        .slice(0, 3);

      const byDate = [...allListings]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

      setTopRated(byRating);
      setMostSold(bySales);
      setNewest(byDate);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const FeaturedSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    products: MarketListing[];
    badge: string;
    badgeColor: string;
  }> = ({ title, icon, products, badge, badgeColor }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {icon}
          <h3 className="text-2xl font-bold ml-3">{title}</h3>
        </div>
        <span className={`${badgeColor} px-4 py-2 rounded-full text-sm font-semibold flex items-center`}>
          <Zap className="w-4 h-4 mr-1" />
          {badge}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="bg-black/30 rounded-xl p-8 text-center">
          <p className="text-gray-400">No hay productos disponibles en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="relative">
              <MarketListingCard
                listing={product}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-yellow-900/40 via-orange-900/40 to-red-900/40 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <Flame className="w-12 h-12 text-orange-400 mr-3 animate-bounce" />
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Lo Más Destacado del Quindío
            </h2>
          </div>
          <p className="text-xl text-gray-300">
            Los proyectos más exitosos e innovadores de nuestras instituciones
          </p>
        </div>
      </div>

      {/* Top Rated Products */}
      <FeaturedSection
        title="Mejor Calificados"
        icon={<Crown className="w-8 h-8 text-yellow-400" />}
        products={topRated}
        badge="Excelencia"
        badgeColor="bg-yellow-600 text-white"
      />

      {/* Best Sellers */}
      <FeaturedSection
        title="Más Vendidos"
        icon={<TrendingUp className="w-8 h-8 text-green-400" />}
        products={mostSold}
        badge="Popular"
        badgeColor="bg-green-600 text-white"
      />

      {/* Newest */}
      <FeaturedSection
        title="Recién Llegados"
        icon={<Star className="w-8 h-8 text-blue-400" />}
        products={newest}
        badge="Nuevo"
        badgeColor="bg-blue-600 text-white"
      />

      {/* Stats Banner */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-4xl font-bold text-purple-400 mb-2">
              {(topRated.reduce((sum, p) => sum + p.rating, 0) / (topRated.length || 1)).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">Calificación Promedio</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-400 mb-2">
              {mostSold.reduce((sum, p) => sum + p.ventas, 0)}
            </p>
            <p className="text-sm text-gray-400">Ventas Totales</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-400 mb-2">
              {newest.length}
            </p>
            <p className="text-sm text-gray-400">Nuevos Esta Semana</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-yellow-400 mb-2">
              {[...new Set([...topRated, ...mostSold, ...newest].map(p => p.institucion))].length}
            </p>
            <p className="text-sm text-gray-400">Instituciones Activas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
