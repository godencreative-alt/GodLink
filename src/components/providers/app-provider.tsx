'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

type Theme = 'dark' | 'light';
type Locale = 'en' | 'id';

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const AppContext = createContext<AppContextType>({
  theme: 'dark',
  setTheme: () => {},
  locale: 'en',
  setLocale: () => {}
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedTheme) setThemeState(savedTheme);
    if (savedLocale) setLocaleState(savedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.lang = locale;
    localStorage.setItem('theme', theme);
  }, [theme, locale]);

  function setTheme(t: Theme) {
    setThemeState(t);
  }

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem('locale', l);
    document.cookie = `locale=${l};path=/;max-age=31536000;samesite=lax`;
  }

  return (
    <SessionProvider>
      <AppContext.Provider value={{ theme, setTheme, locale, setLocale }}>
        {children}
      </AppContext.Provider>
    </SessionProvider>
  );
}

export function useApp() {
  return useContext(AppContext);
}