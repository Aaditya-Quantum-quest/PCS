
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('omgs-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('omgs-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, customization) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.productId === product._id &&
          item.size === customization.size &&
          item.frameColor === customization.frameColor &&
          item.frameMaterial === customization.frameMaterial
      );

      if (existingItemIndex > -1) {
        // Update quantity if same product with same customization exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += customization.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            productId: product._id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: customization.quantity,
            size: customization.size,
            frameColor: customization.frameColor,
            frameMaterial: customization.frameMaterial,
            frameThickness: customization.frameThickness,
            orientation: customization.orientation,
            uploadedImageUrl: customization.uploadedImageUrl,
          },
        ];
      }
    });
    setIsCartOpen(true); // Open cart when item is added
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = newQuantity;
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isCartOpen,
        toggleCart,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
