'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useDb } from '@/context/DbContext';
import { MapPin, Phone, Mail, Award, CheckCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();
  const { addRecord } = useDb();

  const [formData, setFormData] = useState({
    subject: '',
    category: 'Hardware/Software',
    customerName: '',
    customerEmail: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newTicket = {
      subject: formData.subject,
      category: formData.category,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      message: formData.message,
      status: 'open',
      date: new Date().toISOString(),
      reply: ''
    };

    try {
      await addRecord('tickets', newTicket);
      setSubmitted(true);
      setFormData({
        subject: '',
        category: 'Hardware/Software',
        customerName: '',
        customerEmail: '',
        message: ''
      });
    } catch (e) {
      console.error("Error creating contact ticket:", e);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-16 bg-slate-50 dark:bg-primary-dark select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {t('contact')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-sans">
              Connect with our corporate offices in Pakistan or open a direct engineering ticket below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Details & Certification Card */}
            <div className="space-y-8">
              <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Headquarters</h3>
                
                <div className="space-y-4 text-sm font-sans">
                  <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                    <MapPin className="h-6 w-6 text-solar-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">Karachi Headquarters</span>
                      <span className="text-slate-500">D-27 Kauser Town Malir Karachi, Pakistan</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                    <Phone className="h-5 w-5 text-solar-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">Owner & Operations Hotlines</span>
                      <span className="text-slate-500">03122469522 (Kafeel Ahmed Khan)</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3.5 rtl:space-x-reverse">
                    <Mail className="h-5 w-5 text-solar-orange shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block">Corporate Email</span>
                      <span className="text-slate-500">info@solarplex.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accreditation Badge */}
              <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4 rtl:space-x-reverse bg-slate-900 text-white">
                <Award className="h-12 w-12 text-solar-orange shrink-0" />
                <div className="space-y-1 font-sans">
                  <h4 className="font-bold text-md">AEDB Certified Contractor</h4>
                  <p className="text-xs text-slate-400">Class CAT-1 registration. Permitted to design, supply, and validate Net Metering systems up to 1MW capacity.</p>
                </div>
              </div>
            </div>

            {/* Direct Ticket Form */}
            <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Open Direct Inquiry / Support Ticket</h3>
              
              {submitted ? (
                <div className="text-center py-10 space-y-4 animate-fade-in">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Ticket Submitted Successfully!</h4>
                  <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto">
                    Your inquiry has been stored under ticket references. Our staff representatives will reply via email within 24 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-solar-orange text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('fullName')}</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('email')}</label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('ticketSubject')}</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                        placeholder="e.g. Net Metering status query"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('ticketCategory')}</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                      >
                        <option value="Hardware/Software">Hardware</option>
                        <option value="Billing/Net Metering">Net Metering</option>
                        <option value="Sales/General">General Sales</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('ticketMessage')}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium font-sans"
                      placeholder="Detail your question..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-solar-orange hover:bg-solar-deep text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer text-sm"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
