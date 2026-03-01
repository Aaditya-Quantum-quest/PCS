'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Users,
  Package,
  Receipt,
  IndianRupee,
  TrendingUp,
  Activity,
} from 'lucide-react';

export default function DashboardOverview() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    nameplateOrders: 0,
    products: 0,
    revenue: 0,
  });

  const [quickStats, setQuickStats] = useState({
    avgOrderValue: 0,
    ordersPerCustomer: 0,
  });

  const [performance, setPerformance] = useState({
    revenuePerProduct: 0,
    catalogUtilization: 0,
  });

  /* ============================
     ADMIN ROUTE PROTECTION
     ============================ */
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
        console.error('Dashboard admin check failed:', err);
        router.replace('/login');
      }
    };

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  /* ============================
     LOAD DASHBOARD STATS
     ============================ */
  useEffect(() => {
    if (checking) return;

    async function loadStats() {
      try {
        const requests = [
          axios.get('http://localhost:4000/api/admin/users', {
            withCredentials: true,
          }),
          axios.get('http://localhost:4000/api/admin/orders', {
            withCredentials: true,
          }),
          axios.get('http://localhost:4000/api/admin/products', {
            withCredentials: true,
          }),
          axios.get('http://localhost:4000/api/admin/nameplate-orders', {
            withCredentials: true,
          }),
        ];

        const [
          usersRes,
          ordersRes,
          productsRes,
          nameplateOrdersRes,
        ] = await Promise.allSettled(requests);

        const users =
          usersRes.status === 'fulfilled'
            ? usersRes.value.data.length
            : 0;

        const orders =
          ordersRes.status === 'fulfilled'
            ? ordersRes.value.data.length
            : 0;

        const products =
          productsRes.status === 'fulfilled'
            ? productsRes.value.data.length
            : 0;

        const nameplateOrders =
          nameplateOrdersRes.status === 'fulfilled'
            ? nameplateOrdersRes.value.data.length
            : 0;

        // 💰 Revenue calculation (NORMAL + NAMEPLATE)
        const normalRevenue =
          ordersRes.status === 'fulfilled'
            ? ordersRes.value.data.reduce(
              (sum, o) => sum + (o.totalAmount || 0),
              0
            )
            : 0;

        const nameplateRevenue =
          nameplateOrdersRes.status === 'fulfilled'
            ? nameplateOrdersRes.value.data.reduce(
              (sum, o) => sum + (o.pricing?.total || 0),
              0
            )
            : 0;

        const revenue = normalRevenue + nameplateRevenue;
        const totalOrders = orders + nameplateOrders;

        setStats({
          users,
          orders,
          nameplateOrders,
          products,
          revenue,
        });

        // ============================
        // CALCULATE QUICK STATS
        // ============================
        const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
        const ordersPerCustomer = users > 0 ? totalOrders / users : 0;

        setQuickStats({
          avgOrderValue,
          ordersPerCustomer,
        });

        // ============================
        // CALCULATE PERFORMANCE METRICS
        // ============================
        const revenuePerProduct = products > 0 ? revenue / products : 0;

        // Catalog Utilization: percentage of products that have been ordered
        let productsOrdered = 0;
        if (ordersRes.status === 'fulfilled') {
          const uniqueProducts = new Set();
          ordersRes.value.data.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach(item => {
                if (item.productId) {
                  uniqueProducts.add(item.productId);
                }
              });
            }
          });
          productsOrdered = uniqueProducts.size;
        }

        const catalogUtilization = products > 0 ? (productsOrdered / products) * 100 : 0;

        setPerformance({
          revenuePerProduct,
          catalogUtilization,
        });
      } catch (err) {
        setErrorMsg(
          err.response?.data?.message ||
          err.message ||
          'Failed to load dashboard stats'
        );
      }
    }

    loadStats();
  }, [checking]);

  /* ============================
     LOADING SCREEN
     ============================ */
  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
          <p className="text-purple-200 mt-4 font-medium">
            Checking permissions...
          </p>
        </div>
      </main>
    );
  }

  /* ============================
     DASHBOARD UI
     ============================ */
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-purple-300 text-sm mt-1">
                Welcome back! Here's your business overview
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-300 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Main Stats Grid - 4 Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            icon={Users}
            label="Total Customers"
            value={stats.users}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Package}
            label="Active Products"
            value={stats.products}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={Receipt}
            label="Total Orders"
            value={stats.orders + stats.nameplateOrders}
            color="from-orange-500 to-amber-500"
          />
          <StatCard
            icon={IndianRupee}
            label="Total Revenue"
            value={`₹${stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            color="from-pink-500 to-rose-500"
          />
        </div>

        {/* Quick Stats and Performance - 2 Cards Side by Side */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Stats Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Quick Stats</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-purple-300 text-sm">Avg. Order Value</span>
                <span className="text-2xl font-bold text-white">
                  ₹{quickStats.avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-purple-300 text-sm">Orders per Customer</span>
                <span className="text-2xl font-bold text-white">
                  {quickStats.ordersPerCustomer.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Performance</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-purple-300 text-sm">Revenue per Product</span>
                <span className="text-2xl font-bold text-white">
                  ₹{performance.revenuePerProduct.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-purple-300 text-sm">Catalog Utilization</span>
                <span className="text-2xl font-bold text-white">
                  {performance.catalogUtilization.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============================
   STAT CARD COMPONENT
   ============================ */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-300 text-xs uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-white">
            {value}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}