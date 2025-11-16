import React, { useState, useEffect } from 'react';
import { Rocket, Search, Filter, Plus, ShoppingCart, Trophy, TrendingUp, BarChart3, Star, Heart } from 'lucide-react';
import { MarketService, MarketListing } from '../services/marketService';
import { INSTITUCIONES_QUINDIO, CATEGORIAS_MARKETPLACE, FRASES_MOTIVACIONALES } from '../services/mockEmprendeData';
import MarketListingCard from './MarketListingCard';
import CreateListingForm from './CreateListingForm';
import ShoppingCartView from './ShoppingCartView';
import QuickProjectSubmit from './QuickProjectSubmit';
import ImpactDashboard from './ImpactDashboard';
import FeaturedProducts from './FeaturedProducts';
import SuccessStories from './SuccessStories';
import { UserData } from '../types/User';

interface EmprendeQuindioProps {
  userData: UserData;
  onBack: () => void;
}

type SubView = 'home' | 'marketplace' | 'create-listing' | 'cart' | 'submit-project' | 'my-listings' | 'impact' | 'success-stories';

const EmprendeQuindio: React.FC<EmprendeQuindioProps> = ({ userData, onBack }) => {
  const [subView, setSubView] = useState<SubView>('home');
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [selectedInstitucion, setSelectedInstitucion] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [fraseMotivacional] = useState(
    FRASES_MOTIVACIONALES[Math.floor(Math.random() * FRASES_MOTIVACIONALES.length)]
  );

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, searchTerm, selectedCategoria, selectedInstitucion]);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const data = await MarketService.getAllListings();
      setListings(data);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...listings];

    if (searchTerm) {
      filtered = filtered.filter(
        l =>
          l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategoria) {
      filtered = filtered.filter(l => l.categoria === selectedCategoria);
    }

    if (selectedInstitucion) {
      filtered = filtered.filter(l => l.institucion === selectedInstitucion);
    }

    setFilteredListings(filtered);
  };

  const handleAddToCart = (listing: MarketListing) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.listing.id === listing.id);
      if (existing) {
        return prev.map(item =>
          item.listing.id === listing.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { listing, cantidad: 1 }];
    });
  };

  const handleRemoveFromCart = (listingId: string) => {
    setCartItems(prev => prev.filter(item => item.listing.id !== listingId));
  };

  const handleUpdateCartQuantity = (listingId: string, cantidad: number) => {
    if (cantidad <= 0) {
      handleRemoveFromCart(listingId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.listing.id === listingId ? { ...item, cantidad } : item
      )
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategoria('');
    setSelectedInstitucion('');
  };

  const renderHero = () => (
    <div className="relative bg-gradient-to-br from-quindio-green via-green-600 to-quindio-yellow rounded-2xl p-8 mb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center mb-4">
          <Rocket className="w-12 h-12 text-quindio-yellow mr-3 animate-bounce" />
          <h1 className="text-4xl font-bold text-white">EmprendeQuindío 2025</h1>
        </div>
        <p className="text-2xl text-quindio-yellow font-bold mb-3">Productos Escolares de Quindío</p>
        <p className="text-lg text-white/95 mb-4 max-w-4xl mx-auto">
          Proyectos de estudiantes, familias y SENA: innovación, tradición y cultivos locales de Quimbaya
        </p>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mt-6 max-w-5xl mx-auto">
          <p className="text-sm text-white/90 mb-2 font-semibold">Equipo Aprendices SENA - IE Ramón Messa Londoño</p>
          <p className="text-xs text-white/80 leading-relaxed">
            Jesús Alberto Nare Aponte (PPT 4526136) • Diego Alberto Ríos Flores (T.I 1096671181) •
            Salomé Moncada Villa (T.I 1183963061) • Brayan Esteven Méndez Tobar •
            César Augusto Mosquera (C.C. 1095178828)
          </p>
        </div>

        <p className="text-md text-quindio-yellow italic mt-4 font-medium">{fraseMotivacional}</p>

        {/* Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            onClick={() => setSubView('home')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              subView === 'home'
                ? 'bg-white text-quindio-green shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className="inline w-5 h-5 mr-2" />
            Inicio
          </button>
          <button
            onClick={() => setSubView('impact')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              subView === 'impact'
                ? 'bg-white text-quindio-green shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <BarChart3 className="inline w-5 h-5 mr-2" />
            Impacto
          </button>
          <button
            onClick={() => setSubView('marketplace')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              subView === 'marketplace'
                ? 'bg-white text-quindio-green shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <ShoppingCart className="inline w-5 h-5 mr-2" />
            Explorar
          </button>
          <button
            onClick={() => setSubView('success-stories')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              subView === 'success-stories'
                ? 'bg-white text-quindio-green shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Star className="inline w-5 h-5 mr-2" />
            Casos de Éxito
          </button>
          <button
            onClick={() => setSubView('create-listing')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              subView === 'create-listing'
                ? 'bg-white text-quindio-green shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Plus className="inline w-5 h-5 mr-2" />
            Vender
          </button>
          <button
            onClick={() => setSubView('submit-project')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              subView === 'submit-project'
                ? 'bg-white text-quindio-green shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Trophy className="inline w-5 h-5 mr-2" />
            Registrar Proyecto
          </button>
          <button
            onClick={() => setSubView('my-listings')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              subView === 'my-listings'
                ? 'bg-white text-quindio-green shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <TrendingUp className="inline w-5 h-5 mr-2" />
            Mis Productos
          </button>
          <button
            onClick={() => setSubView('cart')}
            className="relative px-6 py-3 bg-quindio-yellow hover:bg-yellow-600 text-black rounded-xl font-semibold transition-all"
          >
            <ShoppingCart className="inline w-5 h-5 mr-2" />
            Carrito
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {cartItems.reduce((sum, item) => sum + item.cantidad, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-12">
      <FeaturedProducts onAddToCart={handleAddToCart} />
    </div>
  );

  const renderMarketplace = () => (
    <div>
      <div className="mb-6 bg-black/30 backdrop-blur-sm rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos, servicios, instituciones..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Categoría</label>
              <select
                value={selectedCategoria}
                onChange={e => setSelectedCategoria(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas las categorías</option>
                {CATEGORIAS_MARKETPLACE.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Institución</label>
              <select
                value={selectedInstitucion}
                onChange={e => setSelectedInstitucion(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas las instituciones</option>
                {INSTITUCIONES_QUINDIO.map(inst => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-400">Cargando productos...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-12 bg-black/30 rounded-xl">
          <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No se encontraron productos</p>
          <p className="text-gray-500 mt-2">Intenta ajustar tus filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <MarketListingCard
              key={listing.id}
              listing={listing}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderMyListings = () => {
    const [myListings, setMyListings] = useState<MarketListing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadMyListings = async () => {
        try {
          const data = await MarketService.getUserListings(userData.id);
          setMyListings(data);
        } catch (error) {
          console.error('Error loading my listings:', error);
        } finally {
          setLoading(false);
        }
      };
      loadMyListings();
    }, []);

    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-400">Cargando tus productos...</p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mis Productos</h2>
          <button
            onClick={() => setSubView('create-listing')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </button>
        </div>

        {myListings.length === 0 ? (
          <div className="text-center py-12 bg-black/30 rounded-xl">
            <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Aún no tienes productos publicados</p>
            <button
              onClick={() => setSubView('create-listing')}
              className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
            >
              Publicar Mi Primer Producto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map(listing => (
              <MarketListingCard
                key={listing.id}
                listing={listing}
                isOwner={true}
                onEdit={() => console.log('Edit listing:', listing.id)}
                onDelete={async () => {
                  if (confirm('¿Estás seguro de eliminar este producto?')) {
                    try {
                      await MarketService.deleteListing(listing.id);
                      setMyListings(prev => prev.filter(l => l.id !== listing.id));
                    } catch (error) {
                      console.error('Error deleting listing:', error);
                    }
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (subView) {
      case 'home':
        return renderHome();
      case 'impact':
        return <ImpactDashboard />;
      case 'marketplace':
        return renderMarketplace();
      case 'success-stories':
        return <SuccessStories />;
      case 'create-listing':
        return (
          <CreateListingForm
            userData={userData}
            onSuccess={() => {
              loadListings();
              setSubView('marketplace');
            }}
            onCancel={() => setSubView('marketplace')}
          />
        );
      case 'cart':
        return (
          <ShoppingCartView
            cartItems={cartItems}
            userData={userData}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemove={handleRemoveFromCart}
            onBack={() => setSubView('marketplace')}
            onCheckoutComplete={() => {
              setCartItems([]);
              setSubView('marketplace');
            }}
          />
        );
      case 'submit-project':
        return (
          <QuickProjectSubmit
            userData={userData}
            onBack={() => setSubView('home')}
          />
        );
      case 'my-listings':
        return renderMyListings();
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-quindio-green hover:bg-green-700 rounded-full flex items-center justify-center transition-colors text-white font-bold"
          >
            ←
          </button>
        </div>

        {renderHero()}
        {renderContent()}
      </div>
    </div>
  );
};

export default EmprendeQuindio;
