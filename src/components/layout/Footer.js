'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sun, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 select-none py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse font-sans">
              <img 
                src="/solarplex_logo.png" 
                alt="SolarPlex Logo" 
                className="h-9 w-9 rounded-full object-cover border border-solar-orange/40" 
              />
              <span className="font-extrabold text-xl text-white tracking-wider">
                Solar<span className="text-solar-orange">Plex</span>
              </span>
            </div>
            <p className="text-sm text-slate-550 leading-relaxed font-sans">
              Leading developer of utility-scale, industrial, and high-yield residential solar generation networks. Empowering sustainability worldwide.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse pt-2">
              <a 
                href="https://www.facebook.com/profile.php?id=61591159013017" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-solar-orange transition-colors" 
                title="Facebook Page"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="mailto:info@solarplex.com" className="hover:text-solar-orange transition-colors" title="Contact Email"><Mail className="h-5 w-5" /></a>
              <a href="tel:03122469522" className="hover:text-solar-orange transition-colors" title="Contact Phone"><Phone className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-sans">{t('services')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="hover:text-solar-orange transition-colors">{t('products')}</Link>
              </li>
              <li>
                <Link href="/installation" className="hover:text-solar-orange transition-colors">{t('installation')}</Link>
              </li>

              <li>
                <Link href="/quote" className="hover:text-solar-orange transition-colors">{t('quote')}</Link>
              </li>
            </ul>
          </div>

          {/* Support Modules */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-sans">Resources</h3>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <Link href="/login" className="hover:text-solar-orange transition-colors">{t('portal')}</Link>
              </li>
              <li>
                <a href="#calculator" className="hover:text-solar-orange transition-colors">{t('calcTitle')}</a>
              </li>
              <li>
                <span className="text-xs border border-slate-700 px-2 py-0.5 rounded text-slate-500">ISO 9001:2015</span>
              </li>
              <li>
                <span className="text-xs border border-slate-700 px-2 py-0.5 rounded text-slate-500">AEDB Certified (Cat-1)</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3.5 text-sm">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-sans">{t('contact')}</h3>
            <div className="flex items-start space-x-2.5 rtl:space-x-reverse">
              <MapPin className="h-5 w-5 text-solar-orange shrink-0 mt-0.5" />
              <span className="text-slate-500">D-27 Kauser Town Malir Karachi, Pakistan</span>
            </div>
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <Phone className="h-4 w-4 text-solar-orange text-xs" />
              <span className="text-slate-550">03122469522</span>
            </div>
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <Mail className="h-4 w-4 text-solar-orange text-xs" />
              <span className="text-slate-550">info@solarplex.com</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-655 font-sans">
          &copy; {new Date().getFullYear()} SolarPlex (Pvt) Ltd. All rights reserved. Designed for Pakistani and international solar operations.
        </div>
      </div>
    </footer>
  );
}
