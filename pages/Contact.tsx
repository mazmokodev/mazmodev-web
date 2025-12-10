
import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { ScrollReveal } from '../components/ScrollReveal';
import { Icons } from '../components/Icons';
import { useConfig } from '../contexts/ConfigContext';

export const Contact: React.FC = () => {
  const { config, getWhatsappLink } = useConfig();
  const [formData, setFormData] = useState({ name: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Redirect form to WhatsApp
      const text = `Halo MazmoDev, perkenalkan saya ${formData.name}.\n\n${formData.message}`;
      window.open(getWhatsappLink(text), '_blank');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <SEO 
        title="Hubungi Kami - MazmoDev Agency" 
        description="Hubungi tim MazmoDev untuk konsultasi gratis mengenai pembuatan website, digital marketing, dan branding."
      />

      <section className="pt-24 pb-12 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
              <ScrollReveal>
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Hubungi Kami</h1>
                  <p className="text-blue-100 text-lg max-w-2xl mx-auto">Kami siap mendengar ide hebat Anda. Silakan hubungi kami melalui saluran di bawah ini.</p>
              </ScrollReveal>
          </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="lg:col-span-1 space-y-6">
                  <ScrollReveal delay={100} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 mb-4">
                          <Icons.Whatsapp size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">WhatsApp</h3>
                      <p className="text-slate-500 text-sm mb-4">Respon cepat 24/7 untuk konsultasi.</p>
                      <a href={getWhatsappLink()} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline break-all">
                          {config.whatsappNumber}
                      </a>
                  </ScrollReveal>

                  <ScrollReveal delay={200} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                          <Icons.Briefcase size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Email</h3>
                      <p className="text-slate-500 text-sm mb-4">Untuk penawaran resmi dan kerjasama.</p>
                      <a href={`mailto:${config.email}`} className="text-blue-600 font-bold hover:underline break-all">
                          {config.email}
                      </a>
                  </ScrollReveal>

                  <ScrollReveal delay={300} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                          <Icons.Globe size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Kantor</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                          {config.address}
                      </p>
                  </ScrollReveal>
              </div>

              {/* Contact Form & Map */}
              <div className="lg:col-span-2 space-y-8">
                  <ScrollReveal className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Kirim Pesan</h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                              <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                                placeholder="Masukkan nama Anda"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pesan / Kebutuhan</label>
                              <textarea 
                                required
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                                rows={5}
                                placeholder="Ceritakan kebutuhan project Anda..."
                              />
                          </div>
                          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2">
                              <Icons.Whatsapp size={20} />
                              Kirim via WhatsApp
                          </button>
                      </form>
                  </ScrollReveal>

                  {/* Simple Map Placeholder (Embedded Google Maps would go here) */}
                  <ScrollReveal className="bg-slate-200 dark:bg-slate-800 h-64 rounded-2xl overflow-hidden flex items-center justify-center relative group">
                      <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                      <div className="relative z-10 text-center p-6">
                          <Icons.Globe size={48} className="mx-auto text-slate-400 mb-2"/>
                          <p className="font-bold text-slate-600 dark:text-slate-300">Lokasi Kami</p>
                          <p className="text-sm text-slate-500">{config.address}</p>
                      </div>
                  </ScrollReveal>
              </div>
          </div>
      </section>
    </div>
  );
};
