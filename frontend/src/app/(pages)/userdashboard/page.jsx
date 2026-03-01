"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  MapPin,
  Loader2,
  Calendar,
  CreditCard,
  ShoppingBag,
  Image as ImageIcon,
  Phone,
  Mail,
  Palette,
} from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";

import Sidebar from "@/components/section/Sidebar";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nameplateOrders, setNameplateOrders] = useState([]);
  const [loadingNameplates, setLoadingNameplates] = useState(true);

  const params = useParams();
  const orderIdFromUrl = params?.orderId;

  const API_URL = "http://localhost:4000/api";

  // Helper function to get proper image URL
  // const getImageUrl = (imageUrl) => {
  //   if (!imageUrl) return '';

  //   // If it's already a base64 data URI or full URL, return as-is
  //   if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
  //     return imageUrl;
  //   }

  //   // If it's a server path like "/uploads/...", prepend base URL
  //   if (imageUrl.startsWith('/uploads/')) {
  //     return `http://localhost:4000${imageUrl}`;
  //   }

  //   // Fallback
  //   return imageUrl;
  // };


  // ✅ KEEP THIS - Already in your UserDashboard.js
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    // ✅ If it's already a base64 data URI, return as-is
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    // If it's a full URL, return as-is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // If it's a server path like "/uploads/...", prepend base URL
    if (imageUrl.startsWith("/uploads/")) {
      return `http://localhost:4000${imageUrl}`;
    }

    // Fallback
    return imageUrl;
  };


  useEffect(() => {
    fetchUserData();
    // Uncomment below when you want to enable nameplate orders
    fetchNameplateOrders();
  }, []);

  const fetchNameplateOrders = async () => {
    setLoadingNameplates(true);
    try {
      const response = await axios.get(`${API_URL}/nameplateorders`, {
        withCredentials: true, // ✅ sends the cookie
      });

      const orders = Array.isArray(response.data.orders)
        ? response.data.orders
        : Array.isArray(response.data)
          ? response.data
          : [];

      setNameplateOrders(orders);
      console.log("✅ Nameplate orders loaded:", orders.length);
    } catch (error) {
      console.error(
        "❌ Nameplate orders fetch error:",
        error.response?.status,
        error.response?.data || error.message,
      );
      setNameplateOrders([]);
    } finally {
      setLoadingNameplates(false);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Step 1: Get user ID from cookie-based /me endpoint
      const meRes = await fetch('http://localhost:4000/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!meRes.ok) {
        throw new Error('Session expired. Please login again.');
      }

      const meData = await meRes.json();
      const currentUserId = meData.user?._id || meData.user?.id;

      if (!currentUserId) throw new Error('Could not identify user.');

      // ✅ Step 2: Use withCredentials so cookie is sent automatically
      const config = {
        withCredentials: true,
        timeout: 10000,
      };

      const [userRes, ordersRes, addressesRes] = await Promise.all([
        axios.get(`${API_URL}/user/dashboard/users/${currentUserId}`, config),
        axios.get(`${API_URL}/user/dashboard/orders/user/${currentUserId}`, config),
        axios.get(`${API_URL}/user/dashboard/addresses/user/${currentUserId}`, config),
      ]);

      setUserData(userRes.data);
      setOrders(ordersRes.data || []);
      setAddresses(addressesRes.data || []);

    } catch (err) {
      console.error('❌ fetchUserData error:', err.message);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load dashboard',
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTrackOrder = (orderId) => {
    window.open(`/track/${orderId}`, "_blank");
  };

  const handleReorder = async (orderId) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/orders/${orderId}/reorder`,
        {},
        { withCredentials: true }, // ✅
      );
      window.location.href = response.data.redirectUrl || '/cart';
    } catch (error) {
      alert('Reorder failed. Please try again.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order? This cannot be undone.')) return;

    try {
      // ✅ Correct endpoint: /user/dashboard/orders/:orderId/cancel
      const response = await axios.patch(
        `${API_URL}/user/dashboard/orders/${orderId}/cancel`,
        {},
        { withCredentials: true },
      );
      alert(response.data.message || 'Order cancelled successfully!');
      fetchUserData();
      if (nameplateOrders.length > 0) fetchNameplateOrders();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Cancel failed. Please try again.';
      alert(errorMsg);
    }
  };

  // ✅ Remove (hide) a cancelled order from dashboard
  const handleRemoveOrder = async (orderId) => {
    if (!confirm('Remove this cancelled order from your dashboard? This cannot be undone.')) return;

    try {
      await axios.patch(
        `${API_URL}/user/dashboard/orders/${orderId}/hide`,
        {},
        { withCredentials: true },
      );
      // Instantly remove from local state (no need to refetch)
      setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to remove order.';
      alert(errorMsg);
    }
  };



  const handleContactSupport = (order) => {
    window.location.href = "/contactus";
  };

  if (loading || loadingNameplates) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Loading your dashboard...
          </p>
          <p className="text-gray-500">Fetching profile, orders & addresses</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Dashboard Error
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="space-x-3">
            <button
              onClick={() => {
                fetchUserData();
                fetchNameplateOrders();
              }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
      <Sidebar />
      <div className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-20">
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg shrink-0">
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
                Welcome back!
              </h1>
              <p className="text-gray-600 truncate">
                {userData?.name || "User"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-4 bg-linear-to-r from-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Email
                </p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {userData?.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-linear-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Member Since
                </p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                  {formatDate(userData?.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Frame Orders
                </p>
                <p className="text-xl sm:text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {orders.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-linear-to-r from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl">
              <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Nameplate Orders
                </p>
                <p className="text-xl sm:text-2xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {nameplateOrders.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Regular Orders Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 bg-indigo-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  My Frame Orders
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Track your beautiful frames
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-500 mb-2">
                  No orders yet
                </h3>
                <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                  Your custom photo frames and acrylic prints are waiting to be
                  created!
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="group border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-b from-white to-gray-50"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100 gap-3 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <span
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(order.status)}`}
                        >
                          {order.status?.toUpperCase() || "PENDING"}
                        </span>
                        <span
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus?.toUpperCase() || "PENDING"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      {(order.items || order.products)?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                        >
                          <div className="w-full sm:w-24 md:w-32 h-32 shrink-0 bg-gray-100 rounded-xl border-2 border-gray-200 overflow-hidden group">
                            <img
                              src={getImageUrl(item.imageUrl || item.image)}
                              alt={item.name || "Product"}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                // Show solid gray background on error
                                e.target.style.display = "none";
                                e.target.parentElement.className = "w-full sm:w-24 md:w-32 h-32 shrink-0 bg-gray-300 rounded-xl border-2 border-gray-200 flex items-center justify-center";
                                e.target.parentElement.innerHTML = '<ImageIcon className="w-8 h-8 text-gray-400" />';
                              }}
                            />
                          </div>



                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2">
                              {item.name ||
                                item.productName ||
                                `${item.size || "Custom"} ${item.orientation || "Frame"}`}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                              <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                                <span className="text-blue-600 font-semibold block mb-1">
                                  Size
                                </span>
                                <p className="font-medium text-gray-900 truncate">
                                  {item.size || "N/A"}
                                </p>
                              </div>
                              <div className="bg-purple-50 p-2 sm:p-3 rounded-lg">
                                <span className="text-purple-600 font-semibold block mb-1">
                                  Orientation
                                </span>
                                <p className="font-medium text-gray-900 capitalize truncate">
                                  {item.orientation || "N/A"}
                                </p>
                              </div>
                              <div className="bg-emerald-50 p-2 sm:p-3 rounded-lg">
                                <span className="text-emerald-600 font-semibold block mb-1">
                                  Quantity
                                </span>
                                <p className="font-medium text-gray-900">
                                  {item.quantity || 1}
                                </p>
                              </div>
                              <div className="bg-orange-50 p-2 sm:p-3 rounded-lg">
                                <span className="text-orange-600 font-semibold block mb-1">
                                  Material
                                </span>
                                <p className="font-medium text-gray-900 capitalize truncate">
                                  {item.frameMaterial || "N/A"}
                                </p>
                              </div>
                              <div className="bg-pink-50 p-2 sm:p-3 rounded-lg">
                                <span className="text-pink-600 font-semibold block mb-1">
                                  Color
                                </span>
                                <p className="font-medium text-gray-900 truncate">
                                  {item.frameColor || "N/A"}
                                </p>
                              </div>
                              <div className="bg-indigo-50 p-2 sm:p-3 rounded-lg">
                                <span className="text-indigo-600 font-semibold block mb-1">
                                  Thickness
                                </span>
                                <p className="font-medium text-gray-900">
                                  {item.frameThickness
                                    ? `${item.frameThickness}mm`
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col justify-between sm:justify-between items-center sm:items-end gap-4 sm:gap-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                            <div className="text-left sm:text-right">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                Unit Price
                              </p>
                              <p className="text-base sm:text-lg font-semibold text-indigo-600">
                                ₹{item.price?.toFixed(0) || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                Item Total
                              </p>
                              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                ₹
                                {(item.price * (item.quantity || 1)).toFixed(0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-wrap">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <span>{order.paymentMethod || "Card"}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="text-base sm:text-lg text-gray-600 mb-1">
                          Order Total
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ₹{order.amount || order.totalAmount || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-gray-100">
                      {/* ✅ Cancel Order button — visible when order is pending or processing */}
                      {['pending', 'processing'].includes(order.status?.toLowerCase()) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 cursor-pointer"
                        >
                          🚫 Cancel Order
                        </button>
                      )}

                      {/* ✅ Remove button — only for cancelled orders */}
                      {order.status?.toLowerCase() === 'cancelled' && (
                        <button
                          onClick={() => handleRemoveOrder(order._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-all duration-200 cursor-pointer"
                          title="Remove this cancelled order from your dashboard"
                        >
                          🗑️ Remove from Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => handleContactSupport(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                      >
                        Contact Support
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nameplate Orders Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 bg-orange-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  My Nameplate Orders
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Custom nameplate designs
                </p>
              </div>
            </div>

            {nameplateOrders.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <Palette className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-500 mb-2">
                  No nameplate orders yet
                </h3>
                <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                  Create your custom nameplate design today!
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {nameplateOrders.map((order) => (
                  <div
                    key={order._id}
                    className="group border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-b from-white to-orange-50/30"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100 gap-3 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                          Order #{order.orderId}
                        </h3>
                        {/* Product Name Display */}
                        <p className="text-base sm:text-lg font-semibold text-indigo-600 mb-1 truncate">
                          {order.items?.[0]?.name ||
                            order.items?.[0]?.productName ||
                            order.products?.[0]?.name ||
                            order.products?.[0]?.productName ||
                            `${order.items?.[0]?.size || order.products?.[0]?.size || "Custom"} ${order.items?.[0]?.orientation || order.products?.[0]?.orientation || "Frame"}`}
                          {(order.items?.length > 1 || order.products?.length > 1) &&
                            ` +${(order.items?.length || order.products?.length) - 1} more`}
                        </p>
                        <p className="text-sm sm:text-base text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <span
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(order.status)}`}
                        >
                          {order.status?.toUpperCase() || "PENDING"}
                        </span>
                        <span
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus?.toUpperCase() || "PENDING"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 mb-6">
                      <div className="w-full lg:w-64 shrink-0">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Design Preview
                        </p>
                        <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-gray-200 aspect-5/4 flex items-center justify-center">
                          {order.design?.customizedImage ? (
                            <img
                              src={getImageUrl(order.design.customizedImage)}
                              alt="Nameplate Design"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <Palette className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">
                                No preview available
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Customer Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <p>
                              <span className="font-semibold text-gray-800">
                                Name:
                              </span>
                              <span className="text-gray-700 font-medium">
                                {" "}
                                {order.customer?.firstName}{" "}
                                {order.customer?.lastName}
                              </span>
                            </p>

                            <p>
                              <span className="font-semibold text-gray-800">
                                Phone:
                              </span>
                              <span className="text-gray-700 font-medium">
                                {" "}
                                {order.customer?.phone}
                              </span>
                            </p>

                            <p className="sm:col-span-2">
                              <span className="font-semibold text-gray-800">
                                Email:
                              </span>
                              <span className="text-gray-700 font-medium">
                                {" "}
                                {order.customer?.email}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <span className="text-purple-600 font-semibold block mb-1 text-sm">
                              Size
                            </span>
                            <p className="font-bold text-gray-900">
                              {order.size?.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {order.size?.dimensions}
                            </p>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-lg">
                            <span className="text-emerald-600 font-semibold block mb-1 text-sm">
                              Price
                            </span>
                            <p className="font-bold text-gray-900 text-lg">
                              ₹{order.size?.price}
                            </p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <span className="text-orange-600 font-semibold block mb-1 text-sm">
                              Payment
                            </span>
                            <p className="font-bold text-gray-900 uppercase text-sm">
                              {order.payment?.method}
                            </p>
                          </div>
                        </div>

                        {order.shippingAddress && (
                          <div className="bg-linear-to-r from-emerald-50 to-green-50 p-4 rounded-xl">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-emerald-600" />
                              Shipping Address
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {order.shippingAddress.flatHouse},{" "}
                              {order.shippingAddress.areaStreet}
                              <br />
                              {order.shippingAddress.townCity},{" "}
                              {order.shippingAddress.state} -{" "}
                              {order.shippingAddress.pinCode}
                              <br />
                              {order.shippingAddress.country}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3 text-sm text-gray-600"></div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="text-base sm:text-lg text-gray-600 mb-1">
                          Order Total
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                          ₹{order.pricing?.total || order.payment?.amount || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-gray-100">
                      <button
                        onClick={() => handleTrackOrder(order._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200"
                      >
                        Track Order
                      </button>
                      {order.status?.toLowerCase() === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all duration-200"
                        >
                          Cancel Order
                        </button>
                      )}
                      <button
                        onClick={() => handleContactSupport(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all duration-200"
                      >
                        Contact Support
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Addresses Section */}
          {addresses.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 bg-emerald-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Saved Addresses
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    Manage your delivery addresses
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses
                  .filter((address, index, self) => {
                    // Keep only the first occurrence of each unique address
                    return index === self.findIndex(a =>
                      a.name === address.name &&
                      a.phone === address.phone &&
                      a.address === address.address &&
                      a.city === address.city &&
                      a.state === address.state &&
                      a.pincode === address.pincode
                    );
                  })
                  .map((address) => (
                    <div
                      key={address._id}
                      className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">
                            {address.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {address.phone}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                          Default
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {address.address}, {address.city}, {address.state} -{" "}
                        {address.pincode}
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Edit
                        </button>
                        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                          Set Delivery
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
