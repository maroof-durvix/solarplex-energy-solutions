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
  Users, 
  Wrench, 
  Package, 
  LogOut, 
  DollarSign, 
  Activity, 
  Plus, 
  Check, 
  Trash, 
  UserPlus, 
  MessageSquare,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, role, logout, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { 
    leads, 
    products, 
    projects, 
    technicians, 
    inventory, 
    tickets, 
    payments, 
    analytics,
    addRecord, 
    updateRecord, 
    deleteRecord,
    loading: dbLoading 
  } = useDb();

  // Active sub-sections: 'overview' | 'crm' | 'inventory' | 'projects' | 'tickets'
  const [activeTab, setActiveTab] = useState('overview');

  // Support ticket reply state
  const [replyText, setReplyText] = useState({});

  // Custom stock update input state
  const [customStock, setCustomStock] = useState({});

  // Lead dispatch assignment state
  const [assignTechId, setAssignTechId] = useState({});

  // Check auth
  useEffect(() => {
    if (!authLoading && (!user || role !== 'admin')) {
      router.push('/login');
    }
  }, [user, role, authLoading, router]);

  if (authLoading || dbLoading || !user || role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-semibold">Loading Admin Console...</div>;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Lead status updates
  const handleLeadStatus = async (leadId, nextStatus) => {
    try {
      await updateRecord('leads', leadId, { status: nextStatus });
      
      // If contracted, automatically generate a project entry!
      if (nextStatus === 'contracted') {
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
          const nextProj = {
            name: `${lead.name} Solar Setup`,
            clientName: lead.name,
            clientEmail: lead.email,
            location: lead.city,
            systemSize: `${Math.max(3, Math.round(lead.avgBill / 65 / 120))}kW Hybrid`,
            panelsUsed: 'Longi 580W (Allocated)',
            inverterUsed: 'Huawei Smart 10kW',
            batteryUsed: 'None',
            status: 'engineering',
            progress: 20,
            technician: 'Kafeel Ahmed Khan',
            startDate: new Date().toISOString().split('T')[0],
            targetDate: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
            netMeteringStatus: 'Not Started'
          };
          await addRecord('projects', nextProj);

          // Generate Invoice SP-YYYY-XXX
          const nextInv = {
            invoiceNumber: `SP-2026-${Math.floor(Math.random() * 900) + 100}`,
            customerName: lead.name,
            customerEmail: lead.email,
            amountUsd: Math.round((lead.avgBill / 65 / 120) * 950),
            description: `${Math.round(lead.avgBill / 65 / 120)}kW Solar Platform Installation Contract`,
            status: 'Unpaid',
            date: new Date().toISOString().split('T')[0]
          };
          await addRecord('payments', nextInv);
        }
      }
    } catch (e) {
      console.error("Error updates lead status:", e);
    }
  };

  // Lead technician assignment
  const handleLeadAssign = async (leadId) => {
    const techName = assignTechId[leadId];
    if (!techName) return;

    try {
      await updateRecord('leads', leadId, { assignedTo: techName });
      alert(`Assigned Lead to ${techName}`);
    } catch (e) {
      console.error(e);
    }
  };

  // Update inventory stock directly
  const handleUpdateStock = async (itemId, nextQty) => {
    try {
      await updateRecord('inventory', itemId, { 
        quantity: Number(nextQty),
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    } catch (e) {
      console.error("Error updating inventory:", e);
    }
  };

  // Support ticket resolution
  const handleTicketReply = async (ticketId) => {
    const reply = replyText[ticketId];
    if (!reply) return;

    try {
      await updateRecord('tickets', ticketId, { 
        status: 'resolved',
        reply: reply
      });
      setReplyText(prev => ({ ...prev, [ticketId]: '' }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeadDelete = async (leadId) => {
    if (confirm("Delete this CRM lead entry?")) {
      await deleteRecord('leads', leadId);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-primary-dark select-none">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <div className="bg-solar-orange p-1.5 rounded text-white">
              <Sun className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg text-white">Solar<span className="text-solar-orange">Plex</span></span>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1 font-sans">
            <span className="text-[10px] text-solar-orange uppercase tracking-wider font-bold">{t('roleAdmin')}</span>
            <h4 className="font-extrabold text-sm truncate">{user.name}</h4>
            <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
          </div>

          <nav className="flex flex-col space-y-1 font-sans">
            {[
              { id: 'overview', label: t('overview'), icon: Activity },
              { id: 'crm', label: t('crm'), icon: Users },
              { id: 'inventory', label: t('inventory'), icon: Package },
              { id: 'projects', label: 'Projects & Staff', icon: Wrench },
              { id: 'tickets', label: t('support'), icon: MessageSquare }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
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

        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-left text-red-400 hover:bg-red-500/10 flex items-center space-x-3 cursor-pointer font-sans"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>{t('logout')}</span>
        </button>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto relative overflow-hidden">
        
        {/* Shifting background glows */}
        <div className="absolute top-12 left-12 w-80 h-80 bg-solar-orange/5 dark:bg-solar-orange/10 rounded-full blur-3xl animate-float pointer-events-none z-0"></div>
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-primary-navy/10 dark:bg-primary-navy/20 rounded-full blur-3xl animate-float pointer-events-none z-0" style={{ animationDelay: '-3s' }}></div>

        {/* Content container */}
        <div className="relative z-10">
        
        {/* Top Header Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {activeTab === 'overview' ? 'Enterprise Control Center' : 
               activeTab === 'crm' ? t('crm') : 
               activeTab === 'inventory' ? t('inventory') : 
               activeTab === 'projects' ? 'Project Schedule & Dispatch' : t('support')}
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-0.5">SolarPlex Administrative Control Console</p>
          </div>

          <div className="flex items-center space-x-2 bg-solar-orange/10 border border-solar-orange/20 px-3.5 py-1.5 rounded-full text-solar-orange text-xs font-bold">
            <span className="h-2 w-2 bg-solar-orange rounded-full animate-ping"></span>
            <span>Real-time Sync Active</span>
          </div>
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
                <div className="bg-green-500 p-3.5 rounded-xl text-white">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="font-sans">
                  <span className="text-[10px] text-slate-455 uppercase block font-semibold">{t('totalRevenue')}</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatPrice(analytics.totalRevenue)}
                  </span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
                <div className="bg-solar-orange p-3.5 rounded-xl text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="font-sans">
                  <span className="text-[10px] text-slate-455 uppercase block font-semibold">{t('leadConversion')}</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">{analytics.leadConversionRate}%</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
                <div className="bg-blue-500 p-3.5 rounded-xl text-white">
                  <Wrench className="h-6 w-6" />
                </div>
                <div className="font-sans">
                  <span className="text-[10px] text-slate-455 uppercase block font-semibold">{t('activeInstalls')}</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">{analytics.activeInstallations}</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
                <div className="bg-red-500 p-3.5 rounded-xl text-white">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="font-sans">
                  <span className="text-[10px] text-slate-455 uppercase block font-semibold">{t('lowStockAlerts')}</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">{analytics.lowStockAlerts}</span>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Sales invoice records */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">{t('salesPurchases')}</h3>
                
                <div className="space-y-3 font-sans text-xs">
                  {payments.slice(0, 4).map((pay) => (
                    <div key={pay.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white">{pay.invoiceNumber} — {pay.customerName}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{pay.description}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-800 dark:text-white block">
                          {formatPrice(pay.amountUsd)}
                        </span>
                        <span className={`text-[9px] font-extrabold uppercase ${pay.status === 'Paid' ? 'text-green-550' : 'text-yellow-600'}`}>{pay.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roster active dispatch */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">{t('technicianDistribution')}</h3>
                
                <div className="space-y-3 font-sans text-xs">
                  {technicians.map((tech) => (
                    <div key={tech.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
                      <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                        <div className="bg-solar-orange text-white p-2 rounded-lg">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 dark:text-white">{tech.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{tech.role}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        tech.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400'
                      }`}>{tech.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab: CRM leads board */}
        {activeTab === 'crm' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Lead Pipeline & CRM Management</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse font-sans text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-455 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Profile</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Usage Details</th>
                    <th className="py-3 px-4">Pipeline Status</th>
                    <th className="py-3 px-4">Assign Staff</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-800 dark:text-white block">{lead.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{lead.phone} | {lead.email}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-500">{lead.connectionType}</td>
                      <td className="py-4 px-4 text-slate-500">{lead.city}</td>
                      <td className="py-4 px-4 text-slate-455 font-sans">
                        <span>Bill: {lead.avgBill} | Area: {lead.roofArea} sq.ft.</span>
                        {lead.notes && <span className="text-[9px] text-solar-orange block max-w-xs truncate mt-0.5" title={lead.notes}>{lead.notes}</span>}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleLeadStatus(lead.id, e.target.value)}
                          className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                        >
                          <option value="new">New Inquiry</option>
                          <option value="proposal_sent">Proposal Sent</option>
                          <option value="contracted">Contracted (Create Job)</option>
                          <option value="installed">Installed</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                          <select
                            value={assignTechId[lead.id] || lead.assignedTo || ''}
                            onChange={(e) => setAssignTechId(prev => ({ ...prev, [lead.id]: e.target.value }))}
                            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="">-- Assign Staff --</option>
                            {technicians.map(t => (
                              <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleLeadAssign(lead.id)}
                            className="p-1 bg-solar-orange text-white rounded hover:bg-solar-deep"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleLeadDelete(lead.id)}
                          className="p-1.5 border border-red-500/30 text-red-500 rounded hover:bg-red-500 hover:text-white"
                          title="Delete Lead"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Inventory page */}
        {activeTab === 'inventory' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Warehouse Stock Management</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse font-sans text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-455 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4">Component name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Warehouse Location</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Min Alert Level</th>
                    <th className="py-3 px-4">Status Alert</th>
                    <th className="py-3 px-4 text-center">Restock Command</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {inventory.map((item) => {
                    const isLow = item.quantity <= item.minAlert;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-white">{item.name}</td>
                        <td className="py-4 px-4 text-slate-455 uppercase text-[10px]">{item.category}</td>
                        <td className="py-4 px-4 text-slate-550">{item.location}</td>
                        <td className="py-4 px-4 font-extrabold text-slate-850 dark:text-slate-200">{item.quantity} units</td>
                        <td className="py-4 px-4 text-slate-455">{item.minAlert} units</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            isLow ? 'bg-red-105 text-red-800 dark:bg-red-500/10 dark:text-red-400 animate-pulse' : 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
                          }`}>
                            {isLow ? 'LOW STOCK' : 'IN STOCK'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <input
                              type="number"
                              value={customStock[item.id] !== undefined ? customStock[item.id] : item.quantity}
                              onChange={(e) => setCustomStock(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
                              className="w-16 px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-center font-bold text-[10px] text-slate-800 dark:text-white"
                            />
                            <button
                              onClick={() => handleUpdateStock(item.id, customStock[item.id] !== undefined ? customStock[item.id] : item.quantity)}
                              className="bg-solar-orange hover:bg-solar-deep text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Update</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Projects and Technicians list */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Active engineering projects list */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Active Solar Site Implementations</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right border-collapse font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-455 uppercase text-[10px] font-bold">
                      <th className="py-3 px-4">Project Name</th>
                      <th className="py-3 px-4">System Spec</th>
                      <th className="py-3 px-4">Assigned Engineer</th>
                      <th className="py-3 px-4">Completion Target</th>
                      <th className="py-3 px-4">Net Metering Status</th>
                      <th className="py-3 px-4 text-center">Progress Chart</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                        <td className="py-4 px-4">
                          <span className="font-extrabold text-slate-850 dark:text-white block">{proj.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{proj.location}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-sans">{proj.systemSize}</td>
                        <td className="py-4 px-4 text-slate-800 dark:text-slate-200">{proj.technician}</td>
                        <td className="py-4 px-4 text-slate-455">{proj.targetDate}</td>
                        <td className="py-4 px-4 font-bold text-solar-orange">{proj.netMeteringStatus}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2.5 rtl:space-x-reverse font-sans">
                            <div className="w-24 bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                              <div className="bg-solar-orange h-full" style={{ width: `${proj.progress}%` }}></div>
                            </div>
                            <span className="font-bold text-solar-orange text-[10px]">{proj.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab: Support tickets replies */}
        {activeTab === 'tickets' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Support Ticket Console</h3>

            <div className="space-y-6">
              {tickets.map((tick) => (
                <div 
                  key={tick.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 font-sans text-xs ${
                    tick.status === 'open' 
                      ? 'border-blue-500/30 bg-blue-500/[0.02] dark:bg-blue-500/[0.03]' 
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white block">{tick.subject}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Category: {tick.category} | From: {tick.customerName} ({tick.customerEmail})
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      tick.status === 'open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 animate-pulse' : 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
                    }`}>
                      {tick.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-500 dark:text-slate-450 leading-relaxed font-sans text-xs">{tick.message}</p>

                  {/* Reply Log */}
                  {tick.reply ? (
                    <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                      <span className="font-bold text-solar-orange block mb-1">Reply Sent:</span>
                      {tick.reply}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
                      <input
                        type="text"
                        value={replyText[tick.id] || ''}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [tick.id]: e.target.value }))}
                        className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-850 rounded-lg bg-white dark:bg-slate-950 focus:outline-none text-xs"
                        placeholder="Type resolution message..."
                      />
                      <button
                        onClick={() => handleTicketReply(tick.id)}
                        className="bg-solar-orange hover:bg-solar-deep text-white font-extrabold px-4 py-2 rounded-lg cursor-pointer"
                      >
                        Send Reply
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        </div>

      </main>
    </div>
  );
}
