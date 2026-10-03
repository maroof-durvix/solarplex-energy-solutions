'use client';

import React, { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useDb } from '@/context/DbContext';
import { 
  Sun, 
  ArrowRight, 
  Percent, 
  Zap, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Leaf, 
  Award,
  HelpCircle,
  MapPin,
  Phone,
  ShoppingBag,
  Users,
  Mail
} from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const { currency, formatPrice, formatPkrPrice, exchangeRate } = useCurrency();
  const { products } = useDb();
  
  const calcRef = useRef(null);

  // Calculator State
  const [bill, setBill] = useState(35000); // Default Rs. 35,000 PKR monthly bill
  const [connectionType, setConnectionType] = useState('Residential');
  const [calcResult, setCalcResult] = useState(null);

  // Stats
  const stats = [
    { value: "350+", label: t('statsActiveProjects'), icon: Zap },
    { value: "45 MW", label: t('statsCapacityInstalled'), icon: Sun },
    { value: "1,200+", label: t('statsSatisfiedClients'), icon: Award },
    { value: "18k Tons", label: t('statsCarbonReduced'), icon: Leaf }
  ];

  // Services
  const featuresList = [
    { title: "Net-Metered Grid Systems", desc: "Reduce bills to zero and sell excess generation back to LESCO, K-Electric, or IESCO.", icon: Zap },
    { title: "Smart Hybrid Storage", desc: "Continuous operations during load-shedding with intelligent lithium-ion battery integration.", icon: ShieldCheck },
    { title: "Industrial Turnkey Setup", desc: "Megawatt-scale solutions with full regulatory approvals, structural checks, and AEDB licensing.", icon: Sun }
  ];

  const handleCalculate = (e) => {
    e.preventDefault();
    
    // Tariffs per kWh in PKR
    let tariff = 65; // Residential average
    if (connectionType === 'Commercial') tariff = 72;
    if (connectionType === 'Industrial') tariff = 58;

    // Monthly units consumed = Bill / Tariff
    const monthlyUnits = bill / tariff;
    
    // 1kW solar yields approx 120 units (kWh) per month in Pakistan
    let systemSize = monthlyUnits / 120;
    systemSize = Math.max(3, Math.round(systemSize * 2) / 2); // Minimum 3kW, rounded to nearest 0.5

    // Base cost in USD per kW
    let baseCostPerKwUsd = 950;
    if (connectionType === 'Commercial') baseCostPerKwUsd = 850;
    if (connectionType === 'Industrial') baseCostPerKwUsd = 750;

    const setupCostUsd = systemSize * baseCostPerKwUsd;
    const setupCostPkr = setupCostUsd * exchangeRate;

    // Annual production (kWh) = Size * 120 * 12
    const annualProductionKwh = systemSize * 120 * 12;
    const annualSavingsPkr = annualProductionKwh * tariff;
    const annualSavingsUsd = annualSavingsPkr / exchangeRate;

    const payback = setupCostPkr / annualSavingsPkr;

    setCalcResult({
      size: systemSize.toFixed(1),
      costUsd: setupCostUsd,
      savingsUsd: annualSavingsUsd,
      payback: payback.toFixed(1),
      netMetering: systemSize >= 3 ? t('yes') : t('no')
    });
  };

  const scrollToCalculator = () => {
    calcRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-24 md:py-32 flex items-center min-h-[85vh] select-none">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-navy via-slate-900 to-black opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-left text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-solar-orange/10 border border-solar-orange/30 px-3 py-1.5 rounded-full text-solar-orange text-xs font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-solar-orange animate-ping"></span>
              <span>AEDB Approved Cat-1 Solar Partner</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              {t('heroTitle')}
            </h1>
            
            <p className="text-lg text-slate-350 max-w-xl leading-relaxed">
              {t('heroSub')}
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse justify-center lg:justify-start pt-2">
              <button
                onClick={scrollToCalculator}
                className="bg-solar-orange hover:bg-solar-deep text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-solar-orange/20 flex items-center justify-center space-x-2 transition-all-custom cursor-pointer text-base animate-pulse-glow"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href="/about"
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-8 py-4 rounded-lg border border-slate-700 flex items-center justify-center space-x-1.5 transition-all text-base hover-lift"
              >
                <span>{t('learnMore')}</span>
              </a>
            </div>
          </div>

          {/* Brand Banner Image */}
          <div className="relative flex justify-center items-center animate-slide-right">
            <div className="relative w-full max-w-xl aspect-[16/10] rounded-2xl border-4 border-solar-orange/30 shadow-2xl overflow-hidden bg-white p-1 flex items-center justify-center animate-float hover-lift">
              <img 
                src="/solarplex_banner.png" 
                alt="SolarPlex Banner - Kafeel Ahmed Khan" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 py-10 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div className="bg-solar-light dark:bg-slate-800 p-2.5 rounded-xl text-solar-orange mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 select-none bg-slate-50 dark:bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Why SolarPlex Enterprise Solutions?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-sans">
              We design premium solar products, manage regulatory net-metering pipelines, and simulate live yields for peak efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuresList.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="glass-panel p-8 rounded-2xl flex flex-col space-y-4 hover-lift hover-glow border border-slate-200 dark:border-slate-800">
                  <div className="bg-solar-orange text-white p-3.5 rounded-xl self-start">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership & Operational Control Section */}
      <section className="py-20 select-none bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Side: Owner Profile Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-8 rounded-3xl border border-solar-orange/20 bg-solar-orange/[0.01] dark:bg-solar-orange/[0.02] shadow-xl relative overflow-hidden hover-lift hover-glow">
                {/* Decorative background sun rays */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-solar-orange/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                  <img 
                    src="/solarplex_logo.png" 
                    alt="SolarPlex Logo" 
                    className="h-16 w-16 rounded-full border-2 border-solar-orange/45 object-cover shadow-md"
                  />
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Kafeel Ahmed Khan</h3>
                    <p className="text-xs uppercase font-extrabold tracking-wider text-solar-orange">Owner & Managing Director</p>
                  </div>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans mb-6">
                  Under the stewardship of Kafeel Ahmed Khan, SolarPlex operates as a unified renewable EPC service provider. He personally manages and coordinates end-to-end purchasing, sales operations, and field installations to ensure extreme quality standards.
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-sans">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4.5 w-4.5 text-solar-orange shrink-0" />
                    <span>D-27 Kauser Town Malir Karachi, Pakistan</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600 dark:text-slate-400">
                    <Phone className="h-4.5 w-4.5 text-solar-orange shrink-0" />
                    <span className="font-semibold">03122469522</span>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse text-slate-600 dark:text-slate-400">
                    <Mail className="h-4.5 w-4.5 text-solar-orange shrink-0" />
                    <span>info@solarplex.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Operational Roles */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase font-extrabold tracking-widest text-solar-orange bg-solar-orange/10 px-3 py-1.5 rounded-full">
                  Unified Operations Management
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  Direct Supervisory Oversight
                </h2>
                <p className="text-slate-555 dark:text-slate-400 max-w-xl font-sans text-sm">
                  We eliminate operational friction. Our owner supervises all key stages of the solar energy lifecycle, ensuring complete transparency and reliability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Role 1: Sourcing/Purchasing */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 hover-lift hover-glow">
                  <div className="bg-solar-orange/10 text-solar-orange p-2.5 rounded-xl w-fit">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-base">Bulk Sourcing & Purchasing</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Direct Tier-1 supply chain procurement contracts with international manufacturers of high-efficiency PV arrays and lithium cells.
                  </p>
                </div>

                {/* Role 2: Sales */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 hover-lift hover-glow">
                  <div className="bg-solar-orange/10 text-solar-orange p-2.5 rounded-xl w-fit">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-base">Client Sales & Proposals</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Tailored engineering layouts, ROI projections, and grid compatibility surveys custom-fit for commercial, industrial, or home grids.
                  </p>
                </div>

                {/* Role 3: Installation */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 hover-lift hover-glow">
                  <div className="bg-solar-orange/10 text-solar-orange p-2.5 rounded-xl w-fit">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-base">Installation & Quality Control</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Strict adherence to AEDB and NEPRA guidelines. Rigorous checks on civil anchoring structures and electrical safety loops.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section id="calculator" ref={calcRef} className="py-24 bg-white dark:bg-slate-900 select-none border-t border-slate-100 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              {t('calcTitle')}
            </h2>
            <p className="text-slate-550 dark:text-slate-400 max-w-xl mx-auto font-sans">
              {t('calcSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Input Form Card */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleCalculate} className="space-y-6">
                
                {/* Connection Type */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-350 mb-3">{t('connectionType')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Residential', 'Commercial', 'Industrial'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setConnectionType(type)}
                        className={`py-3 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          connectionType === type
                            ? 'border-solar-orange text-solar-orange bg-solar-orange/5 dark:bg-solar-orange/10 font-bold'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-primary-blue text-slate-655 dark:text-slate-400'
                        }`}
                      >
                        {type === 'Residential' ? t('connectionRes') : type === 'Commercial' ? t('connectionComm') : t('connectionInd')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Average Bill Input */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-350 mb-3">
                    {t('billLabel')} ({currency})
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <input
                      type="number"
                      value={bill}
                      onChange={(e) => setBill(Number(e.target.value))}
                      className="w-full pl-5 pr-12 py-3.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-lg font-bold"
                      placeholder="e.g. 35000"
                      min="5000"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-455 font-bold">
                      {currency}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-sans mt-2 block">
                    Calculated based on Nepra average commercial tariff (~Rs. 65-72/kWh) and net-metering credits.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-solar-orange hover:bg-solar-deep text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all-custom cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Percent className="h-5 w-5" />
                  <span>{t('calcBtn')}</span>
                </button>

              </form>
            </div>

            {/* Calculations Results Panel */}
            <div className="h-full flex flex-col justify-between">
              {calcResult ? (
                <div className="glass-panel p-8 rounded-2xl border border-solar-orange/30 bg-solar-orange/[0.02] dark:bg-solar-orange/[0.03] space-y-6 h-full flex flex-col justify-between animate-fade-in">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-solar-orange"><Sun className="h-6 w-6 animate-spin" /></span>
                      <span>{t('resultsTitle')}</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-1">Based on solar offsets computed for Pakistan and standard grid configurations.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 my-4">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs text-slate-450 block font-semibold">{t('recSystemSize')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">{calcResult.size} kW</span>
                    </div>
                    
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs text-slate-450 block font-semibold">{t('estimatedCost')}</span>
                      <span className="text-2xl font-black text-solar-orange">
                        {formatPrice(calcResult.costUsd)}
                      </span>
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs text-slate-450 block font-semibold">{t('annualSavings')}</span>
                      <span className="text-2xl font-black text-green-600 dark:text-green-400">
                        {formatPrice(calcResult.savingsUsd)}
                      </span>
                    </div>

                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs text-slate-450 block font-semibold">{t('paybackPeriod')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-1 font-sans">
                        <Clock className="h-5 w-5 text-solar-orange shrink-0" />
                        <span>{calcResult.payback} {t('years')}</span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <HelpCircle className="h-5 w-5 text-solar-orange" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{t('netMeteringEligible')}</span>
                    </div>
                    <span className="font-black text-solar-orange">{calcResult.netMetering}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <a
                      href={`/quote?size=${calcResult.size}&type=${connectionType}&bill=${bill}`}
                      className="w-full text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold py-3.5 px-6 rounded-xl hover:bg-slate-800 hover:shadow-lg block transition-colors text-sm"
                    >
                      Book Free Structural Survey & Proposal
                    </a>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[300px] border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
                  <Sun className="h-14 w-14 text-slate-300 dark:text-slate-700 animate-pulse" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Enter monthly energy expenses to generate your Solar proposal</span>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-sans">
                    The calculator analyzes local solar yields, net-metering payback schedules, and estimates hardware requirements.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products Mini Slider */}
      <section className="py-20 select-none bg-slate-50 dark:bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tier-1 Hardware</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-sans">Top-tier panels, industrial MPPT controllers, and battery storage cells.</p>
            </div>
            <a
              href="/products"
              className="text-solar-orange hover:text-solar-deep font-bold text-sm flex items-center space-x-1 transition-all"
            >
              <span>All Products</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((prod) => (
              <div key={prod.id} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <span className="inline-block bg-solar-orange/10 border border-solar-orange/30 px-2 py-0.5 rounded text-[10px] text-solar-orange font-bold uppercase tracking-wider mb-3">
                    {prod.category === 'panels' ? t('panels') : prod.category === 'inverters' ? t('inverters') : t('batteries')}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-850 dark:text-white line-clamp-1">{prod.name}</h3>
                  <p className="text-xs text-slate-400 font-sans mt-1">Brand: {prod.brand}</p>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed font-sans">{prod.description}</p>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-sans uppercase">Price</span>
                    <span className="font-extrabold text-solar-orange text-lg">
                      {formatPrice(prod.price)}
                    </span>
                  </div>
                  <a
                    href={`/quote?product=${prod.id}`}
                    className="bg-primary-navy dark:bg-primary-blue hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    {t('addToQuote')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
