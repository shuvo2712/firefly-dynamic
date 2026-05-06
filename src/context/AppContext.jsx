import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [quotation, setQuotation] = useState(() => {
    const saved = localStorage.getItem('firefly_quote');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('firefly_quote', JSON.stringify(quotation));
  }, [quotation]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addToQuote = (product, qty = 1) => {
    setQuotation(prev => {
      const existing = prev.find(q => q.id === product.id);
      if (existing) {
        return prev.map(q => q.id === product.id ? { ...q, qty: q.qty + qty } : q);
      }
      return [...prev, { id: product.id, name: product.name, qty }];
    });
  };

  const changeQty = (id, delta) => {
    setQuotation(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, qty: Math.max(1, q.qty + delta) };
      }
      return q;
    }));
  };

  const removeItem = (id) => {
    setQuotation(prev => prev.filter(q => q.id !== id));
  };

  const clearQuote = () => setQuotation([]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      quotation, addToQuote, changeQty, removeItem, clearQuote,
      isMobileMenuOpen, toggleMobileMenu, closeMobileMenu
    }}>
      {children}
    </AppContext.Provider>
  );
};
