'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ClipboardList, ShieldAlert, Cpu, Eye, FileText, ArrowRight, Sun } from 'lucide-react';
import Link from 'next/link';

export default function InstallationPage() {
  const { t } = useLanguage();

  const steps = [
    { title: "1. Engineering Site Survey", desc: "Our field team conducts a drone-enabled roof assessment and shading analysis using solar meters to check load constraints and direct angles.", icon: Eye },
    { title: "2. Custom PV Array Design", desc: "Engineers develop structural AutoCAD layout mockups and perform energy simulation modeling using PVsyst for maximum solar output.", icon: Cpu },
    { title: "3. Grounding & Structural Civil Setup", desc: "Mechanical assembly of standard hot-dipped galvanized mounts and structures. Electrical earthing (grounding) lines installed for surge protection.", icon: ShieldAlert },
    { title: "4. DC/AC Wiring & Commissioning", desc: "Wiring panels into string networks, linking up the smart inverter, installing DC/AC distribution boxes, and safety circuit breakers.", icon: ClipboardList },
    { title: "5. Net-Metering Licensing", desc: "SolarPlex compiles the documentation, gets AEDB verification, coordinates with DISCOs (LESCO/IESCO/KE), and activates the bidirectional green meter.", icon: FileText }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 select-none bg-slate-50 dark:bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Installation Services & Grid Integration
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-sans">
              SolarPlex follows premium civil and electrical engineering standards, ensuring safety, efficiency, and compliance for grid-interactive solar.
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="max-w-4xl mx-auto mb-16 relative">
            {/* Visual connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

            <div className="space-y-12">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                    
                    {/* Circle Icon Badge */}
                    <div className="bg-solar-orange text-white p-3 rounded-full shadow-md z-10 shrink-0 mx-auto md:mx-0">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Step Card */}
                    <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full">
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{step.desc}</p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-solar-orange/30 bg-gradient-to-r from-solar-orange/5 to-solar-orange/10 dark:from-solar-orange/5 dark:to-transparent flex flex-col md:flex-row justify-between items-center gap-8 max-w-4xl mx-auto text-center md:text-left rtl:md:text-right">
            <div className="space-y-3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ready to transition to smart energy?</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg font-sans">
                Schedule a site survey. Our Cat-1 engineers will analyze your location and provide a detailed structural and cash-flow proposal.
              </p>
            </div>
            
            <Link
              href="/quote"
              className="bg-solar-orange hover:bg-solar-deep text-white font-extrabold px-8 py-4 rounded-xl shadow-lg flex items-center space-x-2 shrink-0 transition-colors"
            >
              <span>{t('quote')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
