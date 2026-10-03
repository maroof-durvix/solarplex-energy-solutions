'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { Sun, Globe, DollarSign, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { t, toggleLanguage, language, isRtl } = useLanguage();
  const { currency, toggleCurrency } = useCurrency();
  const { user, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('about'), path: '/about' },
    { name: t('products'), path: '/products' },
    { name: t('installation'), path: '/installation' },
    { name: t('reviews'), path: '/reviews' },
    { name: t('quote'), path: '/quote' },
    { name: t('contact'), path: '/contact' }
  ];

  const getDashboardPath = () => {
    if (!role) return '/login';
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/staff';
    return '/customer';
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <img 
                src="/solarplex_logo.png" 
                alt="SolarPlex Logo" 
                className="h-11 w-11 rounded-full border border-solar-orange/30 shadow-sm object-cover" 
              />
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-primary-navy dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Solar<span className="text-solar-orange">Plex</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-6 rtl:space-x-reverse items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xs font-bold transition-all-custom uppercase tracking-wider ${
                    isActive
                      ? 'text-solar-orange border-b-2 border-solar-orange pb-1'
                      : 'text-slate-800 dark:text-slate-200 hover:text-solar-orange'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Controls (Lang, Curr, Auth) */}
          <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
            
            {/* Currency Button */}
            <button
              onClick={toggleCurrency}
              className="flex items-center space-x-1 text-xs font-bold border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-primary-blue transition-colors cursor-pointer"
              title="Toggle PKR / USD Pricing"
            >
              <DollarSign className="h-3.5 w-3.5 text-solar-orange" />
              <span>{currency}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-xs font-bold border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-primary-blue transition-colors cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-solar-orange" />
              <span>{language === 'en' ? 'Urdu' : 'English'}</span>
            </button>

            {/* Portal Redirection Button */}
            {user ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Link
                  href={getDashboardPath()}
                  className="bg-primary-navy dark:bg-primary-blue hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t('dashboard')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-red-500 hover:bg-red-550 text-red-500 hover:text-white dark:hover:text-red-100 text-xs font-medium px-3 py-2 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                  title={t('logout')}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-solar-orange hover:bg-solar-deep text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-md transition-all-custom cursor-pointer flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>{t('portal')}</span>
              </Link>
            )}

          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="lg:hidden flex items-center space-x-3 rtl:space-x-reverse">
            
            {/* Quick Currency Toggle */}
            <button
              onClick={toggleCurrency}
              className="flex items-center text-xs border border-slate-300 dark:border-slate-700 px-2 py-1 rounded-md"
            >
              <DollarSign className="h-3 w-3 text-solar-orange" />
              <span>{currency}</span>
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 dark:text-slate-200 hover:text-solar-orange focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-200 dark:border-slate-800 animate-fade-in absolute w-full left-0 z-40 p-4 shadow-xl">
          <div className="flex flex-col space-y-4">
            
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold py-2 px-3 rounded-lg block transition-colors ${
                    isActive
                      ? 'text-white bg-solar-orange'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-primary-navy hover:text-solar-orange'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <hr className="border-slate-200 dark:border-slate-800 my-2" />

            <div className="flex items-center justify-between px-3">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('currencyLabel')}</span>
              <button
                onClick={toggleCurrency}
                className="flex items-center space-x-1 text-sm border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-md bg-white dark:bg-slate-900"
              >
                <DollarSign className="h-4 w-4 text-solar-orange" />
                <span className="font-semibold">{currency}</span>
              </button>
            </div>

            <div className="flex items-center justify-between px-3">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Language</span>
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-1 text-sm border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-md bg-white dark:bg-slate-900"
              >
                <Globe className="h-4 w-4 text-solar-orange" />
                <span className="font-semibold">{language === 'en' ? 'Urdu' : 'English'}</span>
              </button>
            </div>

            {/* Auth Action */}
            <div className="pt-2 px-3">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-slate-600 dark:text-slate-300">
                    <User className="h-4 w-4 text-solar-orange" />
                    <span className="font-semibold truncate">{user.name}</span>
                  </div>
                  <Link
                    href={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-primary-navy dark:bg-primary-blue hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg shadow-sm block text-sm"
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center border border-red-500 hover:bg-red-50 text-red-500 font-semibold py-2.5 rounded-lg text-sm block cursor-pointer"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-solar-orange hover:bg-solar-deep text-white font-semibold py-2.5 rounded-lg shadow-md block text-sm cursor-pointer"
                >
                  {t('portal')}
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
