
import React, { useEffect, useState } from 'react';
import { getGlobalPortfolios } from '../services/dataService';
import { PortfolioItem } from '../types';
import { Icons } from '../components/Icons';
import { SEO } from '../components/SEO';
import { ScrollReveal } from '../components/ScrollReveal';

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getGlobalPortfolios();
      setItems(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-20 transition-colors">
      <SEO 
        title="Portfolio Project" 
        description="Lihat hasil karya terbaik MazmoDev dalam pembuatan website, desain branding, dan kampanye digital."
        keywords={['portfolio web', 'hasil kerja mazmodev', 'contoh desain web']}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
            <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Hasil Karya Kami</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Koleksi project terbaik yang telah kami kerjakan untuk membantu bisnis klien bertumbuh.
            </p>
            </div>
        </ScrollReveal>
        
        {loading ? (
             <div className="flex justify-center py-20">
                 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
        ) : items.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {items.map((item, idx) => (
                    <ScrollReveal key={idx} delay={idx * 100} className="h-full">
                        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                            {/* Image Container */}
                            <div 
                                onClick={() => setLightboxImage(item)}
                                className="relative aspect-video bg-gray-200 cursor-pointer overflow-hidden"
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-full backdrop-blur-sm shadow-xl">
                                        <Icons.Search className="text-blue-600" size={24} />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content Below Image */}
                            <div className="p-6">
                                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                                    {item.category}
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-500 text-lg">Belum ada portfolio yang ditambahkan.</p>
            </div>
        )}
       
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-6xl w-full max-h-screen flex flex-col" onClick={e => e.stopPropagation()}>
             <button 
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 transition-colors"
             >
                <Icons.X size={32} />
             </button>
             <img 
                src={lightboxImage.image} 
                alt={lightboxImage.title} 
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl bg-black"
             />
             <div className="mt-6 text-center text-white">
                 <h3 className="text-2xl font-bold mb-2">{lightboxImage.title}</h3>
                 <p className="text-blue-400 font-medium uppercase tracking-wide">{lightboxImage.category}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
