import React, { useState, useEffect } from 'react';
import { Coins, Star, Trophy, Gift, Zap, Leaf, ArrowRightLeft } from 'lucide-react';
import { CriptoAulaService, CriptoAulaWallet } from '../services/criptoAulaService';

interface AulaCoinsSystemProps {
  userData: {
    id: string;
    totalPoints: number;
    currentLevel: number;
    achievements: string[];
  };
}

const AulaCoinsSystem: React.FC<AulaCoinsSystemProps> = ({ userData }) => {
  const [wallet, setWallet] = useState<CriptoAulaWallet | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertAmount, setConvertAmount] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const aulaCoins = wallet?.balance_aula_coins || Math.floor(userData.totalPoints / 10);
  const coinsToNextReward = 100 - (aulaCoins % 100);

  useEffect(() => {
    loadWallet();
  }, [userData.id]);

  const loadWallet = async () => {
    try {
      await CriptoAulaService.syncWalletWithUserProgress(userData.id);
      const walletData = await CriptoAulaService.getOrCreateWallet(userData.id);
      setWallet(walletData);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const handleQuickConvert = async () => {
    if (!wallet || convertAmount <= 0 || convertAmount > wallet.balance_aula_coins) return;

    try {
      setIsConverting(true);
      await CriptoAulaService.convertCurrency(userData.id, 'AulaCoins', convertAmount);
      await loadWallet();
      setConvertAmount(0);
      setShowConvertModal(false);
    } catch (error) {
      console.error('Error converting:', error);
      alert('Error al convertir. Intenta de nuevo.');
    } finally {
      setIsConverting(false);
    }
  };

  const rewards = [
    {
      id: 1,
      name: 'Avatar Deportista',
      cost: 50,
      icon: '🏃‍♂️',
      description: 'Desbloquea un nuevo avatar',
      unlocked: aulaCoins >= 50
    },
    {
      id: 2,
      name: 'Insignia Corazón Activo',
      cost: 100,
      icon: '❤️',
      description: 'Medalla especial de actividad',
      unlocked: aulaCoins >= 100
    },
    {
      id: 3,
      name: 'Avatar Mente Nutrida',
      cost: 150,
      icon: '🧠',
      description: 'Avatar de nutrición avanzada',
      unlocked: aulaCoins >= 150
    },
    {
      id: 4,
      name: 'Cápsula del Tiempo Premium',
      cost: 200,
      icon: '⏰',
      description: 'Contenido educativo exclusivo',
      unlocked: aulaCoins >= 200
    },
    {
      id: 5,
      name: 'Mentor Personal',
      cost: 300,
      icon: '🤖',
      description: 'Acceso premium a NutriBot',
      unlocked: aulaCoins >= 300
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-400">AulaMonedas</h3>
              <p className="text-gray-400 text-sm">Tu moneda virtual</p>
            </div>
          </div>
          <button
            onClick={() => setShowConvertModal(!showConvertModal)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 px-4 py-2 rounded-lg transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Convertir</span>
          </button>
        </div>

        {wallet && wallet.balance_cripto_aula > 0 && (
          <div className="mb-6 bg-gradient-to-r from-green-600/20 to-yellow-600/20 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Coins className="w-5 h-5 text-green-300" />
                  <Leaf className="w-4 h-4 text-yellow-300 -ml-2" />
                </div>
                <div>
                  <p className="text-sm text-green-200">Balance CriptoAula</p>
                  <p className="text-2xl font-bold text-white">
                    {Number(wallet.balance_cripto_aula).toFixed(2)} CA
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Valor estimado</p>
                <p className="text-sm font-semibold text-green-300">
                  ≈ ${(Number(wallet.balance_cripto_aula) * 200).toLocaleString('es-CO')} COP
                </p>
              </div>
            </div>
          </div>
        )}

        {showConvertModal && (
          <div className="mb-6 bg-black/50 rounded-xl p-4 border border-green-500/20">
            <h4 className="font-bold mb-3 flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-green-400" />
              <span>Conversión Rápida</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Cantidad de AulaCoins a convertir
                </label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(Math.min(Number(e.target.value), aulaCoins))}
                  min="0"
                  max={aulaCoins}
                  className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Disponible: {aulaCoins} AC
                </p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <p className="text-sm text-gray-400 mb-1">Recibirás</p>
                <p className="text-2xl font-bold text-green-400">
                  {(convertAmount * 0.1).toFixed(2)} CriptoAula
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tasa: 10 AC = 1 CA
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleQuickConvert}
                  disabled={isConverting || convertAmount <= 0}
                  className="flex-1 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white font-bold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? 'Convirtiendo...' : 'Convertir'}
                </button>
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Balance */}
      <div className="text-center mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/20">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Coins className="w-8 h-8 text-yellow-400" />
          <span className="text-3xl font-bold text-yellow-400">{aulaCoins}</span>
        </div>
        <p className="text-sm text-gray-400">AulaMonedas disponibles</p>
        <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((aulaCoins % 100) / 100) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {coinsToNextReward} monedas para la próxima recompensa
        </p>
      </div>

      {/* Rewards Store */}
      <div>
        <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <Gift className="w-5 h-5 text-purple-400" />
          <span>Tienda de Recompensas</span>
        </h4>
        
        <div className="space-y-3">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                reward.unlocked
                  ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'
                  : 'bg-gray-500/10 border-gray-500/20 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <h5 className="font-semibold text-white">{reward.name}</h5>
                    <p className="text-xs text-gray-400">{reward.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-yellow-400">{reward.cost}</span>
                  </div>
                  {reward.unlocked ? (
                    <button className="mt-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition-colors">
                      Canjear
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">Bloqueado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earning Tips */}
      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-blue-400">¿Cómo ganar AulaMonedas?</span>
        </div>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>Completar actividades: +10-30 monedas</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>Side Quests: +5-15 monedas extra</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span>Interactuar con NutriBot: +5 monedas</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AulaCoinsSystem;