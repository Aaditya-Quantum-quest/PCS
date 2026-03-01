

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Trash2,
  Users,
  Mail,
  Calendar,
  UserCircle,
  Shield,
  AlertCircle,
} from 'lucide-react';

export default function CustomersAdminPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentIsAdmin, setCurrentIsAdmin] = useState(false);

  // Protect route: admin only, and set currentIsAdmin (cookie-based)
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
          setCurrentIsAdmin(isAdmin);
          setChecking(false);
        }
      } catch (err) {
        console.error('Customers admin check failed:', err);
        router.replace('/login');
      }
    };

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Load users list
  useEffect(() => {
    if (checking) return;

    axios
      .get('http://localhost:4000/api/admin/users', {
        withCredentials: true,
      })
      // .then((res) => setUsers(res.data))
      .then((res) => {
        const normalized = res.data.map((u) => ({
          ...u,
          // force to real boolean (handles true/false, "true"/"false", 1/0)
          isAdmin: !!u.isAdmin,
        }));
        setUsers(normalized);
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Failed to load users';
        setErrorMsg(msg);
      });
  }, [checking]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/admin/users/${id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'failed to delete user'
      );
    }
  };

  // Calculate stats from users array
  const totalCustomers = users.length;
  const adminCount = users.filter((u) => u.isAdmin).length;
  const regularCustomers = totalCustomers - adminCount;
  const recentCustomers = users.filter((u) => {
    const createdDate = new Date(u.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;

  const visibleUsers = users;

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

  return (
    <main className="min-h-screen py-40 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-10 h-10 text-purple-400" />
            {currentIsAdmin ? 'Admin Management' : 'Customer Management'}
          </h1>
          <p className="text-purple-300">
            {currentIsAdmin
              ? 'View and manage all admin accounts'
              : 'View and manage your customer base'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
            <p className="text-red-300 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: total */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-300 text-xs uppercase tracking-wider font-semibold">
                  {currentIsAdmin ? 'Total Admins' : 'Total Customers'}
                </p>
                <p className="text-2xl font-bold text-white">
                  {currentIsAdmin ? adminCount : regularCustomers}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: recent customers */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-300 text-xs uppercase tracking-wider font-semibold">
                  New (30 days)
                </p>
                <p className="text-2xl font-bold text-white">
                  {recentCustomers}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: admin count */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-300 text-xs uppercase tracking-wider font-semibold">
                  Admins
                </p>
                <p className="text-2xl font-bold text-white">
                  {adminCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/10">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              {currentIsAdmin ? 'All Admins & Customers' : 'All Customers'}
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                {visibleUsers.length}
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider hidden lg:table-cell">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider hidden lg:table-cell">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visibleUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                          <UserCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white flex items-center gap-2">
                            {u.name}
                            {u.isAdmin && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded border border-amber-500/30">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-purple-400 md:hidden flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-purple-300">
                        <Mail className="w-4 h-4 text-purple-400" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {u.isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30">
                          <Shield className="w-3 h-3" />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          <Users className="w-3 h-3" />
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-purple-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all border border-red-500/30"
                        title="Delete customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleUsers.length === 0 && !errorMsg && (
            <div className="text-center py-16">
              <Users className="w-20 h-20 text-purple-400/50 mx-auto mb-4" />
              <p className="text-xl text-purple-300 mb-2">
                No customers yet
              </p>
              <p className="text-sm text-purple-400">
                Customer accounts will appear here once they register
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
