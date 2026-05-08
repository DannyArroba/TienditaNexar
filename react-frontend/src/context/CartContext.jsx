import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api';
import Swal from 'sweetalert2';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartApi.get();
      setCart(res.data);
    } catch (err) {
      console.error("Fetch cart failed", err);
    }
  };

  const addToCart = async (product, quantity) => {
    try {
      const res = await cartApi.add(product.id, quantity);
      if (res.data.status === 'success') {
        setCart(res.data.cart);
        // setIsOpen(true); // Opcional: abrir el carrito automáticamente

        // Toast de éxito
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        Toast.fire({
          icon: 'success',
          title: `Añadido: ${product.name} (${quantity})`
        });
      }
    } catch (err) {
      console.error("Add to cart failed", err);
      Swal.fire('Error', 'No se pudo añadir al carrito', 'error');
    }
  };

  const removeFromCart = async (id) => {
    try {
      const res = await cartApi.remove(id);
      if (res.data.status === 'success') {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Remove from cart failed", err);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await cartApi.update(id, quantity);
      if (res.data.status === 'success') {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartApi.clear();
      if (res.data.status === 'success') {
        setCart([]);
      }
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const ivaTotal = cartTotal * 0.15; // IVA al 15%
  const totalWithIva = cartTotal + ivaTotal;

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartTotal, 
      cartCount, 
      ivaTotal,
      totalWithIva,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isOpen,
      setIsOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
