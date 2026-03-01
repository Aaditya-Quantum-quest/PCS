

'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';

export default function ModernSignup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post('http://localhost:4000/api/auth/signup', {
        name: fullName,
        email,
        username,
        password,
      });

      // store token if backend sends it
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      setSuccessMsg(res.data.message || 'Signup successful');

      // optional: clear fields
      setFullName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      // redirect to home
      // setTimeout(() => {
      //   router.push('/');
      // }, 800);
      setTimeout(() => {
        // ✅ Redirect back to where they came from (e.g. /checkout)
        const redirectTo = sessionStorage.getItem('redirectAfterLogin');
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectTo || '/');
      }, 800);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Signup failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-linear-to-br from-pink-400 via-pink-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      {/* ...your existing blob divs here... */}

      {/* Sign Up Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md">
        {/* Decorative Corner Blob */}
        {/* ... */}

        <div className="relative z-10">
          <h2 className="text-3xl font-medium text-gray-800 text-center mb-4">
            Create Account
          </h2>

          {/* Messages */}
          {errorMsg && (
            <p className="mb-3 text-sm text-red-500 text-center">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="mb-3 text-sm text-green-600 text-center">
              {successMsg}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                required
              />
            </div>

            {/* Username Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                required
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 cursor-pointer bg-linear-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing up...' : 'SIGN UP'}
            </button>

            {/* Terms Text */}
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <button className="text-pink-500 hover:underline">Terms</button>{' '}
              and{' '}
              <button className="text-pink-500 hover:underline">
                Privacy Policy
              </button>
            </p>
          </form>

          {/* Already Have Account Link */}
          <div className="mt-8 text-center">
            <button className="text-pink-500  hover:text-pink-700 cursor-pointer transition inline-flex items-center gap-1 group" onClick={() => router.push('/login')}>
              Already have an account? Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
