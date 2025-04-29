'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [points, setPoints] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setUserName(userData.name);
      
      // Fetch user points
      fetch('/api/user/points', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.points !== undefined) {
          setPoints(data.points);
        }
      })
      .catch(console.error);
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setPoints(0);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    setPoints(0);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3 relative">
              {/* Logo Container with Glow */}
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-200 group-hover:duration-200 animate-tilt"></div>
                <div className="relative flex items-center justify-center w-10 h-10 bg-gray-900 rounded-lg border border-gray-700/50 shadow-lg">
                  <Image
                    src="/globe.svg"
                    alt="Universal Translator Logo"
                    width={24}
                    height={24}
                    className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200 drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 whitespace-nowrap">
                  Universal Translator
                </h1>
                <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase -mt-1">
                  AI-Powered Translation
                </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard"
                  className={`text-gray-300 hover:text-white transition-colors ${
                    pathname === '/dashboard' ? 'text-white font-medium' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/quiz"
                  className={`text-gray-300 hover:text-white transition-colors ${
                    pathname === '/quiz' ? 'text-white font-medium' : ''
                  }`}
                >
                  Quiz
                </Link>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{userName}</span>
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-lg">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-yellow-500 font-medium">{points}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-gray-300 hover:text-white transition-colors ${
                    pathname === '/login' ? 'text-white font-medium' : ''
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity ${
                    pathname === '/signup' ? 'opacity-90' : ''
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}