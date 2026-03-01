'use client';
import { useState } from 'react';
import { Home } from 'lucide-react';
import Breadcrumbs from '@/components/section/Breadcrumbs';

const addressSchema = {
  email: { type: 'string', required: true },
  phone: { type: 'string', required: true },
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  address: { type: 'string', required: true },
  area: { type: 'string', required: true },
  pincode: { type: 'string', required: true, pattern: '^[0-9]{6}$' },
  city: { type: 'string', required: true },
  state: { type: 'string', required: true }
};

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    area: '',
    pincode: '',
    city: '',
    state: 'Andhra Pradesh'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    for (const [field, schema] of Object.entries(addressSchema)) {
      const value = formData[field];
      if (schema.required && !value.trim()) {
        setError(`${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/save-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          orderId: `ORD-${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      const result = await response.json();
      console.log('Address saved:', result);
      alert('Address saved successfully! Proceeding to payment...');

      // Optionally redirect to payment page
      // window.location.href = '/payment';

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs />
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Login and Coupon Links */}
        {/* <div className="mb-6 space-y-2">
          <p className="text-sm text-gray-700">
            Returning customer? <button className="text-blue-600 hover:underline">Click here to login</button>
          </p>
          <p className="text-sm text-gray-700">
            Have a coupon? <button className="text-blue-600 hover:underline">Click here to enter your code</button>
          </p>
        </div> */}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing & Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">BILLING & SHIPPING</h2>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* First and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Address and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Flat, House no., Building, Company, Apartment"
                    value={formData.address}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    name="area"
                    placeholder="Area, Street, Sector, Village"
                    value={formData.area}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* PIN Code */}
                <div>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN code"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* City */}
                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="Town / City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-900 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 text-black">YOUR ORDER</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b">
                  <div className="flex-1">
                    <p className="font-semibold">PRODUCT</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">SUBTOTAL</p>
                  </div>
                </div>

                {/* Product Item */}
                <div className="pb-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-700">Portrait Acrylic Wall Photo × 1</p>
                    <p className="font-semibold">₹699</p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Size (Inch):</span> 12x9</p>
                    <p><span className="font-medium">Thickness (mm):</span> 3mm</p>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between pb-4 border-b">
                  <p className="font-semibold">Subtotal</p>
                  <p className="font-semibold">₹699</p>
                </div>

                {/* Shipping */}
                <div className="flex justify-between pb-4 border-b">
                  <p className="font-semibold">Shipping</p>
                  <p className="text-green-600 font-semibold">FREE SHIPPING</p>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4">
                  <p className="text-xl font-bold">Total</p>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹699</p>
                    <p className="text-xs text-gray-600">(includes ₹107 18% IGST)</p>
                  </div>
                </div>

                {/* Continue to Payment Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>

                {/* Back to Cart Link */}
                <button className="w-full text-left text-gray-700 hover:text-gray-900 mt-4">
                  &lt; Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
