import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (menuItem, quantity = 1, specialInstructions = '') => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.menuItem._id === menuItem._id && 
        item.specialInstructions === specialInstructions
      );

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.menuItem._id === menuItem._id && item.specialInstructions === specialInstructions
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, {
          menuItem,
          quantity,
          specialInstructions,
          price: menuItem.price
        }];
      }
    });
    
    toast.success(`${menuItem.name} added to cart!`);
  };

  const removeFromCart = (menuItemId, specialInstructions = '') => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.menuItem._id === menuItemId && item.specialInstructions === specialInstructions)
      )
    );
    toast.success('Item removed from cart');
  };

  const updateQuantity = (menuItemId, specialInstructions, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId, specialInstructions);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItem._id === menuItemId && item.specialInstructions === specialInstructions
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const getDeliveryFee = (orderType, restaurant) => {
    return orderType === 'delivery' ? (restaurant?.deliveryFee || 5.99) : 0;
  };

  const getOrderTotal = (orderType, restaurant, tip = 0) => {
    const subtotal = getCartTotal();
    const tax = getTax(subtotal);
    const deliveryFee = getDeliveryFee(orderType, restaurant);
    return subtotal + tax + deliveryFee + tip;
  };

  // Check if cart has items from different restaurants (not needed for single restaurant)
  const hasMultipleRestaurants = () => {
    return false; // Always false for single restaurant
  };

  // Get the restaurant ID from cart items (not needed for single restaurant)
  const getCartRestaurantId = () => {
    return 'single-restaurant'; // Static ID for single restaurant
  };

  const value = {
    cartItems,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getTax,
    getDeliveryFee,
    getOrderTotal,
    hasMultipleRestaurants,
    getCartRestaurantId
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};