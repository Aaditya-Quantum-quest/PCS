
'use client';


import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Calendar, Trash2, Eye, Package, Receipt, IndianRupee, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [checking, setChecking] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!token) {
      window.location.href = '/login';
      return;
    }
    if (!isAdmin) {
      window.location.href = '/';
      return;
    }
    setChecking(false);
  }, []);

  // Load orders from API
  useEffect(() => {
    if (checking) return;
    loadOrders();
  }, [checking]);

  const loadOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:4000/api/admin/nameplate-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data = await response.json();
      setOrders(data);
      setErrorMsg('');
    } catch (err) {
      const msg = err.message || 'Failed to load orders';
      setErrorMsg(msg);
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter(o => (o.status || 'pending').toLowerCase() === 'pending').length;

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(query) ||
        order.customer?.email?.toLowerCase().includes(query) ||
        order.customer?.firstName?.toLowerCase().includes(query) ||
        order.customer?.lastName?.toLowerCase().includes(query) ||
        order.customer?.phone?.includes(query) ||
        order._id?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order =>
        (order.status || 'pending').toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-desc':
          return (b.pricing?.total || 0) - (a.pricing?.total || 0);
        case 'price-asc':
          return (a.pricing?.total || 0) - (b.pricing?.total || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchQuery, statusFilter, sortBy]);

  const handleDelete = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('Not authorized - please log in again');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(orderId);
      setErrorMsg('');

      const response = await fetch(`http://localhost:4000/api/admin/nameplate-orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      // Remove from local state
      setOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (err) {
      console.error('Delete error:', err);
      const msg = err.message || 'Failed to delete order';
      setErrorMsg(msg);

      // If unauthorized, redirect to login
      if (err.message.includes('401') || err.message.includes('403')) {
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');

    try {
      setUpdatingStatusId(orderId);
      setErrorMsg('');

      const response = await fetch(`http://localhost:4000/api/admin/nameplate-orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();

      // Update local state
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, status: newStatus } : o
      ));

      // Show success message briefly
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 z-50';
      successDiv.innerHTML = `
      <p class="text-emerald-200 flex items-center gap-2">
        <span>✅</span> Status updated & email sent to customer!
      </p>
    `;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);

    } catch (err) {
      console.error('Status update error:', err);
      setErrorMsg('Failed to update order status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    if (statusLower === 'completed' || statusLower === 'delivered' || statusLower === 'paid') {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
    }
    if (statusLower === 'processing' || statusLower === 'shipped') {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
    if (statusLower === 'cancelled' || statusLower === 'failed') {
      return 'bg-red-500/20 text-red-300 border-red-500/50';
    }
    return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
  };

  const getStatusIcon = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    if (statusLower === 'completed' || statusLower === 'delivered' || statusLower === 'paid') {
      return <CheckCircle className="w-3 h-3" />;
    }
    return <Clock className="w-3 h-3" />;
  };

  // Loading state
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-purple-200 mt-4 font-medium">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-10 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">


        {/* Header */}
        <div className='mb-8'>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Receipt className="w-10 h-10 text-purple-400" />
            Name Plate Orders Management
          </h1>
          <p className="text-purple-300">Track and manage customer orders</p>
        </div>


        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
            <p className="text-red-200">{errorMsg}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-300 text-xs uppercase tracking-wider font-semibold">Total Orders</p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-300 text-xs uppercase tracking-wider font-semibold">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-300 text-xs uppercase tracking-wider font-semibold">Avg Order Value</p>
                <p className="text-2xl font-bold text-white">₹{avgOrderValue.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-300 text-xs uppercase tracking-wider font-semibold">Pending Orders</p>
                <p className="text-2xl font-bold text-white">{pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search by customer name, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-purple-900">All Orders</option>
                <option value="pending" className="bg-purple-900">Pending</option>
                <option value="processing" className="bg-purple-900">Processing</option>
                <option value="completed" className="bg-purple-900">Completed</option>
                <option value="cancelled" className="bg-purple-900">Cancelled</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none cursor-pointer"
              >
                <option value="date-desc" className="bg-purple-900">Latest First</option>
                <option value="date-asc" className="bg-purple-900">Oldest First</option>
                <option value="price-desc" className="bg-purple-900">Price: High to Low</option>
                <option value="price-asc" className="bg-purple-900">Price: Low to High</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-purple-200">
            Showing <span className="font-semibold text-white">{filteredOrders.length}</span> of <span className="font-semibold text-white">{orders.length}</span> orders
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border-b border-white/10">
            <Package className="w-5 h-5 text-purple-300" />
            <h2 className="text-xl font-bold text-white">Name Plate Orders</h2>
            <span className="ml-auto bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-400/50">
              {filteredOrders.length}
            </span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
              <p className="text-purple-200">Loading orders...</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredOrders.map((order, index) => (
                      <tr key={order._id} className="hover:bg-white/5 transition-colors">
                        {/* Serial Number */}
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/nameplate-orders/${order._id}`} className="block">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/nameplate-orders/${order._id}`} className="block">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-400 to-blue-400 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {order.customer?.firstName?.[0] || 'U'}{order.customer?.lastName?.[0] || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="text-white font-medium">
                                  {order.customer?.firstName || 'Unknown'} {order.customer?.lastName || 'User'}
                                </div>
                                <div className="text-purple-300 text-sm">{order.customer?.email || 'No email'}</div>
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4">

                          <Link href={`/dashboard/nameplate-orders/${order._id}`} className="block">

                            <div className="flex items-center gap-2 text-white">
                              <Package className="w-4 h-4 text-purple-300" />
                              <span className="font-medium">{order.items?.[0]?.name || 'Nameplate'}</span>
                              {order.items && order.items.length > 1 && (
                                <span className="text-purple-300 text-sm">+{order.items.length - 1}</span>
                              )}
                            </div>
                          </Link>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <div className="text-green-400 font-bold text-lg">
                            ₹{(order.pricing?.total || 0).toLocaleString('en-IN')}
                          </div>
                        </td>

                        {/* Status */}
                        {/* Status */}
                        <td className="px-6 py-4">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingStatusId === order._id}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${getStatusColor(order.status)} disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending" className="bg-purple-900">Pending</option>
                            <option value="confirmed" className="bg-purple-900">Confirmed</option>
                            <option value="processing" className="bg-purple-900">Processing</option>
                            <option value="shipped" className="bg-purple-900">Shipped</option>
                            <option value="delivered" className="bg-purple-900">Delivered</option>
                            <option value="cancelled" className="bg-purple-900">Cancelled</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <Calendar className="w-4 h-4 text-purple-300" />
                            <div>
                              <div className="font-medium">{formatDate(order.createdAt)}</div>
                              <div className="text-purple-300 text-sm">{formatTime(order.createdAt)}</div>
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(order._id)}
                              disabled={deletingId === order._id}
                              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              {deletingId === order._id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></div>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredOrders.length === 0 && !loading && (
                <div className="py-16 text-center">
                  <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
                  <p className="text-purple-300">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersDashboard;