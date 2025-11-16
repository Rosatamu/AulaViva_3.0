import React, { useState, useEffect } from 'react';
import { Clock, User, Trophy, Star, Coins, Leaf, Shield } from 'lucide-react';

interface HeaderProps {
  userData: {
    name: string;
    currentLevel: number;
    totalPoints: number;
    id: string;
  };
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout?: () => void;
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userData, currentView, onNavigate, onLogout, isAdmin }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-purple-500/20 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 hover:text-purple-300 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Aula Viva
              </h1>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-2xl font-mono bg-black/30 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">{formatTime(currentTime)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 capitalize">{formatDate(currentTime)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('criptoaula')}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              title="CriptoAula - Token Educativo"
            >
              <div className="flex items-center">
                <Coins className="w-5 h-5 text-green-100" />
                <Leaf className="w-4 h-4 text-yellow-200 -ml-2" />
              </div>
              <span className="font-semibold text-white hidden sm:inline">CriptoAula</span>
            </button>

            <div className="flex items-center space-x-3 bg-black/30 px-4 py-2 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div className="text-sm">
                <p className="font-semibold">Nivel {userData.currentLevel}</p>
                <p className="text-purple-300">{userData.totalPoints} pts</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-lg hover:bg-black/40 transition-colors"
              >
                <User className="w-5 h-5 text-green-400" />
                <span className="font-medium">{userData.name}</span>
                <span className="text-xs text-gray-400">ID: {userData.id}</span>
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 py-2 z-50"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-sm"
                  >
                    Ver Perfil Completo
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-sm flex items-center space-x-2"
                      >
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 font-semibold">Panel Administrador</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('data');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-sm"
                      >
                        Gestión de Datos
                      </button>
                    </>
                  )}
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-sm text-red-400"
                    >
                      Cerrar Sesión
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;