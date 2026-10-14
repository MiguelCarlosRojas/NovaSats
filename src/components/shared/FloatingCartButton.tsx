import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const FloatingCartButton: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center shadow-2xl shadow-amber-500/35 border border-amber-300/40 hover:scale-110 active:scale-95 transition-all duration-300 group"
      title="Ver carrito de compras"
      aria-label="Ver carrito de compras"
    >
      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.2] group-hover:rotate-6 transition-transform" />
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 min-w-[22px] sm:min-w-[24px] h-5 sm:h-6 px-1 sm:px-1.5 bg-black text-amber-400 font-black text-[10px] sm:text-xs font-mono rounded-full border-2 border-amber-400 flex items-center justify-center shadow-lg animate-bounce">
          {itemCount}
        </span>
      )}
    </button>
  );
};
