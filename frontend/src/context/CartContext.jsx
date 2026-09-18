import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shopsphere_cart');
    try {
      return saved ? JSON.parse(saved) : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('shopsphere_wishlist');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync cart and wishlist with backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
      fetchBackendWishlist();
    }
  }, [isAuthenticated]);

  // Persist cart to localStorage for guest or cache
  useEffect(() => {
    localStorage.setItem('shopsphere_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('shopsphere_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const fetchBackendCart = async () => {
    try {
      const res = await api.get('/cart');
      if (res.data && res.data.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.warn('Could not fetch cart from server:', err.message);
    }
  };

  const fetchBackendWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.data && res.data.wishlist) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.warn('Could not fetch wishlist from server:', err.message);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (product.stock <= 0) {
      toast.error('This product is out of stock!');
      return false;
    }

    // Check quantity limit against stock
    const currentItem = cart.items.find(
      (item) => (item.product._id || item.product) === product._id
    );
    const currentQty = currentItem ? currentItem.quantity : 0;
    if (currentQty + quantity > product.stock) {
      toast.error(`Cannot add more. Only ${product.stock} in stock.`);
      return false;
    }

    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await api.post('/cart', {
          productId: product._id,
          quantity
        });
        if (res.data && res.data.cart) {
          setCart(res.data.cart);
          toast.success(`Added ${product.name} to cart!`);
          return true;
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error adding to cart');
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // Local cart fallback for guest
      setCart((prev) => {
        const items = [...prev.items];
        const index = items.findIndex(
          (i) => (i.product._id || i.product) === product._id
        );
        if (index > -1) {
          items[index] = {
            ...items[index],
            quantity: items[index].quantity + quantity
          };
        } else {
          items.push({
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              discountPrice: product.discountPrice,
              brand: product.brand,
              image: product.image,
              stock: product.stock
            },
            quantity
          });
        }
        return { ...prev, items };
      });
      toast.success(`Added ${product.name} to cart!`);
      return true;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    if (isAuthenticated) {
      try {
        const res = await api.put(`/cart/${productId}`, { quantity });
        if (res.data && res.data.cart) {
          setCart(res.data.cart);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error updating quantity');
      }
    } else {
      setCart((prev) => {
        const items = prev.items.map((item) => {
          const id = item.product._id || item.product;
          if (id === productId) {
            return { ...item, quantity };
          }
          return item;
        });
        return { ...prev, items };
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/${productId}`);
        if (res.data && res.data.cart) {
          setCart(res.data.cart);
          toast.info('Item removed from cart');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error removing item');
      }
    } else {
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (i) => (i.product._id || i.product) !== productId
        )
      }));
      toast.info('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.warn('Error clearing cart on server:', err.message);
      }
    }
    setCart({ items: [] });
  };

  const addToWishlist = async (product) => {
    if (isInWishlist(product._id)) {
      toast.info('Product is already in your wishlist');
      return;
    }

    if (isAuthenticated) {
      try {
        const res = await api.post(`/wishlist/${product._id}`);
        if (res.data && res.data.wishlist) {
          setWishlist(res.data.wishlist);
          toast.success('Added to wishlist!');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error adding to wishlist');
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      toast.success('Added to wishlist!');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/wishlist/${productId}`);
        if (res.data && res.data.wishlist) {
          setWishlist(res.data.wishlist);
          toast.info('Removed from wishlist');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error removing from wishlist');
      }
    } else {
      setWishlist((prev) =>
        prev.filter((p) => (p._id || p) !== productId)
      );
      toast.info('Removed from wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  // Cart total & item count computations
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.items.reduce((sum, item) => {
    const prod = item.product;
    if (!prod) return sum;
    const price = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshCart: fetchBackendCart
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
