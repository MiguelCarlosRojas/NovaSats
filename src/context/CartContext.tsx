import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types/store';
import { getCookie, setCookie, removeCookie } from '../lib/cookieSession';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalUsd: number;
  totalBtc: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = getCookie('novasats_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      setCookie('novasats_cart', JSON.stringify(cart), 7);
    } else {
      removeCookie('novasats_cart');
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1): boolean => {
    if (product.stock <= 0) return false;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
    return true;
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // La eliminación solo se realiza explícitamente mediante los botones de basura (removeFromCart)
    const validQuantity = Math.max(1, quantity);
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(validQuantity, item.product.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalUsd = cart.reduce(
    (sum, item) => sum + Number(item.product.price_usd) * item.quantity,
    0
  );

  const totalBtc = cart.reduce(
    (sum, item) => sum + Number(item.product.price_btc) * item.quantity,
    0
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalUsd,
        totalBtc,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
