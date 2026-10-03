'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useDb } from '@/context/DbContext';
import { 
  Sun, 
  Wrench, 
  Layers, 
  LogOut, 
  CheckSquare, 
  Square, 
  Send, 
  Warehouse,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

export default function StaffDashboard() {
  const router = useRouter();
  const { user, role, logout, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { projects, inventory, updateRecord, loading: dbLoading } = useDb();

  // Active Tab: 'jobs' | 'materials'
  const [activeTab, setActiveTab] = useState('jobs');

  // Selected project for checklist inspection
  const [selectedJobId, setSelectedJobId] = useState('');
  
  // Custom checklist simulation status
  const [checklist, setChecklist] = useState({
    survey: false,
    brackets: false,
    wiring: false,
    commission: false,
    discoCheck: false
  });

  // Material requests states
  const [reqItemId, setReqItemId] = useState('');
  const [reqQuantity, setReqQuantity] = useState(1);
  const [materialSuccess, setMaterialSuccess] = useState(false);

  // Check auth
  useEffect(() => {
    if (!authLoading && (!user || role !== 'staff')) {
      router.push('/login');
    }
  }, [user, role, authLoading, router]);

  // Set initial checklist when selected job changes
  useEffect(() => {
    const job = projects.find(p => p.id === selectedJobId);
    if (job) {
      // populate checklist based on progress percentage
      setChecklist({
        survey: job.progress >= 20,
        brackets: job.progress >= 40,
        wiring: job.progress >= 65,
        commission: job.progress >= 90,
        discoCheck: job.progress >= 100
      });
    }
  }, [selectedJobId, projects]);

  // Set default job on list load
  useEffect(() => {
    if (projects.length > 0 && !selectedJobId) {
      setSelectedJobId(projects[0].id);
    }
  }, [projects, selectedJobId]);

  if (authLoading || dbLoading || !user || role !== 'staff') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-semibold">Loading Staff Console...</div>;
  }

  // Filter jobs assigned to this technician (or all for demo/staff)
  const staffName = user.name;
  const myJobs = projects; // Show all so they have things to do in the demo

  const handleChecklistToggle = async (key, val) => {
    const nextChecklist = { ...checklist, [key]: val };
    setChecklist(nextChecklist);

    // Compute progress percent based on checks
    let count = 0;
    if (nextChecklist.survey) count += 20;
    if (nextChecklist.brackets) count += 20;
    if (nextChecklist.wiring) count += 25;
    if (nextChecklist.commission) count += 25;
    if (nextChecklist.discoCheck) count += 10;

    // determine string status
    let status = 'engineering';
    if (count >= 40) status = 'procurement';
    if (count >= 65) status = 'installation';
    if (count >= 90) status = 'commissioning';
    if (count === 100) status = 'installed';

    try {
      await updateRecord('projects', selectedJobId, { progress: count, status });
    } catch (e) {
      console.error("Error updates job checklist status:", e);
    }
  };

  const handleMaterialRequest = async (e) => {
    e.preventDefault();
    setMaterialSuccess(false);

    const item = inventory.find(i => i.id === reqItemId);
    if (!item) return;

    if (item.quantity < reqQuantity) {
      alert("Insufficient warehouse stock!");
      return;
    }

    try {
      // Reduce inventory level
      const nextQuantity = item.quantity - reqQuantity;
      await updateRecord('inventory', reqItemId, { 
        quantity: nextQuantity,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setMaterialSuccess(true);
      setReqQuantity(1);
    } catch (e) {
      console.error("Error issuing material requisition:", e);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const activeJob = projects.find(p => p.id === selectedJobId);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-primary-dark select-none">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          
          <div className="flex items-center space-x-2">
            <div className="bg-solar-orange p-1.5 rounded text-white">
              <Sun className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg text-white">Solar<span className="text-solar-orange">Plex</span></span>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-1 font-sans">
            <span className="text-[10px] text-solar-orange uppercase tracking-wider font-bold">{t('roleStaff')}</span>
            <h4 className="font-extrabold text-sm truncate">{user.name}</h4>
            <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
          </div>

          <nav className="flex flex-col space-y-1 font-sans">
            {[
              { id: 'jobs', label: 'My Installation Jobs', icon: Wrench },
              { id: 'materials', label: 'Warehouse Dispatch', icon: Warehouse }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMaterialSuccess(false);
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

        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-left text-red-400 hover:bg-red-500/10 flex items-center space-x-3 cursor-pointer font-sans"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          <span>{t('logout')}</span>
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto relative overflow-hidden">
        
        {/* Shifting background glows */}
        <div className="absolute top-12 left-12 w-80 h-80 bg-solar-orange/5 dark:bg-solar-orange/10 rounded-full blur-3xl animate-float pointer-events-none z-0"></div>
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-primary-navy/10 dark:bg-primary-navy/20 rounded-full blur-3xl animate-float pointer-events-none z-0" style={{ animationDelay: '-3s' }}></div>

        {/* Content container */}
        <div className="relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {activeTab === 'jobs' ? 'Field Engineering Center' : 'Warehouse Requisitions'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              Assigned Field Operator: Farhan Ali (ID: TECH-09)
            </p>
          </div>
        </div>

        {/* Tab: Jobs */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Job Selector list */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 lg:col-span-1 space-y-4 h-fit">
              <h3 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Active Assignments</h3>
              
              <div className="space-y-3 font-sans text-xs">
                {myJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full p-4 rounded-xl border text-left flex flex-col space-y-1.5 transition-all cursor-pointer ${
                      selectedJobId === job.id
                        ? 'border-solar-orange bg-solar-orange/[0.03] shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <span className="font-extrabold text-slate-800 dark:text-white block text-sm truncate">{job.name}</span>
                    <div className="flex justify-between items-center text-[10px] text-slate-450">
                      <span>{job.systemSize} System</span>
                      <span className="font-extrabold text-solar-orange">{job.progress}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist details block */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 lg:col-span-2 space-y-6">
              {activeJob ? (
                <div className="space-y-6">
                  
                  {/* Job Header */}
                  <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeJob.name}</h3>
                      <p className="text-xs text-slate-400 font-sans">Location: {activeJob.location} | Net Metering: {activeJob.netMeteringStatus}</p>
                    </div>
                    <span className="bg-solar-orange/10 px-3 py-1 rounded text-solar-orange text-xs font-bold font-sans">
                      {activeJob.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Checklist checkboxes */}
                  <div className="space-y-4">
                    <h4 className="font-black text-sm text-slate-800 dark:text-white mb-2">Technical Installation Progress Checklist</h4>
                    
                    <div className="space-y-3 font-sans text-xs">
                      {[
                        { key: 'survey', label: '1. Engineering site survey completed (20%)', desc: 'Roof structural load confirmed, shadowing analyzed.' },
                        { key: 'brackets', label: '2. Support mounts and galvanized structural anchoring installed (40%)', desc: 'Wind load stability completed, earthing pit validated.' },
                        { key: 'wiring', label: '3. DC/AC wiring and combiner strings linked to inverters (65%)', desc: 'String voltages mapped, AC breaker box commissioned.' },
                        { key: 'commission', label: '4. System startup diagnostics and safety test OK (90%)', desc: 'Phase sync validation, hybrid charge parameters logged.' },
                        { key: 'discoCheck', label: '5. Green Bidirectional meter active & net-metering validation (100%)', desc: 'Grid export verified with NEPRA and DISCO engineering.' }
                      ].map((item) => {
                        const isChecked = checklist[item.key];
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleChecklistToggle(item.key, !isChecked)}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-left flex items-start space-x-3 cursor-pointer transition-colors"
                          >
                            <span className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckSquare className="h-5 w-5 text-green-550" />
                              ) : (
                                <Square className="h-5 w-5 text-slate-350 dark:text-slate-850" />
                              )}
                            </span>
                            <div>
                              <span className={`font-bold block text-sm ${isChecked ? 'text-green-600 dark:text-green-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                                {item.label}
                              </span>
                              <span className="text-slate-455 text-[11px] font-sans mt-0.5 block leading-relaxed">{item.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 font-bold text-sm">Select an assignment to track.</div>
              )}
            </div>

          </div>
        )}

        {/* Tab: Materials */}
        {activeTab === 'materials' && (
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-6 animate-fade-in">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Request Hardware Requisition</h3>
            <p className="text-xs text-slate-500 font-sans">Withdraw parts from warehouses to allocate to active site installation layouts.</p>

            {materialSuccess && (
              <div className="bg-green-500/10 border border-green-500/35 text-green-700 dark:text-green-400 p-3 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4" />
                <span>Inventory Requisition Completed! Warehouse stock levels updated.</span>
              </div>
            )}

            <form onSubmit={handleMaterialRequest} className="space-y-5 font-sans text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1.5">Select Hardware Component</label>
                <select
                  value={reqItemId}
                  onChange={(e) => {
                    setReqItemId(e.target.value);
                    setMaterialSuccess(false);
                  }}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                  required
                >
                  <option value="">-- Choose Equipment --</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.location}) — {item.quantity} available
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1.5">Quantity to Withdraw</label>
                <input
                  type="number"
                  value={reqQuantity}
                  onChange={(e) => {
                    setReqQuantity(Number(e.target.value));
                    setMaterialSuccess(false);
                  }}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100 dark:bg-slate-900 focus:outline-none focus:border-solar-orange text-sm font-medium"
                  min="1"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-solar-orange hover:bg-solar-deep text-white font-extrabold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-1.5 text-xs uppercase"
              >
                <Send className="h-4.5 w-4.5" />
                <span>Issue Warehouse Requisition</span>
              </button>
            </form>
          </div>
        )}

        </div>

      </main>
    </div>
  );
}
