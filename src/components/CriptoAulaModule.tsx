import React, { useState, useEffect } from 'react';
import { Coins, Leaf, ArrowRightLeft, TrendingUp, TrendingDown, History, Award, Zap, DollarSign, BarChart3 } from 'lucide-react';
import { CriptoAulaService, CriptoAulaWallet, CriptoAulaTransaction } from '../services/criptoAulaService';
import { UserData } from '../types/User';

interface CriptoAulaModuleProps {
  userData: UserData;
  onBack: () => void;
}

const CriptoAulaModule: React.FC<CriptoAulaModuleProps> = ({ userData, onBack }) => {
  const [wallet, setWallet] = useState<CriptoAulaWallet | null>(null);
  const [transactions, setTransactions] = useState<CriptoAulaTransaction[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'convert' | 'history' | 'stats'>('dashboard');

  const [convertAmount, setConvertAmount] = useState<number>(0);
  const [convertFrom, setConvertFrom] = useState<'AulaCoins' | 'CriptoAula'>('AulaCoins');
  const [conversionRate, setConversionRate] = useState<number>(0.1);
  const [isConverting, setIsConverting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, [userData.id]);

  useEffect(() => {
    fetchConversionRate();
  }, [convertFrom]);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      await CriptoAulaService.syncWalletWithUserProgress(userData.id);
      const walletData = await CriptoAulaService.getOrCreateWallet(userData.id);
      const transactionsData = await CriptoAulaService.getTransactions(userData.id, 50);
      const stats = await CriptoAulaService.getWalletStatistics(userData.id);

      setWallet(walletData);
      setTransactions(transactionsData);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversionRate = async () => {
    const toCurrency = convertFrom === 'AulaCoins' ? 'CriptoAula' : 'AulaCoins';
    const rate = await CriptoAulaService.getActiveConversionRate(convertFrom, toCurrency);
    setConversionRate(rate);
  };

  const handleConversion = async () => {
    if (!wallet || convertAmount <= 0) return;

    const fromBalance = convertFrom === 'AulaCoins'
      ? wallet.balance_aula_coins
      : wallet.balance_cripto_aula;

    if (convertAmount > fromBalance) {
      alert('Saldo insuficiente para esta conversión');
      return;
    }

    try {
      setIsConverting(true);
      const updatedWallet = await CriptoAulaService.convertCurrency(
        userData.id,
        convertFrom,
        convertAmount
      );

      setWallet(updatedWallet);
      setConvertAmount(0);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      await loadWalletData();
    } catch (error) {
      console.error('Error converting currency:', error);
      alert('Error al convertir moneda. Intenta de nuevo.');
    } finally {
      setIsConverting(false);
    }
  };

  const getConvertedAmount = () => {
    return (convertAmount * conversionRate).toFixed(2);
  };

  const getPesoValue = () => {
    if (!wallet) return '0';
    const totalValue = (wallet.balance_aula_coins * 20) + (Number(wallet.balance_cripto_aula) * 200);
    return totalValue.toLocaleString('es-CO');
  };

  const getWalletLevelColor = (level: string) => {
    switch (level) {
      case 'Platino': return 'from-cyan-400 to-blue-600';
      case 'Oro': return 'from-yellow-400 to-orange-500';
      case 'Plata': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-600 to-red-700';
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type.startsWith('earn_')) return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (type.startsWith('spend_')) return <TrendingDown className="w-5 h-5 text-red-400" />;
    return <ArrowRightLeft className="w-5 h-5 text-blue-400" />;
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      earn_activity: 'Actividad Completada',
      earn_quiz: 'Quiz Completado',
      earn_marketplace_sale: 'Venta en Marketplace',
      earn_bonus: 'Bonus',
      earn_streak: 'Racha',
      earn_referral: 'Referido',
      spend_listing_fee: 'Fee de Publicación',
      spend_purchase: 'Compra',
      spend_premium: 'Premium',
      spend_reward: 'Recompensa',
      conversion_to_cripto: 'Conversión a CriptoAula',
      conversion_to_aula: 'Conversión a AulaCoins'
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-400">Cargando tu wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 rounded-full flex items-center justify-center transition-all"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
              CriptoAula
            </h1>
            <p className="text-gray-400">Token Educativo del Quindío</p>
          </div>
        </div>

        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-green-600 via-green-700 to-yellow-600 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-16 h-16 bg-gradient-to-r ${getWalletLevelColor(wallet?.wallet_level || 'Bronce')} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-yellow-200 text-sm">Nivel de Wallet</p>
                    <p className="text-2xl font-bold text-white">{wallet?.wallet_level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-200 text-sm">Valor Estimado</p>
                  <p className="text-2xl font-bold text-white">${getPesoValue()} COP</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Coins className="w-6 h-6 text-yellow-300" />
                    <p className="text-yellow-200 text-sm">AulaCoins</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{wallet?.balance_aula_coins || 0}</p>
                  <p className="text-xs text-yellow-200 mt-1">
                    ≈ ${((wallet?.balance_aula_coins || 0) * 20).toLocaleString('es-CO')} COP
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      <Coins className="w-5 h-5 text-green-300" />
                      <Leaf className="w-4 h-4 text-yellow-300 -ml-2" />
                    </div>
                    <p className="text-green-200 text-sm">CriptoAula</p>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {Number(wallet?.balance_cripto_aula || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-green-200 mt-1">
                    ≈ ${(Number(wallet?.balance_cripto_aula || 0) * 200).toLocaleString('es-CO')} COP
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-lg">Total Ganado</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-400">AulaCoins</p>
                  <p className="text-2xl font-bold text-green-400">
                    {wallet?.total_earned_aula_coins || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">CriptoAula</p>
                  <p className="text-2xl font-bold text-green-400">
                    {Number(wallet?.total_earned_cripto_aula || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-lg">Total Gastado</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-400">AulaCoins</p>
                  <p className="text-2xl font-bold text-red-400">
                    {wallet?.total_spent_aula_coins || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">CriptoAula</p>
                  <p className="text-2xl font-bold text-red-400">
                    {Number(wallet?.total_spent_cripto_aula || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 mb-6">
          <div className="flex border-b border-white/10">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'convert', label: 'Convertir', icon: ArrowRightLeft },
              { id: 'history', label: 'Historial', icon: History },
              { id: 'stats', label: 'Estadísticas', icon: Zap }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 flex items-center justify-center space-x-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-yellow-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/20">
                    <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span>Formas de Ganar</span>
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">🏃 Completar Actividad Física</span>
                        <span className="font-bold text-green-400">+1 CA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">🧠 Quiz Correcto</span>
                        <span className="font-bold text-green-400">+0.5 CA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">🛒 Venta en Marketplace</span>
                        <span className="font-bold text-green-400">+2 CA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">🔥 Racha 7 días</span>
                        <span className="font-bold text-green-400">+0.5 CA</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/20">
                    <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-orange-400" />
                      <span>Formas de Gastar</span>
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">📝 Publicar en Marketplace</span>
                        <span className="font-bold text-yellow-400">5 CA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">🛍️ Comprar Productos</span>
                        <span className="font-bold text-yellow-400">Variable</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">⭐ Avatares Premium</span>
                        <span className="font-bold text-yellow-400">5-15 CA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">🤖 NutriBot Premium</span>
                        <span className="font-bold text-yellow-400">20 CA/mes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-600/20 to-yellow-600/20 rounded-xl p-6 border border-green-500/20">
                  <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-green-400" />
                    <span>Acerca de CriptoAula</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    CriptoAula es el token educativo del Quindío que te permite ganar recompensas
                    por aprender y participar en el ecosistema de Aula Viva. Puedes convertir tus
                    AulaCoins a CriptoAula para acceder a beneficios premium o usarlos en el
                    marketplace de EmprendeQuindío. ¡El aprendizaje nunca fue tan recompensante!
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'convert' && (
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-green-500/10 to-yellow-500/10 rounded-xl p-6 border border-green-500/20 mb-6">
                  <h3 className="text-xl font-bold mb-4 text-center">Convertir Moneda</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Desde</label>
                      <select
                        value={convertFrom}
                        onChange={(e) => setConvertFrom(e.target.value as any)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="AulaCoins">AulaCoins</option>
                        <option value="CriptoAula">CriptoAula</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Cantidad</label>
                      <input
                        type="number"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(Number(e.target.value))}
                        min="0"
                        step={convertFrom === 'CriptoAula' ? '0.1' : '1'}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Disponible: {convertFrom === 'AulaCoins'
                          ? wallet?.balance_aula_coins
                          : Number(wallet?.balance_cripto_aula || 0).toFixed(2)
                        } {convertFrom}
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="bg-green-600 rounded-full p-3">
                        <ArrowRightLeft className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
                      <p className="text-sm text-gray-400 mb-1">Recibirás</p>
                      <p className="text-3xl font-bold text-green-400">
                        {getConvertedAmount()} {convertFrom === 'AulaCoins' ? 'CriptoAula' : 'AulaCoins'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Tasa de conversión: 1 {convertFrom} = {conversionRate} {convertFrom === 'AulaCoins' ? 'CriptoAula' : 'AulaCoins'}
                      </p>
                    </div>

                    <button
                      onClick={handleConversion}
                      disabled={isConverting || convertAmount <= 0}
                      className="w-full bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConverting ? 'Convirtiendo...' : 'Convertir Ahora'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-xl font-bold mb-4">Historial de Transacciones</h3>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No hay transacciones aún</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-black/20 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getTransactionIcon(tx.transaction_type)}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {getTransactionTypeLabel(tx.transaction_type)}
                              </p>
                              {tx.description && (
                                <p className="text-sm text-gray-400 mt-1">{tx.description}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(tx.created_at!).toLocaleDateString('es-CO', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              tx.amount >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {tx.amount >= 0 ? '+' : ''}{Number(tx.amount).toFixed(2)} {tx.currency === 'AulaCoins' ? 'AC' : 'CA'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Balance: {Number(tx.balance_after).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && statistics && (
              <div>
                <h3 className="text-xl font-bold mb-6">Estadísticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-500/20">
                    <p className="text-sm text-blue-300 mb-2">Total Transacciones</p>
                    <p className="text-3xl font-bold text-white">{statistics.totalTransactions}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/20">
                    <p className="text-sm text-green-300 mb-2">Ganancias</p>
                    <p className="text-3xl font-bold text-white">{statistics.earnTransactions}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-6 border border-red-500/20">
                    <p className="text-sm text-red-300 mb-2">Gastos</p>
                    <p className="text-3xl font-bold text-white">{statistics.spendTransactions}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/20">
                    <p className="text-sm text-purple-300 mb-2">Conversiones</p>
                    <p className="text-3xl font-bold text-white">{statistics.conversionTransactions}</p>
                  </div>
                </div>

                <div className="mt-6 bg-black/20 rounded-xl p-6 border border-white/10">
                  <h4 className="font-bold mb-4">Moneda Preferida</h4>
                  <div className="flex items-center space-x-4">
                    <div className={`flex-1 h-12 rounded-lg flex items-center justify-center font-bold ${
                      statistics.preferredCurrency === 'AulaCoins'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gray-700'
                    }`}>
                      AulaCoins
                    </div>
                    <div className={`flex-1 h-12 rounded-lg flex items-center justify-center font-bold ${
                      statistics.preferredCurrency === 'CriptoAula'
                        ? 'bg-gradient-to-r from-green-500 to-yellow-500'
                        : 'bg-gray-700'
                    }`}>
                      CriptoAula
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-4 text-center">
                    {statistics.preferredCurrency === 'Equal'
                      ? 'Usas ambas monedas por igual'
                      : `Prefieres usar ${statistics.preferredCurrency}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriptoAulaModule;
