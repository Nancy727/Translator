'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Show success toast
      setShowToast(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] border border-gray-800 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 text-center">
              Welcome Back
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800/70 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/70 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200 group-disabled:opacity-40"></div>
                <div className="relative px-6 py-3.5 bg-gray-900 rounded-xl leading-none flex items-center justify-center gap-2 group-hover:bg-gray-800 transition duration-200">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium text-white">Logging in...</span>
                    </>
                  ) : (
                    <span className="font-medium text-white">Login</span>
                  )}
                </div>
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Login successful! Redirecting..."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </main>
  );
}