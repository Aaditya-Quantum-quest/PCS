
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Image, Users, Receipt, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/section/Sidebar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/gallery', label: 'Gallery', icon: Image },
    { href: '/dashboard/customers', label: 'Customers', icon: Users },
    { href: '/dashboard/orders', label: 'Orders', icon: Receipt },
    { href: '/dashboard/nameplate-orders', label: 'Nameplate Orders', icon: Receipt },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Bar */}
      <Sidebar />
      <div className="fixed top-16 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                    active
                      ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span>{item.label}</span>
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-400 to-pink-400"></div>
                    </div>
                  )}
                  
                  {/* Hover glow effect */}
                  {!active && (
                    <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation - Horizontal Scroll */}
          <nav className="md:hidden flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 flex items-center gap-2 ${
                    active
                      ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Breadcrumb */}
      {/* <div className="fixed top-36 left-0 right-0 z-30 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-purple-400">Dashboard</span>
            {pathname !== '/dashboard' && (
              <>
                <ChevronRight className="w-4 h-4 text-purple-400/50" />
                <span className="text-white font-medium">
                  {navItems.find(item => item.href === pathname)?.label}
                </span>
              </>
            )}
          </div>
        </div>
      </div> */}

      {/* Content Area */}
      <div className="pt-16">
        {children}
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}