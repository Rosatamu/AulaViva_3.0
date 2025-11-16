import React, { useState, useEffect } from 'react';
import { Coins, Leaf, Check, AlertCircle } from 'lucide-react';
import { CriptoAulaService, CriptoAulaWallet } from '../services/criptoAulaService';

interface PaymentMethodSelectorProps {
  totalPrice: number;
  studentId: string;
  onPaymentMethodSelected: (method: PaymentMethod) => void;
  onClose?: () => void;
}

export interface PaymentMethod {
  currency: 'AulaCoins' | 'CriptoAula' | 'Mixed';
  amountAulaCoins: number;
  amountCriptoAula: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  totalPrice,
  studentId,
  onPaymentMethodSelected,
  onClose
}) => {
  const [wallet, setWallet] = useState<CriptoAulaWallet | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'AulaCoins' | 'CriptoAula' | 'Mixed'>('AulaCoins');
  const [customAulaCoins, setCustomAulaCoins] = useState<number>(0);
  const [customCriptoAula, setCustomCriptoAula] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const AULA_COINS_TO_CRIPTO = 0.1;
  const priceInCriptoAula = totalPrice * AULA_COINS_TO_CRIPTO;

  useEffect(() => {
    loadWallet();
  }, [studentId]);

  useEffect(() => {
    if (selectedMethod === 'Mixed') {
      setCustomAulaCoins(0);
      setCustomCriptoAula(0);
    }
  }, [selectedMethod]);

  const loadWallet = async () => {
    try {
      setIsLoading(true);
      await CriptoAulaService.syncWalletWithUserProgress(studentId);
      const walletData = await CriptoAulaService.getOrCreateWallet(studentId);
      setWallet(walletData);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canPayWithAulaCoins = () => {
    return wallet && wallet.balance_aula_coins >= totalPrice;
  };

  const canPayWithCriptoAula = () => {
    return wallet && wallet.balance_cripto_aula >= priceInCriptoAula;
  };

  const getRemainingAmount = () => {
    if (selectedMethod !== 'Mixed') return 0;

    const paidInAulaCoins = customAulaCoins;
    const paidInCriptoAulaAsAulaCoins = customCriptoAula / AULA_COINS_TO_CRIPTO;
    const totalPaid = paidInAulaCoins + paidInCriptoAulaAsAulaCoins;

    return Math.max(0, totalPrice - totalPaid);
  };

  const isValidMixedPayment = () => {
    if (selectedMethod !== 'Mixed') return true;

    if (customAulaCoins > (wallet?.balance_aula_coins || 0)) return false;
    if (customCriptoAula > (wallet?.balance_cripto_aula || 0)) return false;

    return getRemainingAmount() === 0;
  };

  const handleConfirmPayment = () => {
    let paymentMethod: PaymentMethod;

    switch (selectedMethod) {
      case 'AulaCoins':
        paymentMethod = {
          currency: 'AulaCoins',
          amountAulaCoins: totalPrice,
          amountCriptoAula: 0
        };
        break;
      case 'CriptoAula':
        paymentMethod = {
          currency: 'CriptoAula',
          amountAulaCoins: 0,
          amountCriptoAula: priceInCriptoAula
        };
        break;
      case 'Mixed':
        paymentMethod = {
          currency: 'Mixed',
          amountAulaCoins: customAulaCoins,
          amountCriptoAula: customCriptoAula
        };
        break;
    }

    onPaymentMethodSelected(paymentMethod);
  };

  const suggestOptimalMix = () => {
    if (!wallet) return;

    const availableAulaCoins = wallet.balance_aula_coins;
    const availableCriptoAula = wallet.balance_cripto_aula;

    if (availableAulaCoins >= totalPrice) {
      setCustomAulaCoins(totalPrice);
      setCustomCriptoAula(0);
    } else {
      setCustomAulaCoins(availableAulaCoins);
      const remainingInAulaCoins = totalPrice - availableAulaCoins;
      const neededCriptoAula = remainingInAulaCoins * AULA_COINS_TO_CRIPTO;
      setCustomCriptoAula(Math.min(neededCriptoAula, availableCriptoAula));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-2"></div>
          <p className="text-gray-400">Cargando métodos de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Método de Pago</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="bg-gradient-to-r from-green-600/20 to-yellow-600/20 rounded-lg p-4 mb-6 border border-green-500/20">
        <p className="text-sm text-gray-300 mb-1">Total a Pagar</p>
        <p className="text-3xl font-bold text-white">{totalPrice} AulaCoins</p>
        <p className="text-sm text-gray-400 mt-1">
          ≈ {priceInCriptoAula.toFixed(2)} CriptoAula
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={() => setSelectedMethod('AulaCoins')}
          disabled={!canPayWithAulaCoins()}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            selectedMethod === 'AulaCoins'
              ? 'border-yellow-500 bg-yellow-500/20'
              : 'border-white/10 bg-black/20 hover:border-white/20'
          } ${!canPayWithAulaCoins() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coins className="w-6 h-6 text-yellow-400" />
              <div className="text-left">
                <p className="font-bold text-white">Pagar con AulaCoins</p>
                <p className="text-sm text-gray-400">
                  Disponible: {wallet?.balance_aula_coins || 0} AC
                </p>
              </div>
            </div>
            {selectedMethod === 'AulaCoins' && (
              <Check className="w-6 h-6 text-green-400" />
            )}
          </div>
          {!canPayWithAulaCoins() && (
            <div className="flex items-center space-x-2 mt-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>Saldo insuficiente</span>
            </div>
          )}
        </button>

        <button
          onClick={() => setSelectedMethod('CriptoAula')}
          disabled={!canPayWithCriptoAula()}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            selectedMethod === 'CriptoAula'
              ? 'border-green-500 bg-green-500/20'
              : 'border-white/10 bg-black/20 hover:border-white/20'
          } ${!canPayWithCriptoAula() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Coins className="w-5 h-5 text-green-300" />
                <Leaf className="w-4 h-4 text-yellow-300 -ml-2" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white">Pagar con CriptoAula</p>
                <p className="text-sm text-gray-400">
                  Disponible: {Number(wallet?.balance_cripto_aula || 0).toFixed(2)} CA
                </p>
              </div>
            </div>
            {selectedMethod === 'CriptoAula' && (
              <Check className="w-6 h-6 text-green-400" />
            )}
          </div>
          {!canPayWithCriptoAula() && (
            <div className="flex items-center space-x-2 mt-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>Saldo insuficiente</span>
            </div>
          )}
        </button>

        <button
          onClick={() => setSelectedMethod('Mixed')}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            selectedMethod === 'Mixed'
              ? 'border-purple-500 bg-purple-500/20'
              : 'border-white/10 bg-black/20 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Coins className="w-6 h-6 text-yellow-400" />
                <span className="text-white mx-1">+</span>
                <Coins className="w-5 h-5 text-green-300" />
                <Leaf className="w-4 h-4 text-yellow-300 -ml-2" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white">Pago Combinado</p>
                <p className="text-sm text-gray-400">Usa ambas monedas</p>
              </div>
            </div>
            {selectedMethod === 'Mixed' && (
              <Check className="w-6 h-6 text-green-400" />
            )}
          </div>
        </button>
      </div>

      {selectedMethod === 'Mixed' && (
        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Distribuir Pago</h4>
            <button
              onClick={suggestOptimalMix}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Sugerir Óptimo
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                AulaCoins (Disponible: {wallet?.balance_aula_coins || 0})
              </label>
              <input
                type="number"
                value={customAulaCoins}
                onChange={(e) => setCustomAulaCoins(Math.min(Number(e.target.value), wallet?.balance_aula_coins || 0))}
                min="0"
                max={wallet?.balance_aula_coins || 0}
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                CriptoAula (Disponible: {Number(wallet?.balance_cripto_aula || 0).toFixed(2)})
              </label>
              <input
                type="number"
                value={customCriptoAula}
                onChange={(e) => setCustomCriptoAula(Math.min(Number(e.target.value), wallet?.balance_cripto_aula || 0))}
                min="0"
                max={wallet?.balance_cripto_aula || 0}
                step="0.1"
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Pagado:</span>
                <span className="text-white font-semibold">
                  {(customAulaCoins + (customCriptoAula / AULA_COINS_TO_CRIPTO)).toFixed(0)} AC
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Faltante:</span>
                <span className={`font-semibold ${getRemainingAmount() === 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {getRemainingAmount().toFixed(0)} AC
                </span>
              </div>
            </div>

            {!isValidMixedPayment() && (
              <div className="flex items-center space-x-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {getRemainingAmount() > 0
                    ? 'Debes completar el pago total'
                    : 'Saldo insuficiente en una o ambas monedas'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleConfirmPayment}
        disabled={
          (selectedMethod === 'AulaCoins' && !canPayWithAulaCoins()) ||
          (selectedMethod === 'CriptoAula' && !canPayWithCriptoAula()) ||
          (selectedMethod === 'Mixed' && !isValidMixedPayment())
        }
        className="w-full bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirmar Pago
      </button>
    </div>
  );
};

export default PaymentMethodSelector;
