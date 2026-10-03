'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Target, Award, Calendar, Users, Eye, Zap, Landmark } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  const leadership = [
    { name: "Kafeel Ahmed Khan", role: "Owner & Managing Director", desc: "Founder and manager of SolarPlex. Handles end-to-end operational aspects including installation management, procurement (purchasing), and client sales.", icon: Users },
    { name: "Engr. Farhan Ali", role: "Chief Technology Officer (CTO)", desc: "Lead engineer for over 45MW grid-interactive solar arrays, LESCO net-metering validation expert.", icon: Zap },
    { name: "Muhammad Bilal", role: "Director of Field Operations", desc: "Supervises structural anchoring, quality checks, and warehouse safety control parameters.", icon: ShieldCheck }
  ];

  const milestones = [
    { year: "2022", title: "SolarPlex Founded", desc: "Established headquarters in Civic Center Bahria Town to support commercial solar grids." },
    { year: "2023", title: "AEDB CAT-1 Certification", desc: "Awarded AEDB category-1 status, licensing megawatt-scale net-metering structures." },
    { year: "2024", title: "45 Megawatts Installed", desc: "Completed critical grid projects in Lahore, Karachi, and Faisalabad industrial complexes." },
    { year: "2025", title: "Platform Launch", desc: "Developed the smart synchronization context layer for customer live monitoring." },
    { year: "2026", title: "Global Operations", desc: "Expanding commercial supply chains to international solar distribution zones." }
  ];

  const values = [
    { title: "Grid Integrity", desc: "We adhere strictly to IEEE and NEPRA standards for grid safety and earthing line parameters.", icon: Landmark },
    { title: "Empowering Sustainability", desc: "Helping local manufacturing and homes offset their carbon tax index by 100%.", icon: Target },
    { title: "Aesthetic Assembly", desc: "Designing roof arrays that complement corporate architecture, using premium galvanized mounts.", icon: Eye }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50 dark:bg-primary-dark select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-solar-orange bg-solar-orange/10 px-3 py-1.5 rounded-full">
              SolarPlex Profile
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white pt-2">
              Powering Progress Across Borders
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-sans text-sm">
              Providing Tier-1 EPC hardware supply, net-metering coordination, and automated PV asset tracking for residential and industrial complexes.
            </p>
          </div>

          {/* Mission & Vision Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Our Vision</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                To serve as the primary renewable grid partner in Pakistan, enabling domestic factories, commercial offices, and families to achieve complete energy independence from shifting utility tariffs.
              </p>
              <div className="border-l-4 border-solar-orange pl-4 text-slate-655 font-medium leading-relaxed font-sans italic text-sm">
                "Our solar designs target high yields under severe temperature ranges, ensuring maximum returns on investments."
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-4 rtl:space-x-reverse hover-lift hover-glow">
                    <div className="bg-solar-orange/10 text-solar-orange p-2.5 rounded-xl shrink-0 mt-0.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-850 dark:text-white text-base">{val.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{val.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leadership Team */}
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Executive Management</h2>
              <p className="text-xs text-slate-500 font-sans">Engineers and coordinators driving utility offsets and green credits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((member, idx) => {
                const Icon = member.icon;
                return (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover-lift hover-glow">
                    <div className="space-y-3">
                      <div className="bg-slate-900 text-white p-3.5 rounded-2xl w-fit">
                        <Icon className="h-6 w-6 text-solar-orange" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-850 dark:text-white text-lg">{member.name}</h3>
                        <span className="text-[10px] text-solar-orange uppercase font-bold tracking-wider font-sans">{member.role}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{member.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="space-y-12 select-none">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Our Timeline</h2>
              <p className="text-xs text-slate-500 font-sans">Corporate evolution and project capacity records.</p>
            </div>

            <div className="relative border-l border-slate-200 dark:border-slate-800 max-w-3xl mx-auto space-y-8 pl-6">
              {milestones.map((mile, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span className="absolute -left-[31px] top-1 bg-solar-orange border-4 border-white dark:border-primary-dark w-4 h-4 rounded-full"></span>
                  
                  <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="font-black text-solar-orange font-sans">{mile.year}</span>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{mile.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{mile.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
