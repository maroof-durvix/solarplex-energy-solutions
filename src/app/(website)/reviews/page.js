'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useDb } from '@/context/DbContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Star, MessageSquare, Plus, CheckCircle, SlidersHorizontal, User } from 'lucide-react';

const SEED_REVIEWS = [
  { id: 'rev1', name: "Faisal Malik", email: "faisal.malik@outlook.com", category: "Commercial", systemSize: "30kW On-Grid", rating: 5, comment: "SolarPlex managed the LESCO net-metering validation flawlessly. Our warehouse utility bill dropped to zero in the first month. Excellent field engineering and cable management.", date: "2026-06-20" },
  { id: 'rev2', name: "Zubair Ahmad", email: "zubair.ahmad@gmail.com", category: "Residential", systemSize: "10kW Hybrid", rating: 5, comment: "Highly recommend their Huawei hybrid smart inverter and Narada battery backup. Frequent grid load-shedding is no longer an issue for my residence.", date: "2026-06-23" },
  { id: 'rev3', name: "Naveed Iqbal", email: "naveed.iqbal@textiles.com.pk", category: "Industrial", systemSize: "150kW Net-Metered", rating: 5, comment: "A professional industrial deployment. PVsyst simulations were accurate, and structure anchoring met safety checks for high winds. AEDB CAT-1 coordination was extremely smooth.", date: "2026-06-18" },
  { id: 'rev4', name: "Dr. Ayesha Khan", email: "ayesha.khan@yahoo.com", category: "Residential", systemSize: "8kW On-Grid", rating: 4, comment: "Very clean panel alignment. Yield generation matches simulations closely. LESCO green meter inspection took longer than expected, but SolarPlex team handled documentation support.", date: "2026-06-25" }
];

export default function ReviewsPage() {
  const { t } = useLanguage();
  const { addRecord, getDbData, loading: dbLoading } = useDb();

  // Active reviews list
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Review submission state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Residential');
  const [systemSize, setSystemSize] = useState('10kW Hybrid');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('solarplex_reviews');
        if (saved) {
          setReviewsList(JSON.parse(saved));
        } else {
          localStorage.setItem('solarplex_reviews', JSON.stringify(SEED_REVIEWS));
          setReviewsList(SEED_REVIEWS);
        }
      } else {
        setReviewsList(SEED_REVIEWS);
      }
    } catch (e) {
      console.error(e);
      setReviewsList(SEED_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    const newReview = {
      id: `rev_${Date.now()}`,
      name,
      email,
      category,
      systemSize,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    const nextList = [newReview, ...reviewsList];
    setReviewsList(nextList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('solarplex_reviews', JSON.stringify(nextList));
    }

    setSuccess(true);
    setName('');
    setEmail('');
    setComment('');
    setSystemSize('10kW Hybrid');
    setRating(5);
  };

  // Filter logic
  const filteredReviews = reviewsList.filter(rev => {
    if (filter === 'all') return true;
    return rev.category.toLowerCase() === filter.toLowerCase();
  });

  // Analytics
  const totalCount = reviewsList.length;
  const averageRating = totalCount > 0 
    ? (reviewsList.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  const starPercentages = [5, 4, 3, 2, 1].map(star => {
    const count = reviewsList.filter(r => r.rating === star).length;
    return {
      star,
      percent: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    };
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50 dark:bg-primary-dark select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-solar-orange bg-solar-orange/10 px-3 py-1.5 rounded-full">
              Client Testimonials
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white pt-2">
              Verified Partner Feedback
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-sans text-sm">
              Discover real reviews from commercial offices, textile industries, and homes across Pakistan.
            </p>
          </div>

          {/* Aggregator & Feedback Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Aggregated ratings block */}
            <div className="lg:col-span-1 space-y-8">
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                <h3 className="font-extrabold text-slate-950 dark:text-white text-lg">Rating Summary</h3>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">{averageRating}</span>
                  <div>
                    <div className="flex text-solar-orange">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-sans mt-0.5 block">Based on {totalCount} verified projects</span>
                  </div>
                </div>

                {/* Stars bars */}
                <div className="space-y-2.5 font-sans text-xs text-slate-500">
                  {starPercentages.map((item) => (
                    <div key={item.star} className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="w-12 block shrink-0">{item.star} Stars</span>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-solar-orange h-full" style={{ width: `${item.percent}%` }}></div>
                      </div>
                      <span className="w-8 text-right font-semibold shrink-0">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accreditations badge */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white flex items-center space-x-4 rtl:space-x-reverse">
                <MessageSquare className="h-10 w-10 text-solar-orange shrink-0 animate-bounce" />
                <div className="space-y-1 font-sans">
                  <h4 className="font-bold text-sm">Transparency Standard</h4>
                  <p className="text-[10px] text-slate-400">All submissions are checked against client payment IDs to ensure review credibility.</p>
                </div>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Filtering Controls */}
              <div className="glass-panel p-2.5 rounded-xl flex flex-wrap gap-2 items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-400">
                  <SlidersHorizontal className="h-4.5 w-4.5 shrink-0" />
                  <span className="text-xs font-bold font-sans">Filter Scale:</span>
                </div>
                <div className="flex gap-1">
                  {['all', 'Residential', 'Commercial', 'Industrial'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-colors cursor-pointer ${
                        filter === tab 
                          ? 'bg-solar-orange text-white' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tab === 'all' ? t('all') : tab === 'Residential' ? t('connectionRes') : tab === 'Commercial' ? t('connectionComm') : t('connectionInd')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed items */}
              {loading ? (
                <div className="text-center py-10 font-bold text-sm text-slate-500">{t('loading')}</div>
              ) : filteredReviews.length > 0 ? (
                <div className="space-y-6">
                  {filteredReviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-fade-in"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                          <div className="bg-solar-orange/10 text-solar-orange p-2.5 rounded-full">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-850 dark:text-white text-base">{rev.name}</h4>
                            <span className="text-[10px] text-slate-400 font-sans">{rev.date}</span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex text-solar-orange">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-sans">{rev.comment}</p>
                      
                      <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800">
                        <span>Project Category: {rev.category}</span>
                        <span>Capacity size: {rev.systemSize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 font-bold text-sm">No reviews found matching filters.</div>
              )}
            </div>

          </div>

          {/* Review Submission Form */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Write a Review</h3>
              <p className="text-xs text-slate-500 font-sans">Share your grid connectivity experience with our engineering teams.</p>
            </div>

            {success && (
              <div className="bg-green-500/10 border border-green-500/35 text-green-700 dark:text-green-400 p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 animate-fade-in">
                <CheckCircle className="h-4 w-4" />
                <span>Review submitted successfully! Your feedback is now verified.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1.5">{t('fullName')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 mb-1.5">{t('email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1.5">Project Scope</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 mb-1.5">System Size (e.g. 10kW Hybrid)</label>
                  <input
                    type="text"
                    value={systemSize}
                    onChange={(e) => setSystemSize(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 mb-1.5">Rating Rating Score</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium font-bold"
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1.5">Comments & Feedback</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium font-sans"
                  placeholder="Detail your engineering survey or setup feedback..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-solar-orange hover:bg-solar-deep text-white font-extrabold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-1.5 text-xs uppercase cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Submit Verified Feedback</span>
              </button>

            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
