'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cartContext';
import { X, ShoppingBag, Trash2 } from 'lucide-react';

export default function CartSidebar() {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Cart ({getTotalItems()})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <img
                    src={item.uploadedImageUrl || item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.size}" • {item.frameColor}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-bold text-amber-600">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700 self-start"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 space-y-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="bg-linear-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                ₹{getTotalPrice().toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                router.push('/cart');
              }}
              className="w-full py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transition transform"
            >
              View Cart & Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
