'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, CheckCircle, X, ShieldCheck, Banknote, CreditCard } from 'lucide-react';
import { useCart } from '@/context/cartContext';

const addressSchema = {
  email: { type: 'string', required: true },
  phone: { type: 'string', required: true },
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  address: { type: 'string', required: true },
  area: { type: 'string', required: true },
  pincode: { type: 'string', required: true, pattern: '^[0-9]{6}$' },
  city: { type: 'string', required: true },
  state: { type: 'string', required: true },
};

// ✅ Load Razorpay SDK script dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

  const [frameCartItems, setFrameCartItems] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'RAZORPAY'

  // ✅ Prefill form with user data from /me endpoint
  useEffect(() => {
    const prefillUserData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        const user = data.user;
        if (!user) return;
        const nameParts = (user.name || '').trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        setFormData(prev => ({
          ...prev,
          email: user.email || prev.email,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          phone: user.phone || prev.phone,
        }));
      } catch (err) {
        console.log('Could not prefill user data:', err.message);
      }
    };
    prefillUserData();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const checkAuthAndLoadCart = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          sessionStorage.setItem('redirectAfterLogin', '/checkout');
          router.push('/login');
          return;
        }
      } catch (error) {
        sessionStorage.setItem('redirectAfterLogin', '/checkout');
        router.push('/login');
        return;
      }
      const token = localStorage.getItem('token');
      const userCartKey = token ? `frameCart_${token.substring(0, 20)}` : 'frameCart_guest';
      const frameCart = JSON.parse(localStorage.getItem(userCartKey) || '[]');
      setFrameCartItems(frameCart);
      setIsAuthChecked(true);
    };
    checkAuthAndLoadCart();
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    area: '',
    pincode: '',
    city: '',
    state: 'Andhra Pradesh',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  const allCartItems = [...cartItems, ...frameCartItems];
  const subtotal = allCartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  const totalItems = allCartItems.length;

  const validateForm = () => {
    for (const [field, schema] of Object.entries(addressSchema)) {
      const value = formData[field];
      if (schema.required && !value.trim()) {
        setError(field.replace(/([A-Z])/g, ' $1').toUpperCase() + ' is required');
        return false;
      }
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
        setError('PIN code must be 6 digits');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const getItemTitle = (item) => {
    if (item.title) return item.title;
    if (item.frameShape) return `Custom ${item.frameShape} Frame`;
    if (item.frameShapeId) return `Custom ${item.frameShapeId.replace('-', ' ').toUpperCase()} Frame`;
    return 'Custom Photo Frame';
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-frame.jpg';
    if (imageUrl.startsWith('data:')) return imageUrl;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/uploads/')) return `http://localhost:4000${imageUrl}`;
    return imageUrl || '/placeholder-frame.jpg';
  };

  // ✅ Clear cart helper
  const clearAllCart = () => {
    clearCart();
    const token = localStorage.getItem('token');
    if (token) localStorage.removeItem(`frameCart_${token.substring(0, 20)}`);
    localStorage.removeItem('frameCart_guest');
    localStorage.removeItem('frameCart');
    setFrameCartItems([]);
  };

  // ✅ Show success and redirect
  const showSuccess = (id) => {
    setOrderId(id);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      router.push(`/order-success?orderId=${id}`);
    }, 2500);
  };

  // =========================================
  // ✅ COD ORDER FLOW
  // =========================================
  const handleCODOrder = async () => {
    console.log('📦 Placing COD order...');
    const response = await fetch('http://localhost:4000/api/orders/direct', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: formData,
        cartItems: allCartItems,
        totalAmount: subtotal,
        paymentMethod: subtotal === 0 ? 'FREE' : 'COD', // Use FREE if it's a 0 rupee order
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }
      throw new Error(errorData?.message || 'Failed to place order');
    }

    const orderData = await response.json();
    console.log('✅ COD Order placed:', orderData);
    clearAllCart();
    showSuccess(orderData.orderId);
  };

  // =========================================
  // ✅ RAZORPAY PAYMENT FLOW
  // =========================================
  const handleRazorpayPayment = async () => {
    console.log('💳 Initiating Razorpay payment...');

    // Load Razorpay SDK
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      throw new Error('Could not load Razorpay. Check your internet connection.');
    }

    // Step 1: Create Razorpay order on backend
    const orderRes = await fetch('http://localhost:4000/api/orders/razorpay/order', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: subtotal,           // in rupees — backend multiplies by 100
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        cartItems: allCartItems,
        customerData: formData,
      }),
    });

    if (!orderRes.ok) {
      const errData = await orderRes.json().catch(() => ({}));
      throw new Error(errData?.error || 'Failed to create payment order');
    }

    const razorpayOrder = await orderRes.json();
    console.log('✅ Razorpay order created:', razorpayOrder.id);

    // Step 2: Open Razorpay Checkout popup
    return new Promise((resolve, reject) => {
      const options = {
        key: 'rzp_live_SLXQywUjNqTbSI',
        amount: razorpayOrder.amount,       // in paise (already from backend)
        currency: razorpayOrder.currency,
        name: 'Prem Color Studio',
        description: `Order for ${totalItems} item${totalItems > 1 ? 's' : ''}`,
        image: '/logo.png',
        order_id: razorpayOrder.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.area}, ${formData.city}`,
        },
        theme: { color: '#ea580c' },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
        handler: async (response) => {
          try {
            console.log('💳 Payment done, verifying...', response);

            // Step 3: Verify payment on backend and save order
            const verifyRes = await fetch('http://localhost:4000/api/orders/verify', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: formData,
                cartItems: allCartItems,
                totalAmount: razorpayOrder.amount,  // in paise
              }),
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json().catch(() => ({}));
              reject(new Error(errData?.error || 'Payment verification failed'));
              return;
            }

            const verifyData = await verifyRes.json();
            console.log('✅ Payment verified, order saved:', verifyData);
            resolve(verifyData.orderId);
          } catch (err) {
            reject(err);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        reject(new Error(response.error?.description || 'Payment failed'));
      });
      rzp.open();
    });
  };

  // =========================================
  // ✅ MAIN PLACE ORDER HANDLER
  // =========================================
  const handlePlaceOrder = async () => {
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (formData.pincode.length !== 6) {
      setError('Please enter a valid 6-digit PIN code');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);
      setError('');

      // ✅ 0 RUPEE EXCEPTION: If order is free, always bypass Razorpay and process as COD/Direct
      if (subtotal === 0) {
        console.log('✅ 0 Rupee order detected — routing as FREE/Direct Order bypass');
        await handleCODOrder();
        return;
      }

      if (paymentMethod === 'RAZORPAY') {
        const confirmedOrderId = await handleRazorpayPayment();
        clearAllCart();
        showSuccess(confirmedOrderId);
      } else {
        await handleCODOrder();
      }

    } catch (err) {
      console.error('Order placement error:', err);
      // Don't show technical error if user just closed the popup
      if (err.message !== 'Payment cancelled by user') {
        setError(err.message || 'Payment failed. Please try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      if (err?.message !== "Payment cancelled by user") {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push(`/order-success?orderId=${orderId}`);
  };

  if (!isClient || !isAuthChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav style={{ fontFamily: "'DM Sans', sans-serif", width: '100%', padding: '28px 32px 0' }} aria-label="Breadcrumb">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <ol style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 500, color: '#7a8499', textDecoration: 'none', padding: '6px 12px', borderRadius: '10px', border: '1px solid transparent' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>
                Home
              </a>
            </li>
            <li><span style={{ color: '#aab4c8', fontSize: '20px', padding: '0 2px', userSelect: 'none', fontWeight: 300 }} aria-hidden="true">›</span></li>
            <li>
              <a href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 500, color: '#7a8499', textDecoration: 'none', padding: '6px 12px', borderRadius: '10px', border: '1px solid transparent' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.79l1.38-9.2H6" /></svg>
                Cart
              </a>
            </li>
            <li><span style={{ color: '#aab4c8', fontSize: '20px', padding: '0 2px', userSelect: 'none', fontWeight: 300 }} aria-hidden="true">›</span></li>
            <li>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, color: '#0f172a', padding: '7px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 2px 8px rgba(99,102,241,0.08)' }} aria-current="page">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                Checkout
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, display: 'inline-block', boxShadow: '0 0 0 3px rgba(99,102,241,0.25)' }} aria-hidden="true" />
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-green-600" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your order!</h2>
              <p className="text-gray-600 mb-2">
                {paymentMethod === 'RAZORPAY' ? '💳 Payment successful!' : '📦 Order placed!'}
              </p>
              <p className="text-sm text-gray-500">Order #{orderId}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Billing Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6 text-black">BILLING &amp; SHIPPING</h2>
              <div className="space-y-4">
                <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className="px-4 py-3 border border-gray-300 rounded focus:outline-none text-black focus:ring-2 focus:ring-orange-500" />
                  <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className="px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="address" placeholder="Flat, House no., Building, Company, Apartment" value={formData.address} onChange={handleChange} className="px-4 py-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <input type="text" name="area" placeholder="Area, Street, Sector, Village" value={formData.area} onChange={handleChange} className="px-4 py-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <input type="text" name="pincode" placeholder="PIN code" value={formData.pincode} onChange={handleChange} maxLength={6} className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <input type="text" name="city" placeholder="Town / City" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <div>
                  <label className="block text-sm text-gray-700 mb-1">State *</label>
                  <select name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500">
                    {indianStates.map((state) => (<option key={state} value={state}>{state}</option>))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary + Payment Method */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-900 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 text-black">YOUR ORDER</h2>

              <div className="space-y-4">
                {allCartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 pb-4 border-b">Your cart is empty.</p>
                ) : (
                  <div className="pb-4 border-b space-y-3">
                    {allCartItems.map((item, index) => (
                      <div key={item.id || item.timestamp || index} className="flex gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={getImageUrl(item.imageUri || item.imageUrl || item.uploadedImageUrl || item.image)}
                            alt={getItemTitle(item)}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/placeholder-frame.jpg'; }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm text-gray-700">{getItemTitle(item)} × {item.quantity || 1}</p>
                            <p className="font-semibold text-black">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            {item.size && <p><span className="font-medium">Size:</span> {item.size}</p>}
                            {item.frameThickness && <p><span className="font-medium">Thickness:</span> {item.frameThickness}mm</p>}
                            {item.frameColor && !item.imageUri && <p><span className="font-medium">Color:</span> {item.frameColor}</p>}
                            {item.orientation && !item.imageUri && <p><span className="font-medium">Orientation:</span> {item.orientation}</p>}
                            {item.finalWidthInch && <p><span className="font-medium">Size:</span> {item.finalWidthInch}x{item.finalHeightInch}" ({item.orientation})</p>}
                            {item.widthCm && !item.finalWidthInch && <p><span className="font-medium">Size:</span> {item.widthCm.toFixed(1)}x{item.heightCm.toFixed(1)}cm</p>}
                            {(item.thicknessMm || item.selectedThickness) && <p><span className="font-medium">Thickness:</span> {(item.thicknessMm || item.selectedThickness)}mm</p>}
                            {item.frameShape && <p><span className="font-medium">Shape:</span> {item.frameShape}</p>}
                            {item.frameShapeId && <p><span className="font-medium">Shape:</span> {item.frameShapeId.replace('-', ' ').toUpperCase()}</p>}
                            {item.frameColor && item.imageUri && <p><span className="font-medium">Frame Color:</span> {item.frameColor}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pb-4 border-b">
                  <p className="font-semibold text-black">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</p>
                  <p className="font-semibold text-black">₹{subtotal.toLocaleString()}</p>
                </div>

                <div className="flex justify-between pb-4 border-b">
                  <p className="font-semibold text-black">Shipping</p>
                  <p className="text-green-600 font-semibold">FREE SHIPPING</p>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <p className="text-xl font-bold text-black">Total</p>
                  <p className="text-2xl font-bold text-black">₹{subtotal.toLocaleString()}</p>
                </div>

                {/* ✅ PAYMENT METHOD SELECTION */}
                <div className="pt-2">
                  <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Select Payment Method</p>
                  <div className="space-y-3">

                    {/* COD Option */}
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === 'COD'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/30'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-orange-600 w-4 h-4"
                      />
                      <Banknote size={22} className={paymentMethod === 'COD' ? 'text-orange-600' : 'text-gray-400'} />
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${paymentMethod === 'COD' ? 'text-orange-700' : 'text-gray-700'}`}>
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-gray-500">Pay when your order arrives</p>
                      </div>
                    </label>

                    {/* Razorpay Option */}
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === 'RAZORPAY'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="RAZORPAY"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        className="accent-indigo-600 w-4 h-4"
                      />
                      <CreditCard size={22} className={paymentMethod === 'RAZORPAY' ? 'text-indigo-600' : 'text-gray-400'} />
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${paymentMethod === 'RAZORPAY' ? 'text-indigo-700' : 'text-gray-700'}`}>
                          Pay Online (Razorpay)
                        </p>
                        <p className="text-xs text-gray-500">Cards, UPI, Net Banking & more</p>
                      </div>
                      {paymentMethod === 'RAZORPAY' && (
                        <ShieldCheck size={16} className="text-green-500 shrink-0" />
                      )}
                    </label>
                  </div>
                </div>

                {/* ✅ PLACE ORDER BUTTON */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || allCartItems.length === 0}
                  className={`w-full font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-white mt-2 ${paymentMethod === 'RAZORPAY'
                    ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400'
                    : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400'
                    }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {paymentMethod === 'RAZORPAY' ? 'Opening Payment...' : 'Placing Order...'}
                    </>
                  ) : (
                    paymentMethod === 'RAZORPAY'
                      ? '💳 Pay with Razorpay'
                      : '🛒 Place Order (COD)'
                  )}
                </button>

                <button
                  className="w-full text-center text-gray-700 cursor-pointer hover:text-gray-900 mt-2 text-sm"
                  onClick={() => router.back()}
                >
                  ← Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}