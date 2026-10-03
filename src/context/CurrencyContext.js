'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const EXCHANGE_RATE = 278; // 1 USD = 278 PKR (approximate market standard)

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('PKR');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('solarplex_currency');
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'PKR')) {
      setCurrency(savedCurrency);
    }
  }, []);

  const toggleCurrency = () => {
    const nextCurr = currency === 'PKR' ? 'USD' : 'PKR';
    setCurrency(nextCurr);
    localStorage.setItem('solarplex_currency', nextCurr);
  };

  // Convert an amount in USD to current currency and format it
  const formatPrice = (usdAmount) => {
    if (currency === 'PKR') {
      const pkrAmount = Math.round(usdAmount * EXCHANGE_RATE);
      return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0
      }).format(pkrAmount).replace('PKR', 'Rs.');
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(usdAmount);
    }
  };

  // Convert a PKR amount to the current currency and format it
  const formatPkrPrice = (pkrAmount) => {
    const usdAmount = pkrAmount / EXCHANGE_RATE;
    return formatPrice(usdAmount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, formatPkrPrice, exchangeRate: EXCHANGE_RATE }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
