
'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ShoppingCart,
  User,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/cartContext';

export default function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false); // ✅ FIXED: Added missing state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { getTotalItems } = useCart();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check token on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleProfileClick = () => {
    router.push('/userdashboard');  
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // Clear all frameCart keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('frameCart')) {
          localStorage.removeItem(key);
        }
      });
      // Dispatch custom logout event
      window.dispatchEvent(new Event('userLogout'));
      localStorage.removeItem('token');
    }
    setIsLoggedIn(false);
    router.replace('/login');
  };

  const handleContactNavigation = () => {
    router.push('/contactus');
  };

  const productCategories = [
    {
      title: 'ALL FRAMES',
      items: [
        'Acrylic Photo',
        'Clear Acrylic Photo',
        'Acrylic Wall Clock',
        'Framed Acrylic Photo',
        'Collage Acrylic Photo',
        'Acrylic Fridge Magnets',
        'Acrylic Cutout',
        'Acrylic Desk Photo',
        'Acrylic KeyChains',
        'Acrylic Monogram',
        'Miniphoto Gallery',
      ],
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-110 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-white shadow-md'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="relative w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">P</span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent hidden sm:block">
                Prem Color Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-600 px-4 py-2 text-sm font-medium transition-all hover:bg-orange-50 rounded-lg"
            >
              Home
            </Link>

            {/* Products Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button className="text-gray-700 hover:text-orange-600 px-4 py-2 text-sm font-medium transition-all hover:bg-orange-50 rounded-lg flex items-center gap-1 group">
                Products
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              <div
                className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-[800px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 ${isProductsOpen
                  ? 'opacity-100 translate-y-0 visible'
                  : 'opacity-0 -translate-y-4 invisible'
                  }`}
              >
                <div className="relative bg-linear-to-br from-orange-50 via-orange-50 to-amber-50 p-8">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />

                  {productCategories.map((category, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-linear-to-r from-transparent to-orange-300" />
                        <h3 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent tracking-wide">
                          {category.title}
                        </h3>
                        <div className="h-px w-12 bg-linear-to-l from-transparent to-orange-300" />
                      </div>

                      <ul className="grid grid-cols-3 gap-x-8 gap-y-3">
                        {category.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              href={`/products/${item
                                .toLowerCase()
                                .replace(/\s+/g, '-')}`}
                              className="group/item text-sm text-gray-700 hover:text-orange-600 inline-flex items-center gap-2 transition-all duration-300 hover:translate-x-2 relative"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                              <span className="font-medium">{item}</span>
                              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-linear-to-r from-orange-600 to-orange-500 group-hover/item:w-full transition-all duration-300" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="mt-8 pt-6 border-t border-orange-200/50">
                    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Need help finding something?
                        </p>
                      </div>
                      <button
                        className="px-6 py-2.5 bg-linear-to-r from-orange-600 to-orange-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 hover:from-orange-700 hover:to-orange-600"
                        onClick={handleContactNavigation}
                      >
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/contactus"
              className="text-gray-700 hover:text-orange-600 px-4 py-2 text-sm font-medium transition-all hover:bg-orange-50 rounded-lg"
            >
              Contact Us
            </Link>

            <Link
              href="/aboutus"
              className="text-gray-700 hover:text-orange-600 px-4 py-2 text-sm font-medium transition-all hover:bg-orange-50 rounded-lg"
            >
              About
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <button
              className="relative p-2 cursor-pointer text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all group"
              onClick={() => router.push('/cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Login / Logout (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <button
                    className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium text-sm transition-all hover:bg-orange-50 rounded-lg"
                    onClick={handleProfileClick}
                  >
                    Profile
                  </button>
                  <button
                    className="px-5 py-2 bg-linear-to-r from-orange-600 to-orange-500 text-white font-medium text-sm rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium text-sm transition-all hover:bg-orange-50 rounded-lg"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                  <button
                    className="px-5 py-2 bg-linear-to-r from-orange-600 to-orange-500 text-white font-medium text-sm rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Account Icon */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
              onClick={handleLoginClick}
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 py-6 bg-linear-to-br from-orange-50 via-orange-50 to-amber-50 border-t border-orange-100">
          <Link
            href="/"
            className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-white rounded-xl transition-all font-medium mb-2 shadow-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          {/* Mobile Products Dropdown */}
          <div className="mb-2">
            <button
              onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-white rounded-xl font-medium shadow-sm transition-all"
            >
              Products
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? 'max-h-[500px] mt-2' : 'max-h-0'
                }`}
            >
              {productCategories.map((category) => (
                <div
                  key={category.title}
                  className="mb-4 bg-white rounded-xl p-3 shadow-sm"
                >
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2 px-2">
                    {category.title}
                  </p>
                  {category.items.map((item) => (
                    <Link
                      key={item}
                      href={`/products/${item
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileProductsOpen(false);
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/contactus"
            className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-white rounded-xl transition-all font-medium mb-2 shadow-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </Link>

          <Link
            href="/aboutus"
            className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-white rounded-xl transition-all font-medium mb-2 shadow-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>

          {/* Auth Buttons */}
          <div className="pt-4 space-y-3 border-t border-gray-200 mt-4">
            {isLoggedIn ? (
              <>
                <button
                  className="w-full px-4 py-3.5 text-gray-700 hover:text-orange-600 font-semibold hover:bg-white rounded-xl transition-all shadow-sm border-2 border-gray-200 hover:border-orange-600 flex items-center justify-center gap-2"
                  onClick={() => {
                    handleProfileClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full px-4 py-3.5 bg-linear-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full px-4 py-3.5 text-gray-700 hover:text-orange-600 font-semibold hover:bg-white rounded-xl transition-all shadow-sm border-2 border-gray-200 hover:border-orange-600 flex items-center justify-center gap-2"
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button
                  className="w-full px-4 py-3.5 bg-linear-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  onClick={() => {
                    handleSignup();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}