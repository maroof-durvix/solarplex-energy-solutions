'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Calendar, ArrowRight, Sun } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const { t } = useLanguage();

  const posts = [
    {
      id: 1,
      title: "Understanding LESCO Net-Metering in 2026",
      desc: "An updated guide on compliance rules, AEDB CAT-1 requirements, and application turnaround times for Lahore residents.",
      date: "June 24, 2026",
      author: "Engr. Farhan Ali",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Longi Hi-MO 6 vs Jinko Tiger Neo: Which is better?",
      desc: "A direct technical comparison of cell efficiency, temp coefficients, and warranty coverage for local hot climates.",
      date: "June 20, 2026",
      author: "Zeeshan Khan",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Payback Period Trends: PKR Depreciation Effects",
      desc: "Analyzing how the exchange rate fluctuations are shortening payback windows for commercial solar setups.",
      date: "June 15, 2026",
      author: "Zeeshan Khan",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50 dark:bg-primary-dark select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Blog & News Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-sans">
              Stay updated on NEPRA tariff mandates, grid approvals, and premium solar equipment reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all hover:translate-y-[-2px]"
              >
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 font-sans mb-3">
                    <span className="flex items-center space-x-1"><Calendar className="h-3.5 w-3.5 text-solar-orange" /> <span>{post.date}</span></span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-850 dark:text-white leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-slate-550 dark:text-slate-450 leading-relaxed font-sans mt-3">{post.desc}</p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-450 font-sans">By {post.author}</span>
                  <a href="#" className="text-solar-orange hover:text-solar-deep font-bold text-xs flex items-center space-x-1">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
