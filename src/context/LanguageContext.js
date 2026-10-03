'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About Us",
    services: "Services",
    products: "Products",
    installation: "Installations",
    portfolio: "Portfolio",
    quote: "Request a Quote",
    blog: "Blog & News",
    contact: "Contact Us",
    reviews: "Reviews",
    portal: "Client Portal",
    adminDashboard: "Admin Console",
    staffDashboard: "Staff Dashboard",
    customerDashboard: "My SolarPlex",
    login: "Log In",
    logout: "Log Out",
    languageLabel: "اردو",
    currencyLabel: "Currency",

    // Common UI elements
    submit: "Submit",
    loading: "Loading...",
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    viewDetails: "View Details",
    actions: "Actions",
    status: "Status",
    date: "Date",
    amount: "Amount",
    invoice: "Invoice",
    payNow: "Pay Now",

    // Home Page Hero
    heroTitle: "Premium Enterprise Solar Energy Solutions",
    heroSub: "Empowering Pakistan and international markets with high-yield solar installations, intelligent smart-grid monitoring, and complete lifecycle project management.",
    getStarted: "Calculate Savings",
    learnMore: "Our Services",
    statsActiveProjects: "Active Projects",
    statsCapacityInstalled: "Capacity Installed",
    statsSatisfiedClients: "Satisfied Clients",
    statsCarbonReduced: "CO2 Reduced",

    // Savings Calculator
    calcTitle: "Instant Solar Savings Calculator",
    calcSub: "Estimate your solar requirements and payback period in seconds",
    billLabel: "Average Monthly Electricity Bill",
    connectionType: "Connection Type",
    connectionRes: "Residential",
    connectionComm: "Commercial",
    connectionInd: "Industrial",
    calcBtn: "Calculate Now",
    resultsTitle: "Your Solar Estimate",
    recSystemSize: "Recommended System",
    estimatedCost: "Estimated Setup Cost",
    annualSavings: "Annual Electricity Savings",
    paybackPeriod: "Estimated Payback Period",
    years: "Years",
    netMeteringEligible: "Net Metering Eligible",
    yes: "Yes",
    no: "No",

    // Products
    productCatalogTitle: "Enterprise Solar Products",
    productCatalogSub: "Tier-1 solar panels, smart inverters, and high-efficiency battery storage system solutions.",
    all: "All Products",
    panels: "Solar Panels",
    inverters: "Smart Inverters",
    batteries: "Battery Storage",
    searchPlaceholder: "Search solar equipment...",
    brand: "Brand",
    efficiency: "Efficiency",
    warranty: "Warranty",
    powerOutput: "Power Output",
    capacity: "Capacity",
    addToQuote: "Add to Quote",
    specifications: "Technical Specifications",
    priceRange: "Price Range",

    // Quote Request
    quoteTitle: "Request an Enterprise Solar Proposal",
    quoteSub: "Submit your details and energy patterns for a customized structural and financial proposal.",
    stepPersonal: "Contact Details",
    stepEnergy: "Energy Profile",
    stepReview: "Review & Submit",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    address: "Property Address",
    city: "City",
    monthlyBill: "Avg. Monthly Bill",
    roofArea: "Estimated Roof Area (sq. ft.)",
    netMeteringInterest: "Interested in Net Metering?",
    notes: "Special Requirements / Notes",
    submitSuccess: "Proposal Request Submitted Successfully! Our engineering team will contact you shortly.",

    // Dashboard General
    welcome: "Welcome back",
    roleAdmin: "Administrator",
    roleStaff: "Operations Specialist",
    roleCustomer: "Solar Partner",
    overview: "Overview",
    analytics: "Analytics",
    crm: "Lead & CRM Management",
    inventory: "Inventory Control",
    installations: "Installations",
    technicians: "Technicians & Staff",
    support: "Support Desk",
    payments: "Payments & Invoices",
    settings: "Settings",

    // Customer Portal
    projectStatus: "Project Implementation Status",
    currentPhase: "Current Phase",
    liveGenerationSim: "Solar Performance Simulator (Live)",
    simulatedOutput: "Simulated Daily Generation",
    lifetimeSavings: "Lifetime Financial Savings",
    totalPaymentsDue: "Total Outstanding Payments",
    noInvoices: "No invoices found.",
    supportTicketTitle: "Open Support Request",
    ticketSubject: "Subject",
    ticketCategory: "Category",
    ticketMessage: "Message / Issue Details",
    ticketSubmit: "Submit Ticket",
    ticketListTitle: "My Support Tickets",

    // Admin Portal
    totalRevenue: "Total Revenue (YTD)",
    leadConversion: "Lead Conversion Rate",
    activeInstalls: "Active Installations",
    lowStockAlerts: "Inventory Items Low",
    salesPurchases: "Sales & Purchase Records",
    technicianDistribution: "Technician Dispatch Status",
    assignTechnician: "Assign Technician",
    updateStatus: "Update Status",
    customerList: "Customer Registry",
    employeeManagement: "Employee & Technician Roster"
  },
  ur: {
    // Navigation
    home: "ہوم",
    about: "ہمارے بارے میں",
    services: "خدمات",
    products: "مصنوعات",
    installation: "انسٹالیشنز",
    portfolio: "پورٹ فولیو",
    quote: "کوٹیشن کی درخواست",
    blog: "بلاگ اور خبریں",
    contact: "ہم سے رابطہ کریں",
    reviews: "صارفین کی رائے",
    portal: "کلائنٹ پورٹل",
    adminDashboard: "ایڈمن پینل",
    staffDashboard: "اسٹاف ڈیش بورڈ",
    customerDashboard: "میرا سولر پلیکس",
    login: "لاگ ان",
    logout: "لاگ آؤٹ",
    languageLabel: "English",
    currencyLabel: "کرنسی",

    // Common UI elements
    submit: "جمع کروائیں",
    loading: "لوڈ ہو رہا ہے...",
    save: "تبدیلیاں محفوظ کریں",
    cancel: "منسوخ کریں",
    delete: "حذف کریں",
    edit: "ترمیم کریں",
    viewDetails: "تفصیلات دیکھیں",
    actions: "اقدامات",
    status: "حالت",
    date: "تاریخ",
    amount: "رقم",
    invoice: "انکوائس",
    payNow: "ابھی ادائیگی کریں",

    // Home Page Hero
    heroTitle: "پریمیم انٹرپرائز سولر انرجی سلوشنز",
    heroSub: "پاکستان اور بین الاقوامی مارکیٹوں کو اعلیٰ پیداواری سولر انسٹالیشنز، ذہین سمارٹ گرڈ مانیٹرنگ، اور مکمل لائف سائیکل پروجیکٹ مینجمنٹ کے ساتھ بااختیار بنانا۔",
    getStarted: "بچت کا حساب لگائیں",
    learnMore: "ہماری خدمات",
    statsActiveProjects: "فعال منصوبے",
    statsCapacityInstalled: "نصب شدہ صلاحیت",
    statsSatisfiedClients: "مطمئن صارفین",
    statsCarbonReduced: "کاربن میں کمی",

    // Savings Calculator
    calcTitle: "فوری سولر بچت کیلکولیٹر",
    calcSub: "سیکنڈوں میں اپنی سولر ضروریات اور رقم کی واپسی کی مدت کا تخمینہ لگائیں",
    billLabel: "اوسط ماہانہ بجلی کا بل",
    connectionType: "کنکشن کی قسم",
    connectionRes: "رہائشی",
    connectionComm: "تجارتی",
    connectionInd: "صنعتی",
    calcBtn: "حساب لگائیں",
    resultsTitle: "آپ کا سولر تخمینہ",
    recSystemSize: "تجویز کردہ سسٹم",
    estimatedCost: "تخمینی لاگت",
    annualSavings: "سالانہ بجلی کی بچت",
    paybackPeriod: "رقم کی واپسی کی مدت",
    years: "سال",
    netMeteringEligible: "نیٹ میٹرنگ کے اہل",
    yes: "جی ہاں",
    no: "نہیں",

    // Products
    productCatalogTitle: "انٹرپرائز سولر مصنوعات",
    productCatalogSub: "ٹیر-1 سولر پینلز، سمارٹ انورٹرز، اور اعلیٰ کارکردگی والے بیٹری اسٹوریج سسٹم سلوشنز۔",
    all: "تمام مصنوعات",
    panels: "سولر پینلز",
    inverters: "سمارٹ انورٹرز",
    batteries: "بیٹری اسٹوریج",
    searchPlaceholder: "سولر سامان تلاش کریں...",
    brand: "برانڈ",
    efficiency: "کارکردگی",
    warranty: "وارنٹی",
    powerOutput: "بجلی کی پیداوار",
    capacity: "صلاحیت",
    addToQuote: "کوٹیشن میں شامل کریں",
    specifications: "تکنیکی خصوصیات",
    priceRange: "قیمت کی حد",

    // Quote Request
    quoteTitle: "انٹرپرائز سولر پروپوزل کی درخواست",
    quoteSub: "اپنی تفصیلات اور توانائی کے استعمال کے طریقے جمع کروائیں تاکہ ایک مخصوص مالیاتی پروپوزل تیار کیا جا سکے۔",
    stepPersonal: "رابطے کی تفصیلات",
    stepEnergy: "انرجی پروفائل",
    stepReview: "جائزہ اور جمع کروائیں",
    fullName: "پورا نام",
    email: "ای میل ایڈریس",
    phone: "فون نمبر",
    address: "پراپرٹی کا پتہ",
    city: "شہر",
    monthlyBill: "اوسط ماہانہ بل",
    roofArea: "چھت کا تخمینی رقبہ (مربع فٹ)",
    netMeteringInterest: "کیا آپ نیٹ میٹرنگ میں دلچسپی رکھتے ہیں؟",
    notes: "خصوصی ضروریات / نوٹس",
    submitSuccess: "پروپوزل کی درخواست کامیابی کے ساتھ جمع ہو گئی! ہماری انجینئرنگ ٹیم جلد ہی آپ سے رابطہ کرے گی۔",

    // Dashboard General
    welcome: "خوش آمدید",
    roleAdmin: "ایڈمنسٹریٹر",
    roleStaff: "آپریشنز سپیشلسٹ",
    roleCustomer: "سولر پارٹنر",
    overview: "مجموعی جائزہ",
    analytics: "تجزیات",
    crm: "لیڈ اور کسٹمر مینجمنٹ",
    inventory: "انوینٹری کنٹرول",
    installations: "انسٹالیشنز",
    technicians: "ٹیکنیشنز اور عملہ",
    support: "سپورٹ ڈیسک",
    payments: "ادائیگیاں اور انوائسز",
    settings: "ترتیبات",

    // Customer Portal
    projectStatus: "پروجیکٹ کی تکمیل کی صورتحال",
    currentPhase: "موجودہ مرحلہ",
    liveGenerationSim: "سولر کارکردگی سمیلیٹر (لائیو)",
    simulatedOutput: "روزانہ کی متوقع پیداوار",
    lifetimeSavings: "زندگی بھر کی مالی بچت",
    totalPaymentsDue: "کل واجب الادا رقم",
    noInvoices: "کوئی انوائس نہیں ملی۔",
    supportTicketTitle: "سپورٹ کی درخواست کھولیں",
    ticketSubject: "موضوع",
    ticketCategory: "زمرہ",
    ticketMessage: "پیغام / مسئلے کی تفصیلات",
    ticketSubmit: "ٹکٹ جمع کروائیں",
    ticketListTitle: "میرے سپورٹ ٹکٹ",

    // Admin Portal
    totalRevenue: "کل آمدنی (سالانہ)",
    leadConversion: "لیڈ کی تبدیلی کی شرح",
    activeInstalls: "فعال انسٹالیشنز",
    lowStockAlerts: "انوینٹری کی کم اشیاء",
    salesPurchases: "خرید و فروخت کا ریکارڈ",
    technicianDistribution: "ٹیکنیشن کی دستیابی کی صورتحال",
    assignTechnician: "ٹیکنیشن مقرر کریں",
    updateStatus: "حالت تبدیل کریں",
    customerList: "کسٹمر رجسٹری",
    employeeManagement: "ملازمین اور ٹیکنیشنز کی فہرست"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('solarplex_lang');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ur')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ur' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('solarplex_lang', nextLang);
  };

  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to English, then the key itself
    return translations['en'][key] || key;
  };

  const isRtl = language === 'ur';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-urdu' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
