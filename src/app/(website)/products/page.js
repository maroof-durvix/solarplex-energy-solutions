'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useDb } from '@/context/DbContext';
import { Search, SlidersHorizontal, Info, Eye, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { products, loading } = useDb();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter products based on search term & category tab
  const filteredProducts = products.filter(prod => {
    const matchesTab = activeTab === 'all' || prod.category === activeTab;
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prod.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 select-none bg-slate-50 dark:bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('productCatalogTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-sans">
              {t('productCatalogSub')}
            </p>
          </div>

          {/* Filter Bar & Search */}
          <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: t('all') },
                { id: 'panels', label: t('panels') },
                { id: 'inverters', label: t('inverters') },
                { id: 'batteries', label: t('batteries') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-colors ${
                    activeTab === tab.id
                      ? 'bg-solar-orange text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-primary-blue text-slate-655 dark:text-slate-350'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 shadow-sm rounded-xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                placeholder={t('searchPlaceholder')}
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="text-center py-24">
              <span className="text-slate-500 text-sm font-semibold">{t('loading')}</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover-lift hover-glow"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-solar-orange/10 border border-solar-orange/20 px-2 py-0.5 rounded text-[10px] text-solar-orange font-bold uppercase tracking-wider">
                        {prod.category === 'panels' ? t('panels') : prod.category === 'inverters' ? t('inverters') : t('batteries')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans">
                        Stock: <span className="font-extrabold text-slate-600 dark:text-slate-300">{prod.stock} units</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-850 dark:text-white line-clamp-1">{prod.name}</h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">{t('brand')}: {prod.brand}</p>
                    <p className="text-sm text-slate-550 dark:text-slate-455 line-clamp-3 mt-2.5 leading-relaxed font-sans">{prod.description}</p>
                    
                    {/* Compact Specs list */}
                    <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-sans bg-slate-100 dark:bg-slate-900/60 p-3 rounded-lg">
                      {prod.efficiency && <div className="flex justify-between"><span>{t('efficiency')}</span><span className="font-bold">{prod.efficiency}</span></div>}
                      {prod.warranty && <div className="flex justify-between"><span>{t('warranty')}</span><span className="font-bold">{prod.warranty}</span></div>}
                      {prod.powerOutput && <div className="flex justify-between"><span>Output</span><span className="font-bold">{prod.powerOutput}</span></div>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-sans uppercase">Contractor Price</span>
                      <span className="font-black text-solar-orange text-lg">
                        {formatPrice(prod.price)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="p-2 border border-slate-300 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-primary-blue text-slate-500 transition-colors cursor-pointer"
                        title={t('viewDetails')}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/quote?product=${prod.id}`}
                        className="bg-primary-navy dark:bg-primary-blue hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <span>Request Proposal</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
              <SlidersHorizontal className="h-10 w-10 text-slate-350 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-bold">No solar hardware match for your search filters.</p>
            </div>
          )}

          {/* Specifications Modal */}
          {selectedProduct && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 animate-fade-in">
                
                {/* Modal Title */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs uppercase font-extrabold text-solar-orange tracking-wider">
                    {selectedProduct.category}
                  </span>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedProduct.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-sans">{selectedProduct.description}</p>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-sm font-sans">
                    <h4 className="font-extrabold text-slate-850 dark:text-white mb-2">{t('specifications')}</h4>
                    <div className="grid grid-cols-2 gap-3 text-slate-655 dark:text-slate-300">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-450">{t('brand')}</span>
                        <span className="font-bold">{selectedProduct.brand}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-450">Warranty</span>
                        <span className="font-bold">{selectedProduct.warranty}</span>
                      </div>
                      {selectedProduct.efficiency && (
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-450">Cell/Unit Efficiency</span>
                          <span className="font-bold">{selectedProduct.efficiency}</span>
                        </div>
                      )}
                      {selectedProduct.powerOutput && (
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-450">Power Rating</span>
                          <span className="font-bold">{selectedProduct.powerOutput}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xl font-black text-solar-orange">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedProduct(null)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-100"
                    >
                      Close
                    </button>
                    <Link
                      href={`/quote?product=${selectedProduct.id}`}
                      onClick={() => setSelectedProduct(null)}
                      className="bg-solar-orange hover:bg-solar-deep text-white font-bold text-xs px-4 py-2 rounded-lg"
                    >
                      Instant Proposal
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Battery Guide Section */}
          <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 select-none font-sans">
            <div className="text-center space-y-4 mb-12">
              <span className="text-xs uppercase font-extrabold tracking-widest text-solar-orange bg-solar-orange/10 px-3 py-1.5 rounded-full">
                Technical Buying Guide
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Lithium vs. Tubular Batteries
              </h2>
              <p className="text-slate-550 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                Make an informed decision. Here is a comprehensive comparison of battery technologies popular in Pakistan, along with estimated market price indicators.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Tech Comparison Table */}
              <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-4">Technology Comparison</h3>
                
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left rtl:text-right border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                        <th className="py-3 pr-4 font-bold">Feature</th>
                        <th className="py-3 px-4 font-extrabold text-solar-orange bg-solar-orange/5 dark:bg-solar-orange/10">Lithium (LiFePO4)</th>
                        <th className="py-3 pl-4 font-bold">Tubular Lead-Acid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-655 dark:text-slate-350">
                      <tr>
                        <td className="py-3.5 pr-4 font-bold">Expected Life</td>
                        <td className="py-3.5 px-4 font-black text-solar-orange bg-solar-orange/5 dark:bg-solar-orange/10">8 – 15 Years (6000+ Cycles)</td>
                        <td className="py-3.5 pl-4">2 – 5 Years</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 pr-4 font-bold">Maintenance</td>
                        <td className="py-3.5 px-4 font-black text-solar-orange bg-solar-orange/5 dark:bg-solar-orange/10">Zero Maintenance</td>
                        <td className="py-3.5 pl-4">Water Top-up Required</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 pr-4 font-bold">Charging Speed</td>
                        <td className="py-3.5 px-4 font-black text-solar-orange bg-solar-orange/5 dark:bg-solar-orange/10">Ultra Fast (1–2 Hours)</td>
                        <td className="py-3.5 pl-4">Slow (8–12 Hours)</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 pr-4 font-bold">Efficiency</td>
                        <td className="py-3.5 px-4 font-black text-solar-orange bg-solar-orange/5 dark:bg-solar-orange/10">High (95%+)</td>
                        <td className="py-3.5 pl-4">Low (75% – 80%)</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 pr-4 font-bold">Initial Cost</td>
                        <td className="py-3.5 px-4 font-black text-solar-orange bg-solar-orange/5 dark:bg-solar-orange/10">Higher Upfront</td>
                        <td className="py-3.5 pl-4">Lower Upfront</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 pr-4 font-bold">Long-term Cost</td>
                        <td className="py-3.5 px-4 font-black text-solar-orange bg-solar-orange/5 dark:bg-solar-orange/10">Lowest (No replacements)</td>
                        <td className="py-3.5 pl-4">High (Repeated purchase)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Ranges in Pakistan */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg bg-solar-orange/[0.01] dark:bg-solar-orange/[0.02]">
                  <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-1.5">Lithium Price Indicator</h3>
                  <p className="text-[10px] text-slate-400 font-sans mb-4">Estimated retail market rates in Pakistan (PKR)</p>
                  
                  <div className="space-y-2.5 font-sans">
                    {[
                      { cap: "2.5 kWh", price: "Rs. 130,000 – 180,000", desc: "Best for 3kW/5kW single inverter backups." },
                      { cap: "5.0 kWh", price: "Rs. 220,000 – 350,000", desc: "Standard capacity for average home hybrid systems." },
                      { cap: "10.0 kWh", price: "Rs. 500,000 – 850,000", desc: "For heavy residential loads and small commercial grids." },
                      { cap: "15-16 kWh", price: "Rs. 850,000 – 1,400,000", desc: "Optimized for large estates and commercial offices." },
                      { cap: "20.0 kWh+", price: "Rs. 1.5M – 2.8M", desc: "Industrial grade megawatt installations and heavy power racks." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-slate-105 dark:border-slate-850 pb-2 text-xs font-semibold">
                        <div>
                          <span className="font-extrabold text-slate-800 dark:text-white block">{item.cap}</span>
                          <span className="text-[9px] text-slate-450 block font-normal">{item.desc}</span>
                        </div>
                        <span className="font-black text-solar-orange font-sans">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Inverter Compatibility Card */}
            <div className="mt-8 glass-panel p-6 rounded-2xl border border-slate-250 dark:border-slate-800 shadow-md bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 font-sans text-center md:text-left">
                <h4 className="font-extrabold text-md flex items-center justify-center md:justify-start gap-1.5 text-white">
                  <Shield className="h-5 w-5 text-solar-orange shrink-0" />
                  <span>Smart Hybrid Inverter Compatibility</span>
                </h4>
                <p className="text-xs text-slate-400 max-w-xl font-normal leading-relaxed">
                  Inverex, Dyness, and Pylontech lithium batteries offer seamless grid communication and synchronization parameters with Fronus, Knox, Growatt, and Nitrox hybrid solar inverters.
                </p>
              </div>
              <Link
                href="/quote"
                className="bg-solar-orange hover:bg-solar-deep text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shrink-0 transition-colors shadow-md shadow-solar-orange/10 cursor-pointer"
              >
                Get a Customized System Quote &rarr;
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
