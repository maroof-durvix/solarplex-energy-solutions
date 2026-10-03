'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useDb } from '@/context/DbContext';
import { 
  Sun, 
  TrendingUp, 
  Clock, 
  CreditCard, 
  MessageSquare, 
  LogOut, 
  CheckCircle, 
  Play, 
  AlertCircle,
  FileText,
  User,
  Plus
} from 'lucide-react';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, role, logout, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { formatPrice, formatPkrPrice } = useCurrency();
  const { projects, tickets, payments, addRecord, updateRecord, loading: dbLoading } = useDb();

  // Active state tab: 'overview' | 'invoices' | 'tickets'
  const [activeTab, setActiveTab] = useState('overview');

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Hardware/Software');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Live generation simulator values
  const [currentGeneration, setCurrentGeneration] = useState(4.2); // kW
  const [dailySavings, setDailySavings] = useState(250); // PKR
  const [totalAccumulatedKwh, setTotalAccumulatedKwh] = useState(1450); // kWh

  // Check auth
  useEffect(() => {
    if (!authLoading && (!user || role !== 'customer')) {
      router.push('/login');
    }
  }, [user, role, authLoading, router]);

  // Live Solar Yield Simulator (Simulates changing sun angles every few seconds)
  useEffect(() => {
    if (activeTab !== 'overview') return;

    const interval = setInterval(() => {
      // Simulate slight variance in solar generation
      setCurrentGeneration(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        const nextGen = Math.max(1.5, Math.min(8.5, prev + delta));
        
        // Accumulate daily metrics
        setDailySavings(ds => Math.round(ds + (nextGen * 0.05 * 278)));
        setTotalAccumulatedKwh(kwh => Math.round(kwh + (nextGen * 0.005)));
        
        return Number(nextGen.toFixed(2));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab]);

  if (authLoading || dbLoading || !user || role !== 'customer') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-semibold">Loading Portal...</div>;
  }

  // Filter lists specific to this customer's email
  const customerEmail = user.email;
  const myProjects = projects.filter(p => p.clientEmail === customerEmail);
  const myTickets = tickets.filter(t => t.customerEmail === customerEmail);
  const myPayments = payments.filter(p => p.customerEmail === customerEmail);

  // Get project progress
  const activeProject = myProjects[0] || projects[0]; // fallback to dummy if unregistered demo

  // Payment simulated action
  const handlePayment = async (paymentId) => {
    try {
      await updateRecord('payments', paymentId, { status: 'Paid' });
    } catch (e) {
      console.error("Error updates customer invoice payment:", e);
    }
  };

  // Support ticket submission
  const handleNewTicket = async (e) => {
    e.preventDefault();
    setTicketSuccess(false);

    const ticketData = {
      subject: ticketSubject,
      category: ticketCategory,
      customerName: user.name,
      customerEmail: user.email,
      message: ticketMessage,
      status: 'open',
      date: new Date().toISOString(),
      reply: ''
    };

    try {
      await addRecord('tickets', ticketData);
      setTicketSuccess(true);
      setTicketSubject('');
      setTicketMessage('');
    } catch (e) {
      console.error("Error creating ticket:", e);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-primary-dark select-none">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-solar-orange p-1.5 rounded text-white">
              <Sun className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg text-white">Solar<span className="text-solar-orange">Plex</span></span>
          </div>

          {/* User profile */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1 font-sans">
            <span className="text-[10px] text-solar-orange uppercase tracking-wider font-bold">{t('roleCustomer')}</span>
            <h4 className="font-extrabold text-sm truncate">{user.name}</h4>
            <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
          </div>

          {/* Nav List */}
          <nav className="flex flex-col space-y-1 font-sans">
            {[
              { id: 'overview', label: t('overview'), icon: Sun },
              { id: 'invoices', label: t('payments'), icon: CreditCard },
              { id: 'tickets', label: t('support'), icon: MessageSquare }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setTicketSuccess(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold text-left flex items-center space-x-3 cursor-pointer transition-colors ${
                    activeTab === item.id 
                      ? 'bg-solar-orange text-white' 
                      : 'hover:bg-slate-800 text-slate-350 hover:text-white'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-left text-red-400 hover:bg-red-500/10 flex items-center space-x-3 cursor-pointer font-sans"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>{t('logout')}</span>
        </button>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto relative overflow-hidden">
        
        {/* Shifting background glows */}
        <div className="absolute top-12 left-12 w-80 h-80 bg-solar-orange/5 dark:bg-solar-orange/10 rounded-full blur-3xl animate-float pointer-events-none z-0"></div>
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-primary-navy/10 dark:bg-primary-navy/20 rounded-full blur-3xl animate-float pointer-events-none z-0" style={{ animationDelay: '-3s' }}></div>

        {/* Content container */}
        <div className="relative z-10">
        
        {/* Header summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {activeTab === 'overview' ? t('customerDashboard') : activeTab === 'invoices' ? t('payments') : t('support')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              Account Reference: SP-CUST-{user.uid.slice(0, 6).toUpperCase()}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-solar-orange/10 border border-solar-orange/20 px-3.5 py-1.5 rounded-full text-solar-orange text-xs font-bold">
            <span className="h-2 w-2 bg-solar-orange rounded-full animate-ping"></span>
            <span>Live Sync Configured</span>
          </div>
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Live generation Simulator Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
                <div className="bg-solar-orange p-3.5 rounded-xl text-white">
                  <Sun className="h-6 w-6 animate-spin duration-5000" />
                </div>
                <div className="font-sans">
                  <span className="text-[10px] text-slate-455 uppercase block font-semibold">Live Solar Yield</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{currentGeneration} kW</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
                <div className="bg-green-500 p-3.5 rounded-xl text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="font-sans">
                  <span className="text-[10px] text-slate-455 uppercase block font-semibold">Today's Savings (Est)</span>
                  <span className="text-2xl font-black text-green-600 dark:text-green-400">
                    {formatPkrPrice(dailySavings)}
                  </span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
                <div className="bg-primary-navy dark:bg-primary-blue p-3.5 rounded-xl text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="font-sans">
                  <span className="text-[10px] text-slate-455 uppercase block font-semibold">Total Energy Generated</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{totalAccumulatedKwh} kWh</span>
                </div>
              </div>

            </div>

            {/* Project Progress Tracker */}
            {activeProject ? (
              <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-850 dark:text-white">{t('projectStatus')}</h3>
                  <span className="text-xs font-bold text-solar-orange uppercase tracking-wider font-sans bg-solar-orange/10 px-2.5 py-1 rounded-md">
                    {activeProject.systemSize} System
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-sans">
                    <span>Active Setup Checklist</span>
                    <span className="text-solar-orange">{activeProject.progress}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-solar-orange h-full rounded-full transition-all duration-1000"
                      style={{ width: `${activeProject.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Phases steps */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center font-sans">
                  {[
                    { id: 'engineering', label: '1. Engineering', val: 20 },
                    { id: 'procurement', label: '2. Logistics', val: 40 },
                    { id: 'installation', label: '3. Setup Install', val: 65 },
                    { id: 'commissioning', label: '4. Testing', val: 90 },
                    { id: 'net_metering', label: '5. Net Metering', val: 100 }
                  ].map((phase) => {
                    const isCompleted = activeProject.progress >= phase.val;
                    const isCurrent = activeProject.status === phase.id;

                    return (
                      <div 
                        key={phase.id} 
                        className={`p-3 rounded-xl border flex flex-col items-center space-y-1.5 ${
                          isCompleted ? 'border-green-550/20 bg-green-500/[0.03] text-green-600 dark:text-green-400' :
                          isCurrent ? 'border-solar-orange bg-solar-orange/[0.04] text-solar-orange font-bold' :
                          'border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        <CheckCircle className={`h-4.5 w-4.5 shrink-0 ${isCompleted ? 'text-green-500' : isCurrent ? 'text-solar-orange' : 'text-slate-300 dark:text-slate-800'}`} />
                        <span className="text-[10px] font-bold leading-tight">{phase.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
                <AlertCircle className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-450 font-bold">No active installation project logs found on file.</p>
              </div>
            )}

          </div>
        )}

        {/* Tab: Invoices */}
        {activeTab === 'invoices' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Billing and Account Invoices</h3>

            {myPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Cost</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {myPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-4 px-4 font-bold text-slate-700 dark:text-white">{pay.invoiceNumber}</td>
                        <td className="py-4 px-4 text-slate-500 max-w-xs truncate">{pay.description}</td>
                        <td className="py-4 px-4 text-slate-455">{pay.date}</td>
                        <td className="py-4 px-4 font-black text-slate-850 dark:text-slate-200">
                          {formatPrice(pay.amountUsd)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            pay.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' :
                            pay.status === 'Partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {pay.status !== 'Paid' ? (
                            <button
                              onClick={() => handlePayment(pay.id)}
                              className="bg-solar-orange hover:bg-solar-deep text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 mx-auto cursor-pointer"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              <span>{t('payNow')}</span>
                            </button>
                          ) : (
                            <span className="text-green-500 font-extrabold text-[10px] flex items-center justify-center space-x-1">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Paid</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-450 font-bold">{t('noInvoices')}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Tickets */}
        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Direct Ticket Form */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit lg:col-span-1">
              <h3 className="text-md font-black text-slate-900 dark:text-white mb-4">{t('supportTicketTitle')}</h3>
              
              {ticketSuccess && (
                <div className="bg-green-500/10 border border-green-500/35 text-green-700 dark:text-green-400 p-3 rounded-lg text-xs font-semibold mb-4 flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Ticket Logged Successfully!</span>
                </div>
              )}

              <form onSubmit={handleNewTicket} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1.5">{t('ticketSubject')}</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                    placeholder="Brief headline..."
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1.5">{t('ticketCategory')}</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                  >
                    <option value="Hardware/Software">Hardware/App</option>
                    <option value="Billing/Net Metering">Net Metering</option>
                    <option value="Sales/General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1.5">{t('ticketMessage')}</label>
                  <textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                    placeholder="Describe issue..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-solar-orange hover:bg-solar-deep text-white font-extrabold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-1 cursor-pointer text-xs uppercase"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('ticketSubmit')}</span>
                </button>
              </form>
            </div>

            {/* Past Inquiries List */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 lg:col-span-2 space-y-4">
              <h3 className="text-md font-black text-slate-900 dark:text-white">{t('ticketListTitle')}</h3>
              
              {myTickets.length > 0 ? (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {myTickets.map((tick) => (
                    <div 
                      key={tick.id}
                      className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 space-y-2.5 font-sans text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-white">{tick.subject}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          tick.status === 'open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400' :
                          'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
                        }`}>
                          {tick.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex space-x-3 text-[10px] text-slate-400">
                        <span>Category: {tick.category}</span>
                        <span>Date: {new Date(tick.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-500 leading-relaxed font-sans">{tick.message}</p>
                      
                      {tick.reply && (
                        <div className="bg-solar-orange/[0.04] border-l-2 border-solar-orange p-3 rounded-r-lg mt-3 text-slate-655 font-medium leading-relaxed">
                          <span className="font-bold text-solar-orange block mb-1">SolarPlex Engineering:</span>
                          {tick.reply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-455 font-bold">No support requests open on this account.</p>
                </div>
              )}
            </div>

          </div>
        )}

        </div>

      </main>
    </div>
  );
}
