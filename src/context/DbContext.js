'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDbData, addDbData, updateDbData, deleteDbData } from '@/services/dbAdapter';

const DbContext = createContext();

export const DbProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const reloadData = async () => {
    setLoading(true);
    try {
      const [prodsData, leadsData, projData, techData, invData, tickData, payData] = await Promise.all([
        getDbData('products'),
        getDbData('leads'),
        getDbData('projects'),
        getDbData('technicians'),
        getDbData('inventory'),
        getDbData('tickets'),
        getDbData('payments')
      ]);

      setProducts(prodsData);
      setLeads(leadsData);
      setProjects(projData);
      setTechnicians(techData);
      setInventory(invData);
      setTickets(tickData);
      setPayments(payData);
    } catch (e) {
      console.error("Error loading database lists:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Generic helper handlers for UI to call
  const addRecord = async (collectionName, data) => {
    const newRecord = await addDbData(collectionName, data);
    await reloadData();
    return newRecord;
  };

  const updateRecord = async (collectionName, id, updatedFields) => {
    const updated = await updateDbData(collectionName, id, updatedFields);
    await reloadData();
    return updated;
  };

  const deleteRecord = async (collectionName, id) => {
    const result = await deleteDbData(collectionName, id);
    await reloadData();
    return result;
  };

  // Pre-calculated analytics summaries for Admin/Staff dashboard metrics
  const getAnalyticsSummary = () => {
    // 1. Total YTD revenue (sum of paid/partial invoice values)
    const totalRev = payments.reduce((acc, pay) => {
      if (pay.status === 'Paid') return acc + pay.amountUsd;
      if (pay.status === 'Partial') return acc + (pay.amountUsd * 0.5); // Assume 50% paid
      return acc;
    }, 0);

    // 2. Active installations (engineering, installation, or commissioning phases)
    const activeInstallsCount = projects.filter(p => 
      p.status === 'engineering' || p.status === 'installation' || p.status === 'commissioning'
    ).length;

    // 3. Lead conversion rate (percentage of leads converted to contracted status)
    const totalLeadsCount = leads.length;
    const contractedCount = leads.filter(l => l.status === 'contracted' || l.status === 'installed').length;
    const conversionRate = totalLeadsCount > 0 ? Math.round((contractedCount / totalLeadsCount) * 100) : 0;

    // 4. Low stock alerts (items below min alert levels)
    const lowStockCount = inventory.filter(i => i.quantity <= i.minAlert).length;

    return {
      totalRevenue: totalRev,
      activeInstallations: activeInstallsCount,
      leadConversionRate: conversionRate,
      lowStockAlerts: lowStockCount
    };
  };

  return (
    <DbContext.Provider value={{
      products,
      leads,
      projects,
      technicians,
      inventory,
      tickets,
      payments,
      loading,
      reloadData,
      addRecord,
      updateRecord,
      deleteRecord,
      analytics: getAnalyticsSummary()
    }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return context;
};
