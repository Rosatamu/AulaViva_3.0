import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { MarketService } from '../services/marketService';
import { UserData } from '../types/User';

interface CartItem {
  listing: any;
  cantidad: number;
}

interface ShoppingCartViewProps {
  cartItems: CartItem[];
  userData: UserData;
  onUpdateQuantity: (listingId: string, cantidad: number) => void;
  onRemove: (listingId: string) => void;
  onBack: () => void;
  onCheckoutComplete: () => void;
}

const ShoppingCartView: React.FC<ShoppingCartViewProps> = ({
  cartItems,
  userData,
  onUpdateQuantity,
  onRemove,
  onBack,
  onCheckoutComplete
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.listing.precio * item.cantidad), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const orderItems = cartItems.map(item => ({
        listing_id: item.listing.id,
        cantidad: item.cantidad,
        precio_unitario: item.listing.precio
      }));

      const order = {
        comprador_id: userData.id,
        items: orderItems,
        total: total,
        estado: 'pendiente'
      };

      await MarketService.createOrder(order);

      setShowSuccess(true);
      setTimeout(() => {
        onCheckoutComplete();
      }, 2000);
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Error al procesar la orden. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-500/20 border border-green-500 rounded-2xl p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">¡Compra Exitosa!</h2>
          <p className="text-gray-300">Tu orden ha sido procesada correctamente</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Carrito de Compras</h2>
        </div>

        <div className="text-center py-12 bg-black/30 rounded-xl">
          <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-xl text-gray-400">Tu carrito está vacío</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            Explorar Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold">Carrito de Compras ({cartItems.length} items)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.listing.id}
              className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600/30 to-yellow-600/30 rounded-lg flex items-center justify-center text-2xl">
                  {item.listing.imagen_url ? (
                    <img src={item.listing.imagen_url} alt={item.listing.titulo} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    '📦'
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold">{item.listing.titulo}</h3>
                  <p className="text-sm text-gray-400">{item.listing.categoria}</p>
                  <p className="text-yellow-400 font-semibold">${item.listing.precio.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.listing.id, item.cantidad - 1)}
                    className="w-8 h-8 bg-gray-600 hover:bg-gray-700 rounded flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{item.cantidad}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.listing.id, item.cantidad + 1)}
                    className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onRemove(item.listing.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 sticky top-6">
            <h3 className="text-xl font-bold mb-4">Resumen de Compra</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>IVA (19%):</span>
                <span>${iva.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-yellow-400">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pagar Ahora</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Pago seguro procesado por la plataforma
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartView;
