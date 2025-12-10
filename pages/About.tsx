
import React, { useEffect } from 'react';
import { SEO } from '../components/SEO';
import { ScrollReveal } from '../components/ScrollReveal';
import { Icons } from '../components/Icons';
import { useConfig } from '../contexts/ConfigContext';

export const About: React.FC = () => {
  const { getWhatsappLink } = useConfig();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors">
      <SEO 
        title="Tentang Kami - MazmoDev Agency" 
        description="Mengenal lebih dekat MazmoDev, partner digital strategis Anda untuk pembuatan website, iklan, dan branding."
      />

      {/* Hero Section */}
      <section className="relative py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <ScrollReveal>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
                    Tentang <span className="text-blue-600">MazmoDev</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Kami bukan sekadar agensi digital. Kami adalah mitra pertumbuhan bisnis Anda yang menggabungkan kreativitas, teknologi, dan strategi data-driven.
                </p>
            </ScrollReveal>
         </div>
      </section>

      {/* Story Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <ScrollReveal className="relative">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10 bg-slate-200">
                      <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                        alt="Tim MazmoDev" 
                        className="w-full h-full object-cover"
                      />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl opacity-30 z-0"></div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-30 z-0"></div>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Misi Kami</h2>
                  <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-300">
                      <p>
                          Didirikan dengan semangat inovasi, <strong>MazmoDev</strong> hadir untuk menjawab tantangan bisnis di era digital. Kami percaya bahwa setiap bisnis, baik UMKM maupun korporasi, berhak mendapatkan representasi digital kelas dunia.
                      </p>
                      <p>
                          Fokus kami sederhana: <strong>Memberikan Hasil Nyata.</strong>
                      </p>
                      <ul className="space-y-4 mt-6 list-none pl-0">
                          <li className="flex items-start gap-3">
                              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600"><Icons.Check size={16} /></div>
                              <span>Website yang tidak hanya bagus, tapi juga menjual (High Conversion).</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600"><Icons.Check size={16} /></div>
                              <span>Strategi iklan yang efektif dan terukur ROI-nya.</span>
                          </li>
                          <li className="flex items-start gap-3">
                              <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600"><Icons.Check size={16} /></div>
                              <span>Identitas brand yang kuat dan mudah diingat.</span>
                          </li>
                      </ul>
                  </div>
              </ScrollReveal>
          </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                  <div className="text-center mb-16">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Nilai Inti Kami</h2>
                      <p className="text-slate-600 dark:text-slate-400">Prinsip yang kami pegang teguh dalam setiap project.</p>
                  </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { icon: 'Zap', title: 'Inovasi Cepat', desc: 'Selalu update dengan teknologi terbaru agar klien kami selangkah lebih maju.' },
                      { icon: 'Users', title: 'Fokus Klien', desc: 'Kepuasan dan kesuksesan bisnis Anda adalah prioritas utama kami.' },
                      { icon: 'Lock', title: 'Transparansi', desc: 'Komunikasi jujur, laporan terbuka, dan tanpa biaya tersembunyi.' }
                  ].map((val, i) => (
                      <ScrollReveal key={i} delay={i * 100} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-transform">
                          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                              {/* @ts-ignore */}
                              <Icons.Zap size={28} className={val.icon === 'Users' ? 'hidden' : val.icon === 'Lock' ? 'hidden' : ''} />
                              {/* @ts-ignore */}
                              <Icons.Users size={28} className={val.icon !== 'Users' ? 'hidden' : ''} />
                              {/* @ts-ignore */}
                              <Icons.Lock size={28} className={val.icon !== 'Lock' ? 'hidden' : ''} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{val.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400">{val.desc}</p>
                      </ScrollReveal>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
          <ScrollReveal>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Ingin Berkolaborasi?</h2>
              <a 
                href={getWhatsappLink("Halo, saya ingin diskusi kerjasama dengan MazmoDev.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30"
              >
                  Hubungi Kami Sekarang
              </a>
          </ScrollReveal>
      </section>
    </div>
  );
};
