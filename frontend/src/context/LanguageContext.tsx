'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

const translations = {
  en: {
    searchPlaceholder: 'Search by Title, Author, or ISBN...',
    cart: 'Cart',
    signIn: 'Sign In',
    allCategories: 'All Categories',
    latestBooks: 'Latest Added Books',
    bestsellingBooks: 'Bestselling Books',
    viewAll: 'View All',
    price: 'Price',
    addToCart: 'Add to Cart',
    subject: 'Subject',
    author: 'Author',
    publisher: 'Publisher',
    buyNow: 'Buy Now',
    available: 'Available',
    customerReviews: 'Customer Reviews',
    stockIn: 'In Stock',
  },
  bn: {
    searchPlaceholder: 'বইয়ের নাম, লেখক বা বিষয় দিয়ে খুঁজুন...',
    cart: 'কার্ট',
    signIn: 'লগইন',
    allCategories: 'সব ক্যাটাগরি',
    latestBooks: 'নতুন আসা বই',
    bestsellingBooks: 'বেস্টসেলার বই',
    viewAll: 'সব দেখুন',
    price: 'মূল্য',
    addToCart: 'কার্টে যোগ করুন',
    subject: 'বিষয়',
    author: 'লেখক',
    publisher: 'প্রকাশক',
    buyNow: 'এখনই কিনুন',
    available: 'অ্যাভেইলেবল',
    customerReviews: 'ক্রেতাদের মন্তব্য',
    stockIn: 'স্টকে আছে',
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string | { en: string, bn: string }, bnOverride?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('bn');

  useEffect(() => {
    const savedLang = localStorage.getItem('siteLang') as Language;
    if (savedLang) setLangState(savedLang);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('siteLang', newLang);
  };

  const t = (key: string | { en: string, bn: string }, bnOverride?: string) => {
    if (typeof key === 'string') {
      if (bnOverride) {
        return lang === 'en' ? key : bnOverride;
      }
      // @ts-ignore
      return translations[lang][key] || key;
    }
    return lang === 'en' ? key.en : key.bn;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
