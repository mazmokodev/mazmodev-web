
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMainServices } from '../services/dataService';
import { Service } from '../types';
import { Icons, DynamicIcon } from '../components/Icons';
import { ScrollReveal } from '../components/ScrollReveal';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Layanan Kami - MazmoDev";
    const fetch = async () => {
      setLoading(true);
      const data = await getMainServices();
      setServices(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
         <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
            <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Solusi Digital Lengkap</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Pilih layanan yang sesuai dengan kebutuhan bisnis Anda. Klik detail untuk melihat paket harga.
            </p>
            </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <ScrollReveal key={service.id} delay={idx * 100} className="h-full">
                <Link 
                to={`/${service.slug}`} 
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 hover:-translate-y-2 transition-transform duration-300 group block h-full"
                >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    <DynamicIcon name={service.iconName} size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
                    {service.shortDescription}
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold mt-auto">
                    Lihat Paket Harga <Icons.ChevronRight size={18} className="ml-1" />
                </div>
                </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};
