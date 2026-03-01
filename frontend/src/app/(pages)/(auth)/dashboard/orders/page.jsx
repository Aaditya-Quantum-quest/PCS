'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Receipt,
  User,
  Mail,
  Package,
  Calendar,
  IndianRupee,
  CheckCircle,
  Clock,
  TrendingUp,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersAdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          router.replace('/login');
          return;
        }

        const data = await res.json();
        const isAdmin = !!data.user?.isAdmin;

        if (typeof window !== 'undefined') {
          localStorage.setItem('isAdmin', String(isAdmin));
        }

        if (!isAdmin) {
          router.replace('/');
          return;
        }

        if (!cancelled) {
          setChecking(false);
        }
      } catch (err) {
        console.error('Orders admin check failed:', err);
        router.replace('/login');
      }
    };

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (checking) return;
    loadOrders();
  }, [checking]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/admin/orders', {
        withCredentials: true,
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
      setErrorMsg('');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load orders';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm.trim()) {
      filtered = filtered.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.user?.name?.toLowerCase().includes(searchLower) ||
          order.user?.email?.toLowerCase().includes(searchLower) ||
          order._id?.toLowerCase().includes(searchLower)
        );
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order =>
        (order.status || 'pending').toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      setErrorMsg('');

      await axios.patch(
        `http://localhost:4000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
      setFilteredOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, status: newStatus } : o
      ));

    } catch (err) {
      console.error('Status update error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to update status';
      setErrorMsg(msg);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this order? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(orderId);
      setErrorMsg('');

      await axios.delete(`http://localhost:4000/api/admin/orders/${orderId}`, {
        withCredentials: true,
      });

      setOrders(prev => prev.filter(o => o._id !== orderId));
      setFilteredOrders(prev => prev.filter(o => o._id !== orderId));

    } catch (err) {
      console.error('Delete error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to delete order';
      setErrorMsg(msg);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          router.replace('/login');
        }, 2000);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter(o => (o.status || 'pending').toLowerCase() === 'pending').length;

  const getStatusColor = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    if (statusLower === 'delivered') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (statusLower === 'shipped') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (statusLower === 'processing') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (statusLower === 'paid') return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (statusLower === 'cancelled') return 'bg-red-500/20 text-red-300 border-red-500/30';
    return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  };

  const getStatusIcon = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    if (statusLower === 'delivered' || statusLower === 'paid') {
      return <CheckCircle className="w-3 h-3" />;
    }
    return <Clock className="w-3 h-3" />;
  };

  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'].join(','),
      ...filteredOrders.map(o => [
        o._id,
        o.user?.name || 'Unknown',
        o.user?.email || 'N/A',
        o.totalAmount || 0,
        o.status || 'pending',
        o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-purple-200 mt-4 font-medium">Checking permissions...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-10 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Receipt className="w-10 h-10 text-purple-400" />
              Frame Orders Management
            </h1>
            <p className="text-purple-300">Track and manage customer orders</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadOrders}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={exportOrders}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
            <p className="text-red-300 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Stats Cards */}
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
                <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
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

        {/* Search and Filter Bar */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search by customer name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Orders</option>
                <option value="pending" className="bg-slate-800">Pending</option>
                <option value="paid" className="bg-slate-800">Paid</option>
                <option value="processing" className="bg-slate-800">Processing</option>
                <option value="shipped" className="bg-slate-800">Shipped</option>
                <option value="delivered" className="bg-slate-800">Delivered</option>
                <option value="cancelled" className="bg-slate-800">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-purple-300">
            Showing <span className="font-semibold text-white">{filteredOrders.length}</span> of <span className="font-semibold text-white">{totalOrders}</span> orders
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/10">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Receipt className="w-6 h-6 text-purple-400" />
              Frame Orders
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                {filteredOrders.length}
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                <p className="text-purple-200 mt-4 font-medium">Loading orders...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider hidden lg:table-cell">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((o, index) => (
                    <tr key={o._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${o._id}`} className="block">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-300 font-bold text-sm border border-purple-500/30">
                              {index + 1}
                            </div>
                          </div>
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${o._id}`} className="block">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {o.user?.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-purple-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" />
                                {o.user?.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>

                      <td className="px-6 py-4 hidden lg:table-cell">
                        <Link href={`/dashboard/orders/${o._id}`} className="block">
                          <div className="flex items-start gap-2 text-purple-300 text-sm">
                            <Package className="w-4 h-4 mt-0.5 shrink-0" />
                            <div>
                              {o.items?.length > 0 ? (
                                o.items.slice(0, 2).map((it, i) => (
                                  <div key={i} className="mb-1">
                                    <span className="font-medium text-white">
                                      {it.productName || it.product?.name || it.product?.title || 'Custom Frame'}
                                    </span>
                                    {' '}
                                    <span className="text-purple-400">x{it.quantity}</span>
                                    {(it.size || it.frameMaterial) && (
                                      <span className="text-xs text-purple-500 ml-1">
                                        ({it.size || ''} {it.frameMaterial || ''})
                                      </span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-purple-500">No items</span>
                              )}
                              {o.items?.length > 2 && (
                                <div className="text-purple-500 text-xs">
                                  +{o.items.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${o._id}`} className="block">
                          <span className="text-xl font-bold text-emerald-400">
                            ₹{(o.totalAmount || 0).toLocaleString()}
                          </span>
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <div onClick={(e) => e.stopPropagation()}>
                          <select
                            value={o.status || 'pending'}
                            onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                            disabled={updatingStatus === o._id}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer
                              ${getStatusColor(o.status)}
                              ${updatingStatus === o._id ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
                              bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value="pending" className="bg-slate-800">Pending</option>
                            <option value="paid" className="bg-slate-800">Paid</option>
                            <option value="processing" className="bg-slate-800">Processing</option>
                            <option value="shipped" className="bg-slate-800">Shipped</option>
                            <option value="delivered" className="bg-slate-800">Delivered</option>
                            <option value="cancelled" className="bg-slate-800">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      <td className="px-6 py-4 hidden md:table-cell">
                        <Link href={`/dashboard/orders/${o._id}`} className="block">
                          <div className="flex items-center gap-2 text-purple-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {o.createdAt
                              ? new Date(o.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                              : 'N/A'}
                          </div>
                          {o.createdAt && (
                            <div className="text-xs text-purple-500 ml-6 mt-1">
                              {new Date(o.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          )}
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <div onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDeleteOrder(o._id)}
                            disabled={deletingId === o._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
                               bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {deletingId === o._id ? (
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
            )}
          </div>

          {filteredOrders.length === 0 && !loading && !errorMsg && (
            <div className="text-center py-16">
              <Receipt className="w-20 h-20 text-purple-400/50 mx-auto mb-4" />
              <p className="text-xl text-purple-300 mb-2">No orders found</p>
              <p className="text-sm text-purple-400">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Orders will appear here once customers start purchasing'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
