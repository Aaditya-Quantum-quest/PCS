'use client';

import { Check, Home, Package, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/section/Sidebar'; 

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get order details from URL params
    const orderId = searchParams.get('orderId');
    const total = searchParams.get('total');

    // Or retrieve from localStorage
    const pendingOrder = localStorage.getItem('pendingOrder');

    if (pendingOrder) {
      const order = JSON.parse(pendingOrder);
      setOrderDetails({
        orderId: orderId || order.orderId || 'N/A',
        total: total || order.size?.price || 0,
        size: order.size,
        customer: order.shipping,
        image: order.image
      });

      // Clear the pending order after displaying
      localStorage.removeItem('pendingOrder');
    } else if (orderId && total) {
      setOrderDetails({
        orderId,
        total,
      });
    }
  }, [searchParams]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleViewOrders = () => {
    window.location.href = '/userdashboard'; // Update with your orders page route
  };

  return (
    <div className="min-h-screen mt-8 bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Sidebar />
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 rounded-full p-4 animate-bounce">
            <Check className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll start working on your custom nameplate right away!
          </p>
        </div>

        {/* Order Details Card */}
        {orderDetails && (
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Package className="w-5 h-5" />
                <span className="font-semibold text-lg">Order Details</span>
              </div>
            </div>

            {/* Order ID and Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="font-bold text-gray-900 text-lg">{orderDetails.orderId}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="font-bold text-green-600 text-2xl">₹{orderDetails.total}</p>
              </div>
            </div>

            {/* Size Details */}
            {orderDetails.size && (
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <p className="text-xs text-gray-500 mb-2">Selected Size</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{orderDetails.size.name}</span>
                  <span className="text-sm text-gray-600">{orderDetails.size.dimensions}</span>
                </div>
              </div>
            )}

            {/* Preview Image */}
            {orderDetails.image && (
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <p className="text-xs text-gray-500 mb-3">Your Design</p>
                <img
                  src={orderDetails.image}
                  alt="Your custom nameplate design"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Customer Details */}
            {orderDetails.customer && (
              <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
                <p className="text-xs text-gray-500 mb-2">Shipping Details</p>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{orderDetails.customer.firstName} {orderDetails.customer.lastName}</p>
                    <p className="text-gray-600">{orderDetails.customer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-sm text-gray-900 font-medium">{orderDetails.customer.phone}</p>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p>{orderDetails.customer.flatHouse}, {orderDetails.customer.areaStreet}</p>
                    <p>{orderDetails.customer.townCity}, {orderDetails.customer.state} - {orderDetails.customer.pinCode}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800 text-sm mb-1">Email Confirmation Sent</p>
              <p className="text-xs text-yellow-700">
                We've sent a confirmation email with your order details and tracking information.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleViewOrders}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            View Orders
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <CreditCard className="w-4 h-4" />
            <span className="font-semibold text-sm">Payment Method</span>
          </div>
          <p className="text-sm text-gray-600">Cash on Delivery (COD)</p>
          <p className="text-xs text-gray-500 mt-1">Pay when your order arrives</p>
        </div>

        {/* Support Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{' '}
            <a
              href="mailto:support@premcolorlab.com"
              className="text-blue-600 hover:underline font-medium"
            >
              support@premcolorlab.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
