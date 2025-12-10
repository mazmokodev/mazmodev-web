
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig } from '../types';
import { getSiteConfig, saveSiteConfig } from '../services/dataService';

interface ConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  getWhatsappLink: (message?: string) => string;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Default config fallback to avoid null check hell
const FALLBACK_CONFIG: SiteConfig = {
    whatsappNumber: '628123456789',
    email: 'info@mazmodev.com',
    address: 'Indonesia',
    logoUrl: '',
    instagram: '', linkedin: '', facebook: '', youtube: '', tiktok: ''
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(FALLBACK_CONFIG);

  useEffect(() => {
      // Async load
      const load = async () => {
          const data = await getSiteConfig();
          setConfig(data);
      }
      load();
  }, []);

  // Helper to generate WA Link
  const getWhatsappLink = (message: string = '') => {
    const phone = config.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${text}`;
  };

  const updateConfig = (newConfig: SiteConfig) => {
    saveSiteConfig(newConfig);
    setConfig(newConfig);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, getWhatsappLink }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
