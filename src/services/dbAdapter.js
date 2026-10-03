// Database adapter supporting dual Firebase Firestore and LocalStorage fallback

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where 
} from 'firebase/firestore';

// Firebase Client Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if firebase is configured
const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let db = null;
if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("Firebase Firestore successfully initialized.");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to mock database:", error);
  }
}

// --- SEED DATA FOR LOCAL STORAGE FALLBACK ---
const initialSeedData = {
  products: [
    { id: 'p1', name: 'Longi Hi-MO 6 Explorer 580W', category: 'panels', brand: 'Longi Solar', price: 210, efficiency: '22.5%', warranty: '15 Years Product, 25 Years Linear', powerOutput: '580W Mono-facial', stock: 240, description: 'High-performance solar panels utilizing HPBC cell technology, ideal for residential and commercial rooftops.' },
    { id: 'p2', name: 'Jinko Tiger Neo N-type 575W', category: 'panels', brand: 'Jinko Solar', price: 195, efficiency: '22.2%', warranty: '12 Years Product, 30 Years Linear', powerOutput: '575W N-Type Bifacial', stock: 180, description: 'N-Type solar panels featuring excellent LID performance and low temperature coefficient for maximized energy yield.' },
    { id: 'p3', name: 'Solis 3P20K-5G-P Inverter', category: 'inverters', brand: 'Solis', price: 1350, efficiency: '98.6%', warranty: '5 Years Standard, Extendable', powerOutput: '20 kW Three-Phase', stock: 8, description: 'Commercial-grade three-phase grid-tied inverter with multiple MPPT inputs for optimized solar yields.' },
    { id: 'p4', name: 'Huawei SUN2000-10KTL-M1', category: 'inverters', brand: 'Huawei', price: 1750, efficiency: '98.4%', warranty: '10 Years Standard', powerOutput: '10 kW Hybrid Three-Phase', stock: 15, description: 'Smart string energy storage controller supporting battery backup, net-metering, and active safety (AFCI).' },
    { id: 'p5', name: 'Tesla Powerwall 3 LFP', category: 'batteries', brand: 'Tesla', price: 6800, efficiency: '92.5%', warranty: '10 Years 100% capacity', powerOutput: '13.5 kWh Capacity, 5kW Continuous', stock: 4, description: 'Premium all-in-one home battery storage system providing whole-home backup power and load management.' },
    { id: 'p6', name: 'Narada 48V 100Ah LFP Battery', category: 'batteries', brand: 'Narada', price: 1150, efficiency: '95%', warranty: '5 Years Product', powerOutput: '4.8 kWh Capacity', stock: 45, description: 'Deep cycle lithium iron phosphate (LFP) battery module for off-grid and hybrid backup installations.' },
    
    // Inverters
    { id: 'p7', name: 'Inverex Nitrox 10kW Hybrid Inverter', category: 'inverters', brand: 'Inverex', price: 1650, efficiency: '97.8%', warranty: '5 Years Standard', powerOutput: '10 kW Hybrid Single-Phase', stock: 12, description: 'Smart hybrid solar inverter with double MPPT tracker, highly popular in Pakistan with excellent local customer service support.' },
    { id: 'p8', name: 'Fronus PV 9200 Hybrid Inverter', category: 'inverters', brand: 'Fronus', price: 1100, efficiency: '97.2%', warranty: '2 Years Standard', powerOutput: '6.2 kW Hybrid', stock: 14, description: 'Cost-effective high-yield hybrid inverter suitable for standard residential backups, highly compatible with local lithium batteries.' },
    { id: 'p9', name: 'Knox Krypton 12kW Hybrid', category: 'inverters', brand: 'Knox', price: 1450, efficiency: '97.6%', warranty: '5 Years Standard', powerOutput: '12 kW Hybrid Three-Phase', stock: 6, description: 'Budget-friendly premium hybrid three-phase inverter, supports smart load control and dual battery inputs.' },
    { id: 'p10', name: 'Growatt MOD 15KTL3-X', category: 'inverters', brand: 'Growatt', price: 1250, efficiency: '98.6%', warranty: '5 Years Standard', powerOutput: '15 kW Three-Phase On-Grid', stock: 10, description: 'High-efficiency string inverter with dual MPPT tracking, ideal for net-metered residential and commercial properties.' },
    
    // Lithium Batteries
    { id: 'p11', name: 'Inverex Powerwall LFP 5kWh', category: 'batteries', brand: 'Inverex', price: 1150, efficiency: '95%', warranty: '5 Years Product', powerOutput: '5.12 kWh Capacity', stock: 22, description: 'Smart wall-mount lithium battery pack (LiFePO4) featuring active cell balancing and excellent local warranty support.' },
    { id: 'p12', name: 'Dyness DL5.0C LFP 5.12kWh', category: 'batteries', brand: 'Dyness', price: 1050, efficiency: '94.5%', warranty: '10 Years 6000+ Cycles', powerOutput: '5.12 kWh Capacity', stock: 18, description: 'Durable, long-lasting LiFePO4 battery pack with 6000+ deep cycles, compact form-factor and reasonable local price.' },
    { id: 'p13', name: 'Pylontech UP5000 4.8kWh', category: 'batteries', brand: 'Pylontech', price: 1600, efficiency: '96%', warranty: '7 Years Standard', powerOutput: '4.8 kWh Capacity', stock: 8, description: 'Premium rackmount energy storage module with high depth-of-discharge (DoD), built for ultimate reliability.' },
    { id: 'p14', name: 'Knox Powerwall LFP 10kWh', category: 'batteries', brand: 'Knox', price: 2150, efficiency: '95%', warranty: '5 Years Standard', powerOutput: '10 kWh Capacity', stock: 5, description: 'Budget-friendly double capacity home energy storage system with clean LED status indicators.' },
    
    // Tubular Batteries
    { id: 'p15', name: 'Osaka TA-1800 Tubular Battery', category: 'batteries', brand: 'Osaka', price: 220, efficiency: '85%', warranty: '1 Year Lead Grid Warranty', powerOutput: '185 Ah Lead-Acid', stock: 60, description: 'Classic heavy-duty tubular lead-acid battery, highly popular and durable for traditional UPS and hybrid setups.' },
    { id: 'p16', name: 'Phoenix UGS-220 Tubular Battery', category: 'batteries', brand: 'Phoenix', price: 240, efficiency: '86%', warranty: '1 Year Standard', powerOutput: '200 Ah Lead-Acid', stock: 45, description: 'Durable deep cycle tubular battery designed for high backup times and robust performance under hot temperatures.' },
    { id: 'p17', name: 'Volta T-2500 Solar Battery', category: 'batteries', brand: 'Volta', price: 260, efficiency: '85%', warranty: '1 Year standard', powerOutput: '220 Ah Lead-Acid', stock: 50, description: 'Popular solar-optimized tubular battery requiring low water top-ups and offering stable daily discharge curves.' }
  ],
  leads: [
    { id: 'l1', name: 'Zubair Ahmad', phone: '+92 300 1234567', email: 'zubair.ahmad@gmail.com', address: 'Block D, Satellite Town', city: 'Rawalpindi', connectionType: 'Residential', avgBill: 160, roofArea: 1200, netMetering: 'Yes', notes: 'Needs a hybrid backup system for frequent load-shedding.', status: 'new', createdAt: '2026-06-24T10:30:00Z', assignedTo: '' },
    { id: 'l2', name: 'Faisal Malik', phone: '+92 321 9876543', email: 'faisal.malik@outlook.com', address: 'Phase 5, DHA', city: 'Lahore', connectionType: 'Commercial', avgBill: 780, roofArea: 4500, netMetering: 'Yes', notes: 'Quotation requested for 30kW Net-Metered On-Grid solution.', status: 'proposal_sent', createdAt: '2026-06-23T15:20:00Z', assignedTo: 'Kamran Shah' },
    { id: 'l3', name: 'Naveed Iqbal', phone: '+92 333 4455667', email: 'naveed.iqbal@textiles.com.pk', address: 'Industrial Area Phase 2', city: 'Faisalabad', connectionType: 'Industrial', avgBill: 3400, roofArea: 25000, netMetering: 'Yes', notes: 'Requires high-yield industrial panels and dual Solis inverters.', status: 'contracted', createdAt: '2026-06-20T09:00:00Z', assignedTo: 'Farhan Ali' },
    { id: 'l4', name: 'Ayesha Khan', phone: '+92 315 5566778', email: 'ayesha.khan@yahoo.com', address: 'Clifton Block 4', city: 'Karachi', connectionType: 'Residential', avgBill: 220, roofArea: 1800, netMetering: 'No', notes: 'Off-grid battery system. No net metering required.', status: 'new', createdAt: '2026-06-25T11:45:00Z', assignedTo: '' }
  ],
   projects: [
    { id: 'pr1', name: 'Zubair Ahmad Residence', clientName: 'Zubair Ahmad', clientEmail: 'zubair.ahmad@gmail.com', location: 'Rawalpindi', systemSize: '10kW Hybrid', panelsUsed: 'Jinko 575W (18 units)', inverterUsed: 'Huawei 10kW (1 unit)', batteryUsed: 'Narada LFP (2 units)', status: 'engineering', progress: 25, technician: 'Kafeel Ahmed Khan', startDate: '2026-06-24', targetDate: '2026-07-10', netMeteringStatus: 'Not Started' },
    { id: 'pr2', name: 'Faisal Malik Warehouse', clientName: 'Faisal Malik', clientEmail: 'faisal.malik@outlook.com', location: 'Lahore', systemSize: '30kW On-Grid', panelsUsed: 'Longi 580W (52 units)', inverterUsed: 'Solis 20kW (1 unit) + Solis 10kW', batteryUsed: 'None', status: 'installation', progress: 65, technician: 'Awais Ahmed Khan', startDate: '2026-06-18', targetDate: '2026-07-02', netMeteringStatus: 'Documents Submitted' },
    { id: 'pr3', name: 'Naveed Iqbal Factory', clientName: 'Naveed Iqbal', clientEmail: 'naveed.iqbal@textiles.com.pk', location: 'Faisalabad', systemSize: '150kW Net-Metered', panelsUsed: 'Longi 580W (260 units)', inverterUsed: 'Solis 50kW (3 units)', batteryUsed: 'None', status: 'commissioning', progress: 90, technician: 'Kafeel Ahmed Khan', startDate: '2026-06-01', targetDate: '2026-06-28', netMeteringStatus: 'Approved & Installed' }
  ],
  technicians: [
    { id: 't1', name: 'Kafeel Ahmed Khan', role: 'Owner & Lead Installer', contact: '03122469522', email: 'kafeel@solarplex.com', status: 'Active', rating: 4.9, activeJobs: 2 },
    { id: 't2', name: 'Awais Ahmed Khan', role: 'Installation Specialist', contact: '03155566778', email: 'awais@solarplex.com', status: 'Active', rating: 4.8, activeJobs: 1 }
  ],
  inventory: [
    { id: 'i1', name: 'Longi 580W Panels', category: 'panels', quantity: 240, minAlert: 50, location: 'Islamabad Warehouse', lastUpdated: '2026-06-25' },
    { id: 'i2', name: 'Jinko 575W Panels', category: 'panels', quantity: 180, minAlert: 40, location: 'Lahore Warehouse', lastUpdated: '2026-06-24' },
    { id: 'i3', name: 'Solis 20kW Inverters', category: 'inverters', quantity: 8, minAlert: 10, location: 'Islamabad Warehouse', lastUpdated: '2026-06-22' },
    { id: 'i4', name: 'Huawei 10kW Inverters', category: 'inverters', quantity: 15, minAlert: 5, location: 'Lahore Warehouse', lastUpdated: '2026-06-25' },
    { id: 'i5', name: 'Narada LFP Batteries', category: 'batteries', quantity: 45, minAlert: 15, location: 'Karachi Warehouse', lastUpdated: '2026-06-23' },
    { id: 'i6', name: 'MC4 Connectors (Pack of 100)', category: 'hardware', quantity: 120, minAlert: 30, location: 'Islamabad Warehouse', lastUpdated: '2026-06-25' },
    { id: 'i7', name: 'Solar Mounting Rails (10ft)', category: 'hardware', quantity: 18, minAlert: 20, location: 'Lahore Warehouse', lastUpdated: '2026-06-25' }
  ],
  tickets: [
    { id: 'tk1', subject: 'Net Metering Approval Delay', category: 'Billing/Net Metering', customerName: 'Faisal Malik', customerEmail: 'faisal.malik@outlook.com', message: 'The LESCO team has delayed net-metering validation. We need SolarPlex compliance documents again.', status: 'open', date: '2026-06-24T12:00:00Z', reply: '' },
    { id: 'tk2', subject: 'Inverter Monitoring App Offline', category: 'Hardware/Software', customerName: 'Zubair Ahmad', customerEmail: 'zubair.ahmad@gmail.com', message: 'Huawei FusionSolar app shows "Inverter Offline" since 9:00 AM yesterday. Generation seems active on display.', status: 'open', date: '2026-06-25T08:15:00Z', reply: '' },
    { id: 'tk3', subject: 'Invoice Download Failure', category: 'Account/Payments', customerName: 'Customer User', customerEmail: 'customer@solarplex.com', message: 'When clicking pay or download, the screen froze. Please resend the PDF invoice.', status: 'resolved', date: '2026-06-23T14:30:00Z', reply: 'Sent PDF to registered email.' }
  ],
  payments: [
    { id: 'py1', invoiceNumber: 'SP-2026-001', customerName: 'Zubair Ahmad', customerEmail: 'zubair.ahmad@gmail.com', amountUsd: 4500, description: '10kW Hybrid Solar Installation - 50% Upfront', status: 'Paid', date: '2026-06-10' },
    { id: 'py2', invoiceNumber: 'SP-2026-002', customerName: 'Faisal Malik', customerEmail: 'faisal.malik@outlook.com', amountUsd: 18500, description: '30kW Commercial Solar Installation - Stage 2 Progress', status: 'Partial', date: '2026-06-15' },
    { id: 'py3', invoiceNumber: 'SP-2026-003', customerName: 'Naveed Iqbal', customerEmail: 'naveed.iqbal@textiles.com.pk', amountUsd: 65000, description: '150kW Net-Metered Industrial Solar Contract', status: 'Unpaid', date: '2026-06-20' },
    { id: 'py4', invoiceNumber: 'SP-2026-004', customerName: 'Customer User', customerEmail: 'customer@solarplex.com', amountUsd: 5400, description: '8kW Residential Net-Metered Solar - Final Payment', status: 'Paid', date: '2026-06-22' }
  ]
};

// Initialize localStorage DB if using fallback
const getLocalStorageDb = () => {
  if (typeof window === 'undefined') return initialSeedData;
  
  let currentDb = {};
  Object.keys(initialSeedData).forEach(key => {
    const saved = localStorage.getItem(`solarplex_${key}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reseed if new default records are added in initialSeedData
        if (key === 'products' && parsed.length < initialSeedData.products.length) {
          localStorage.setItem(`solarplex_products`, JSON.stringify(initialSeedData.products));
          currentDb[key] = initialSeedData[key];
        } else if (key === 'technicians' && parsed.length !== initialSeedData.technicians.length) {
          localStorage.setItem(`solarplex_technicians`, JSON.stringify(initialSeedData.technicians));
          currentDb[key] = initialSeedData[key];
        } else if (key === 'projects' && parsed.some(p => p.technician === 'Farhan Ali' || p.technician === 'Sajid Khan')) {
          localStorage.setItem(`solarplex_projects`, JSON.stringify(initialSeedData.projects));
          currentDb[key] = initialSeedData[key];
        } else {
          currentDb[key] = parsed;
        }
      } catch (e) {
        currentDb[key] = initialSeedData[key];
      }
    } else {
      localStorage.setItem(`solarplex_${key}`, JSON.stringify(initialSeedData[key]));
      currentDb[key] = initialSeedData[key];
    }
  });
  
  return currentDb;
};

const saveLocalStorageDb = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`solarplex_${key}`, JSON.stringify(data));
  }
};

// --- DATA ADAPTERS ---

export const getDbData = async (collectionName) => {
  if (db) {
    try {
      const snap = await getDocs(collection(db, collectionName));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error(`Firebase fetch error on ${collectionName}, falling back to local:`, e);
    }
  }
  
  const localDb = getLocalStorageDb();
  return localDb[collectionName] || [];
};

export const addDbData = async (collectionName, newItem) => {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, collectionName), newItem);
      return { id: docRef.id, ...newItem };
    } catch (e) {
      console.error(`Firebase add error on ${collectionName}, falling back to local:`, e);
    }
  }
  
  const localDb = getLocalStorageDb();
  const list = localDb[collectionName] || [];
  const itemWithId = { id: `id_${Date.now()}`, ...newItem };
  list.push(itemWithId);
  saveLocalStorageDb(collectionName, list);
  return itemWithId;
};

export const updateDbData = async (collectionName, itemId, updatedFields) => {
  if (db) {
    try {
      const docRef = doc(db, collectionName, itemId);
      await updateDoc(docRef, updatedFields);
      return { id: itemId, ...updatedFields };
    } catch (e) {
      console.error(`Firebase update error on ${collectionName}, falling back to local:`, e);
    }
  }
  
  const localDb = getLocalStorageDb();
  const list = localDb[collectionName] || [];
  const index = list.findIndex(item => item.id === itemId);
  if (index !== -1) {
    list[index] = { ...list[index], ...updatedFields };
    saveLocalStorageDb(collectionName, list);
    return list[index];
  }
  return null;
};

export const deleteDbData = async (collectionName, itemId) => {
  if (db) {
    try {
      const docRef = doc(db, collectionName, itemId);
      await deleteDoc(docRef);
      return true;
    } catch (e) {
      console.error(`Firebase delete error on ${collectionName}, falling back to local:`, e);
    }
  }
  
  const localDb = getLocalStorageDb();
  const list = localDb[collectionName] || [];
  const filtered = list.filter(item => item.id !== itemId);
  saveLocalStorageDb(collectionName, filtered);
  return true;
};
