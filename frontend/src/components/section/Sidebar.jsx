"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  Home,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Track admin status

  const router = useRouter();
  const pathname = usePathname();
  const { getTotalItems, getTotalPrice } = useCart();
  const [frameCartTotal, setFrameCartTotal] = useState({ count: 0, price: 0 });

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check token and admin status on mount
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   const token = localStorage.getItem('token');
  //   const adminStatus = localStorage.getItem('isAdmin') === 'true'; // ✅ Get admin status

  //   setIsLoggedIn(!!token);
  //   setIsAdmin(adminStatus); // ✅ Set admin state
  // }, [pathname]);
  // REPLACE WITH:
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          method: "GET",
          credentials: "include", // ✅ Send cookie
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setIsAdmin(
            !!data.user?.isAdmin || localStorage.getItem("isAdmin") === "true",
          );
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (e) {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkLoginStatus();
  }, [pathname]);

  useEffect(() => {
    const calculateFrameCart = () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const cartKey = token
        ? `frameCart_${token.substring(0, 20)}`
        : "frameCart_guest";
      const frameCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      const count = frameCart.length;
      const price = frameCart.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 1),
        0,
      );
      setFrameCartTotal({ count, price });
    };

    calculateFrameCart();

    // Re-calculate on storage changes
    window.addEventListener("storage", calculateFrameCart);
    // Also poll since same-tab localStorage changes don't fire 'storage' event
    const interval = setInterval(calculateFrameCart, 500);

    return () => {
      window.removeEventListener("storage", calculateFrameCart);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLoginClick = () => {
    router.push("/login");
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    router.push("/signup");
    setIsMenuOpen(false);
  };

  // ✅ Updated Profile Click Handler - Role-Based Navigation
  const handleProfileClick = () => {
    if (isAdmin) {
      router.push("/dashboard"); // Admin → Dashboard
    } else {
      router.push("/userdashboard"); // Regular User → User Dashboard
    }
    setIsMenuOpen(false);
  };

  // const handleLogout = () => {
  //   if (typeof window !== 'undefined') {
  //     Object.keys(localStorage).forEach(key => {
  //       if (key.startsWith('frameCart')) {
  //         localStorage.removeItem(key);
  //       }
  //     });
  //     window.dispatchEvent(new Event('userLogout'));
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('isAdmin'); // ✅ Clear admin status
  //   }
  //   setIsLoggedIn(false);
  //   setIsAdmin(false); // ✅ Reset admin state
  //   setIsMenuOpen(false);
  //   router.replace('/login');
  // };
  // REPLACE WITH:
  const handleLogout = async () => {
    try {
      // ✅ Clear HTTP-only cookie on backend
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error:", e);
    }

    // ✅ Clear localStorage
    localStorage.removeItem("isAdmin");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("frameCart")) localStorage.removeItem(key);
    });

    window.dispatchEvent(new Event("userLogout"));
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsMenuOpen(false);
    router.replace("/login");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-md"
          }`}
      >
        <div className="max-w-8xl md:px-20 mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left - Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors z-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            {/* Center - Logo */}
            <Link
              href="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">P</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
                </div>
                <span className="hidden sm:inline-block text-2xl md:text-3xl font-serif font-medium tracking-wide">

                  <span className="text-slate-900">
                    Prem{" "}
                  </span>

                  <span className="font-['Great_Vibes'] italic
  bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
  bg-clip-text text-transparent">
                    Color{" "}
                  </span>

                  <span className="text-slate-800 ml-1">
                    Studio
                  </span>

                </span>
              </div>
            </Link>

            {/* Right - Cart, Profile, Login, Signup */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Cart */}
              <button
                className="relative flex items-center gap-1 p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                onClick={() => router.push("/cart")}
              >
                {getTotalItems() + frameCartTotal.count > 0 && (
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                    ₹
                    {(
                      (getTotalPrice ? getTotalPrice() : 0) +
                      frameCartTotal.price
                    ).toLocaleString()}
                  </span>
                )}
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  {getTotalItems() + frameCartTotal.count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems() + frameCartTotal.count}
                    </span>
                  )}
                </div>
              </button>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-2">
                {isLoggedIn ? (
                  <>
                    <button
                      className="flex cursor-pointer items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={handleProfileClick}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {isAdmin ? "Dashboard" : "Profile"}
                      </span>
                    </button>
                    <button
                      className="px-4 py-2 cursor-pointer bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors text-sm font-medium"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={handleLoginClick}
                    >
                      <LogIn className="h-5 w-5" />
                      <span className="text-sm font-medium">Login</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-md transition-colors"
                      onClick={handleSignup}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span className="text-sm font-medium">Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 backdrop-blur-sm transition-opacity duration-300 z-40 ${isMenuOpen ? "bg-opacity-50 visible" : "bg-opacity-0 invisible"
          }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar Menu */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">P</span>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-orange-400 rounded-full" />
              </div>
              <span className="text-lg font-bold bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Prem Color Studio
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Sidebar Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-2">
              {/* Home Link */}
              <Link
                href="/"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768292573/home_-_Copy_zeiboz.webp"
                      alt="Home"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Home
                  </span>
                </div>
              </Link>

              {/* Product Links */}
              <Link
                href="/products/acrylic-photo"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768292572/Framed-Acrylic-Photo_-_Copy_rymlmu.svg"
                      alt="acrylic photo"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Acrylic Photo
                  </span>
                </div>
              </Link>

              <Link
                href="/products/clear-acrylic-photo"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768292572/Transparent-Acrylic-Photo_-_Copy_cozkrz.svg"
                      alt="clear acrylic photo"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Clear Acrylic Photo
                  </span>
                </div>
              </Link>

              <Link
                href="/products/acrylic-wall-clock"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768292571/wall-Clock_zfpc6u.svg"
                      alt="acrylic wall clock"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Acrylic Wall Clock
                  </span>
                </div>
              </Link>

              {/* <Link
                href="/products/framed-acrylic-photo"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768292571/Framed-Acrylic-Photo_oitry4.svg"
                      alt="framed acrylic photo"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Framed Acrylic Photo
                  </span>
                </div>
              </Link> */}

              <Link
                href="/products/acrylic-cutout"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768292571/Cut-outs_t6bce6.svg"
                      alt="acrylic cutouts"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Acrylic Cutouts
                  </span>
                </div>
              </Link>

              <Link
                href="/products/miniphoto-gallery"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768292571/Collage_vl3jeu.svg"
                      alt="mini photo gallery"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Mini Photo Gallery
                  </span>
                </div>
              </Link>

              <Link
                href="/products/acrylic-nameplate"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768293221/Name-Plates_bx803f.svg"
                      alt="acrylic nameplates"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Acrylic NamePlates
                  </span>
                </div>
              </Link>

              <Link
                href="/photo-gallery"
                className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1770632530/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvam9iNjcyLTAzMS14LmpwZw-removebg-preview_ezedyx.png"
                      alt="Gallery page"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Gallery
                  </span>
                </div>
              </Link>

              {/* Contact Us Link */}
              <Link
                href="/contactus"
                className="flex cursor-pointer items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768296658/Contact-Us_guwqf0.svg"
                      alt="contact us"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    Contact Us
                  </span>
                </div>
              </Link>

              {/* About Link */}
              <Link
                href="/aboutus"
                className="flex cursor-pointer items-center space-x-3 p-3 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div>
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/dewxpvl5s/image/upload/v1768296658/About-Us_fz6oui.svg"
                      alt="about us"
                      width={40}
                      height={20}
                      className="object-contain"
                    />
                    About Us
                  </span>
                </div>
              </Link>

              {/* Cart Link (Mobile) */}
              <button
                className="flex cursor-pointer items-center justify-between w-full p-3 hover:bg-gray-100 rounded-md transition-colors md:hidden"
                onClick={() => {
                  router.push("/cart");
                  setIsMenuOpen(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-5 w-5 text-gray-700 cursor-pointer" />
                  <span className="text-gray-700 font-medium">Cart</span>
                </div>
                {getTotalItems() > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Footer - Auth Buttons */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            {isLoggedIn ? (
              <>
                <button
                  className="w-full flex cursor-pointer items-center justify-center space-x-2 p-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
                  onClick={handleProfileClick}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">
                    {isAdmin ? "Dashboard" : "Profile"}
                  </span>
                </button>
                <button
                  className="w-full flex cursor-pointer items-center justify-center space-x-2 p-3 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
                  onClick={handleLogout}
                >
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full flex cursor-pointer items-center justify-center space-x-2 p-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
                  onClick={handleLoginClick}
                >
                  <LogIn className="h-5 w-5" />
                  <span className="font-medium">Login</span>
                </button>
                <button
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-black text-white hover:bg-gray-800 rounded-md transition-colors"
                  onClick={handleSignup}
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="font-medium">Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
