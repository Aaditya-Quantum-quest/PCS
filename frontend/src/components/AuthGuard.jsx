"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const PROTECTED_PATHS = [
  "/checkout",
  "/orders",
  "/profile",
  "/order-success",
];

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false); // ✅ default false, not true

  useEffect(() => {
    if (!pathname) return;

    const needsAuth = PROTECTED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );

    // ✅ If no auth needed, allow immediately
    if (!needsAuth) {
      setIsAllowed(true);
      setIsChecking(false);
      return;
    }

    // ✅ Needs auth — check cookie via backend
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAllowed(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname]);

  // ✅ Only show loading on protected pages
  if (isChecking) {
    const needsAuth = PROTECTED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );

    // Don't block non-protected pages with loading spinner
    if (!needsAuth) return <>{children}</>;

    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Checking authentication...</p>
      </main>
    );
  }

  if (!isAllowed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 text-center">
          Please login to continue
        </h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          You need to be logged in to access checkout. Please login or create an
          account to place your order.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem("redirectAfterLogin", pathname);
              router.push("/login");
            }}
            className="px-6 py-2.5 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition"
          >
            Go to Login
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem("redirectAfterLogin", pathname);
              router.push("/signup");
            }}
            className="px-6 py-2.5 rounded-lg border border-pink-400 text-pink-500 font-medium hover:bg-pink-50 transition"
          >
            Create Account
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}