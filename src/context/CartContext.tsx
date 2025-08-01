'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type CartItem = {
  id: number;
  title: string;
  image_url: string;
  price_per_day: number;
  quantity: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const parsedCart = JSON.parse(stored);
        setCart(parsedCart);
        console.log('Loaded cart from localStorage:', parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Saved cart to localStorage:', cart);
    }
  }, [cart, isLoaded]);

  const addToCart = (item: CartItem) => {
    console.log('Adding to cart:', item);
    setCart((prev) => {
      const newCart = [...prev, item];
      console.log('New cart after adding:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    console.log('Removing from cart:', id);
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    console.log('CLEARING CART - called from:', new Error().stack);
    setCart([]);
    localStorage.removeItem('cart');
    console.log('Cart cleared from both state and localStorage');
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
