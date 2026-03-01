'use client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const AddToCartButton = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    addToCart(product);    // ✅ Save to cart
    router.push('/cart');  // ✅ Go to cart page
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full max-w-sm px-6 py-3.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      Add to Cart
    </button>
  );
};

export default AddToCartButton;