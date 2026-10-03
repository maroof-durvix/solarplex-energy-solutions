'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Sun, ShieldAlert, Key, User, Mail, Sparkles, LogIn } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, role, login, register, loading, loginWithGoogle, loginWithApple } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('login'); // login vs register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // If already logged in, redirect to respective dashboard or requested redirect URL
  useEffect(() => {
    if (user && role) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push(`/${role}`);
      }
    }
  }, [user, role, router, searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormSubmitted(true);

    if (activeTab === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error);
        setFormSubmitted(false);
      }
    } else {
      if (!name) {
        setError("Please enter your name to register.");
        setFormSubmitted(false);
        return;
      }
      const res = await register(email, password, name);
      if (!res.success) {
        setError(res.error);
        setFormSubmitted(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const res = await loginWithGoogle();
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    const res = await loginWithApple();
    if (!res.success) {
      setError(res.error);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-slate-900 text-white relative select-none">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-navy via-slate-900 to-black opacity-90 z-0"></div>
      
      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Logo Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2.5 pb-2">
            <img 
              src="/solarplex_logo.png" 
              alt="SolarPlex Logo" 
              className="h-12 w-12 rounded-full border border-solar-orange/30 shadow-md object-cover animate-float" 
            />
            <span className="font-extrabold text-2xl tracking-wider text-white">
              Solar<span className="text-solar-orange">Plex</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 font-sans mt-2">Enterprise Solar Resource & Partner Portal</p>
        </div>

        {/* Card Panel */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6 bg-slate-950/50 backdrop-blur-lg hover-glow animate-fade-in">
          
          {/* Tab Selection */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-4">
            <button
              onClick={() => handleTabChange('login')}
              className={`py-2 text-sm font-extrabold cursor-pointer transition-colors ${
                activeTab === 'login' ? 'text-solar-orange border-b-2 border-solar-orange' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`py-2 text-sm font-extrabold cursor-pointer transition-colors ${
                activeTab === 'register' ? 'text-solar-orange border-b-2 border-solar-orange' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-xs flex items-start space-x-2 font-sans leading-relaxed">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Name (Registration Only) */}
            {activeTab === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-850 rounded-xl bg-slate-900/60 focus:outline-none focus:border-solar-orange text-sm text-white"
                    placeholder="Enter full name"
                    required
                  />
                  <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-850 rounded-xl bg-slate-900/60 focus:outline-none focus:border-solar-orange text-sm text-white"
                  placeholder="Enter your email address"
                  required
                />
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-850 rounded-xl bg-slate-900/60 focus:outline-none focus:border-solar-orange text-sm text-white"
                  placeholder="••••••••"
                  required
                />
                <Key className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formSubmitted}
              className="w-full bg-solar-orange hover:bg-solar-deep text-white font-extrabold py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 text-sm animate-pulse-glow"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : activeTab === 'login' ? 'Sign In' : 'Sign Up'}</span>
            </button>

          </form>

          {/* Social Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-850"></div>
            <span className="flex-shrink mx-4 text-slate-500 font-sans text-[10px] uppercase font-extrabold tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-850"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-850 hover:border-solar-orange/50 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-extrabold text-slate-200 transition-all cursor-pointer hover:shadow-md"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={handleAppleSignIn}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-850 hover:border-solar-orange/50 bg-slate-900/40 hover:bg-slate-900/80 text-xs font-extrabold text-slate-200 transition-all cursor-pointer hover:shadow-md"
            >
              <svg className="h-4 w-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.96-1.4"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center font-sans">
          <Link href="/" className="text-xs text-slate-500 hover:text-solar-orange">
            &larr; Back to public homepage
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-semibold">Loading Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
