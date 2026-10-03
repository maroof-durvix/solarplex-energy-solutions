'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useDb } from '@/context/DbContext';
import { useAuth } from '@/context/AuthContext';
import { User, ClipboardList, CheckCircle, ArrowRight, ArrowLeft, Lock, LogIn, ShieldAlert } from 'lucide-react';

function QuoteForm() {
  const { t } = useLanguage();
  const { addRecord } = useDb();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Wizard Steps: 1 = Contact Details, 2 = Energy Profile, 3 = Complete
  const [step, setStep] = useState(1);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Rawalpindi',
    connectionType: 'Residential',
    avgBill: 35000,
    roofArea: 1200,
    netMetering: 'Yes',
    notes: ''
  });

  // Pre-fill fields from user session
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Load params from URL query strings
  useEffect(() => {
    const size = searchParams.get('size');
    const type = searchParams.get('type');
    const billVal = searchParams.get('bill');
    const prodId = searchParams.get('product');

    setFormData(prev => ({
      ...prev,
      connectionType: type || prev.connectionType,
      avgBill: billVal ? Number(billVal) : prev.avgBill,
      notes: prodId ? `Interested in product ID: ${prodId}. ` : prev.notes
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const leadRecord = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      connectionType: formData.connectionType,
      avgBill: Number(formData.avgBill),
      roofArea: Number(formData.roofArea),
      netMetering: formData.netMetering,
      notes: formData.notes,
      status: 'new',
      createdAt: new Date().toISOString(),
      assignedTo: ''
    };

    try {
      await addRecord('leads', leadRecord);
      setStep(3);
    } catch (err) {
      console.error("Lead submission error:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto text-center space-y-4">
        <div className="animate-pulse flex flex-col items-center space-y-3">
          <div className="h-8 w-8 bg-solar-orange/20 rounded-full animate-bounce"></div>
          <span className="text-sm text-slate-500 font-bold">Verifying authentication status...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-2xl max-w-lg mx-auto text-center space-y-6 animate-fade-in bg-white dark:bg-slate-900 select-none">
        <div className="bg-red-550/10 text-red-500 p-4 rounded-2xl w-fit mx-auto border border-red-500/20">
          <Lock className="h-8 w-8 text-solar-orange mx-auto" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Authentication Required</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed max-w-sm mx-auto">
            To book a free structural survey and request a custom SolarPlex proposal, please sign in to your client account. 
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-850/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed text-left">
          • <strong>Fast & Free:</strong> Register as a Solar Partner in seconds.<br />
          • <strong>Track Progress:</strong> View real-time installation phase updates.<br />
          • <strong>Simulate Output:</strong> Track daily power production and lifetime financial offsets.
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse pt-2">
          <button
            onClick={() => router.push('/login?redirect=/quote')}
            className="flex-1 bg-solar-orange hover:bg-solar-deep text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-1.5 text-xs"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In / Sign Up</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 px-6 rounded-xl text-xs cursor-pointer"
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto select-none">
      
      {/* Step Indicators */}
      <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-8">
        <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-solar-orange font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${step >= 1 ? 'border-solar-orange bg-solar-orange/10' : 'border-slate-350'}`}>1</span>
          <span className="hidden sm:inline text-xs">{t('stepPersonal')}</span>
        </div>
        <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
        <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-solar-orange font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${step >= 2 ? 'border-solar-orange bg-solar-orange/10' : 'border-slate-350'}`}>2</span>
          <span className="hidden sm:inline text-xs">{t('stepEnergy')}</span>
        </div>
        <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
        <div className={`flex items-center space-x-1.5 ${step === 3 ? 'text-solar-orange font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${step === 3 ? 'border-solar-orange bg-solar-orange/10' : 'border-slate-350'}`}>3</span>
          <span className="hidden sm:inline text-xs">Finish</span>
        </div>
      </div>

      {/* Step 1: Personal Contact */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-5 animate-fade-in">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
            <User className="h-5 w-5 text-solar-orange" />
            <span>{t('stepPersonal')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('fullName')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('phone')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('address')}</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('city')}</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
              >
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-solar-orange hover:bg-solar-deep text-white font-bold px-6 py-3 rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Energy Profile */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-solar-orange" />
            <span>{t('stepEnergy')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('connectionType')}</label>
              <select
                name="connectionType"
                value={formData.connectionType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
              >
                <option value="Residential">{t('connectionRes')}</option>
                <option value="Commercial">{t('connectionComm')}</option>
                <option value="Industrial">{t('connectionInd')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Avg Monthly Electric Expense</label>
              <input
                type="number"
                name="avgBill"
                value={formData.avgBill}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('roofArea')}</label>
              <input
                type="number"
                name="roofArea"
                value={formData.roofArea}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('netMeteringInterest')}</label>
              <select
                name="netMetering"
                value={formData.netMetering}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('notes')}</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium font-sans"
              placeholder="e.g. standard panel preferences, structural roof details..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="border border-slate-355 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-655 dark:text-slate-300 font-bold px-6 py-3 rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="bg-solar-orange hover:bg-solar-deep text-white font-extrabold px-8 py-3 rounded-xl flex items-center space-x-1 cursor-pointer"
            >
              <span>Submit Proposal Request</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Success Screen */}
      {step === 3 && (
        <div className="text-center py-10 space-y-6 animate-fade-in">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Request Received!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
            {t('submitSuccess')}
          </p>
          <div className="pt-4 flex justify-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-2.5 rounded-xl text-sm"
            >
              Back Home
            </button>
            <button
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: 'Rawalpindi',
                  connectionType: 'Residential',
                  avgBill: 35000,
                  roofArea: 1200,
                  netMetering: 'Yes',
                  notes: ''
                });
                setStep(1);
              }}
              className="border border-slate-300 dark:border-slate-700 font-bold px-6 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300"
            >
              Submit Another
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function QuotePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50 dark:bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-12 select-none">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Get an Enterprise Solar proposal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-sans">
              Provide your details and roof configuration to customize your system size, finance margins, and return calculations.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-20">Loading Quote Wizard...</div>}>
            <QuoteForm />
          </Suspense>

        </div>
      </main>

      <Footer />
    </div>
  );
}
