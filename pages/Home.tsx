
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons, DynamicIcon } from '../components/Icons';
import { getRecentBlogs, getMainServices, getHomeContent, getHomeStats, getTestimonials } from '../services/dataService';
import { Service, BlogPost, HomeContent, HomeStat, Testimonial } from '../types';
import { SEO } from '../components/SEO';
import { useConfig } from '../contexts/ConfigContext';
import { ScrollReveal } from '../components/ScrollReveal';

export const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [stats, setStats] = useState<HomeStat[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const { getWhatsappLink } = useConfig();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogsData, servicesData, contentData, statsData, testiData] = await Promise.all([
          getRecentBlogs(3),
          getMainServices(),
          getHomeContent(),
          getHomeStats(),
          getTestimonials()
        ]);

        setRecentBlogs(blogsData);
        setFeaturedServices(servicesData.slice(0, 3));
        setHomeContent(contentData);
        setStats(statsData);
        setTestimonials(testiData);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !homeContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 animate-pulse">Memuat Konten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <SEO 
        title="Jasa Pembuatan Website & Digital Marketing Terbaik"
        description="MazmoDev adalah agensi digital terpercaya melayani jasa pembuatan website SEO friendly, Google Ads, dan Branding Identity profesional."
        keywords={['Jasa Website', 'Digital Agency', 'SEO', 'Google Ads', 'Branding']}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-white dark:bg-slate-950 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium mb-8">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Menerima Project Baru
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.15]">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                    {homeContent.heroTitle}
                </span>
                </h1>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                    {homeContent.heroSubtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/services" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1">
                    {homeContent.heroButtonText}
                    <Icons.ArrowRight className="ml-2" size={20} />
                </Link>
                <a href={getWhatsappLink("Halo saya tertarik konsultasi gratis")} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-slate-700 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    Konsultasi Gratis
                </a>
                </div>
            </ScrollReveal>
            
            {/* Trusted By */}
            {homeContent.showTrustedBrands && homeContent.trustedBrands.length > 0 && (
                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                    <p className="text-sm text-slate-500 font-medium mb-6 uppercase tracking-widest">Dipercaya oleh 100+ Bisnis</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 items-center">
                        {homeContent.trustedBrands.map((brand, i) => (
                            <div key={i} className="h-8 md:h-10">
                                {brand.logoUrl ? (
                                    <img src={brand.logoUrl} alt={brand.name} className="h-full object-contain" />
                                ) : (
                                    <span className="text-xl font-black text-slate-400 dark:text-slate-600">{brand.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </section>

      {/* Statistics / Why Us */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-900 ${stat.color}`}>
                                <DynamicIcon name={stat.icon} size={32} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
              </ScrollReveal>
          </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
                <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">Layanan Unggulan</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Solusi Digital End-to-End</h3>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="group relative bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-100 dark:border-slate-800 h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DynamicIcon name={feature.iconName} size={100} className="text-blue-600" />
                    </div>
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 shadow-lg rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                    <DynamicIcon name={feature.iconName} size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {feature.shortDescription}
                    </p>
                    <Link to={`/${feature.slug}`} className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                        Pelajari Lebih Lanjut <Icons.ArrowRight size={18} className="ml-2" />
                    </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-12">
              <Link to="/services" className="inline-block px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-full font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  Lihat Semua Layanan
              </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      {homeContent.howItWorks && homeContent.howItWorks.length > 0 && (
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <ScrollReveal>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Kerja Kami</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Proses transparan dan efisien untuk memastikan hasil terbaik.</p>
                </div>
             </ScrollReveal>
             
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                 <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-700 z-0"></div>

                 {homeContent.howItWorks.map((item, i) => (
                     <ScrollReveal key={i} delay={i * 100} className="relative z-10 text-center">
                         <div className="w-24 h-24 mx-auto bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center mb-6 shadow-xl relative">
                             <DynamicIcon name={item.icon} size={32} className="text-blue-400" />
                             <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold border-4 border-slate-900">
                                 {item.step}
                             </div>
                         </div>
                         <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                         <p className="text-slate-400 text-sm px-4">{item.description}</p>
                     </ScrollReveal>
                 ))}
             </div>
         </div>
      </section>
      )}

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">Kata Mereka Tentang Kami</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testi, i) => (
                    <ScrollReveal key={i} delay={i * 100}>
                        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 relative h-full">
                            <Icons.Quote className="absolute top-6 right-6 text-blue-200 dark:text-blue-900" size={40} />
                            <div className="flex gap-1 text-yellow-400 mb-6">
                                {[...Array(testi.rating || 5)].map((_, s) => <Icons.Star key={s} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 italic">"{testi.content}"</p>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                                    {testi.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{testi.name}</h4>
                                    <p className="text-xs text-slate-500">{testi.role}</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
          </div>
      </section>

      {/* Recent Blog */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Artikel Terbaru</h2>
                        <p className="text-slate-600 dark:text-slate-400">Insight dan tips seputar dunia digital.</p>
                    </div>
                    <Link to="/blog" className="hidden md:flex items-center text-blue-600 font-semibold hover:underline">
                        Lihat Semua <Icons.ArrowRight size={16} className="ml-2"/>
                    </Link>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentBlogs.map((blog, idx) => (
                    <ScrollReveal key={blog.id} delay={idx * 100} className="h-full">
                        <Link to={`/${blog.slug}`} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col h-full">
                            <div className="h-48 bg-gray-200 dark:bg-slate-800 relative overflow-hidden">
                                {blog.imageUrl ? (
                                    <img 
                                        src={blog.imageUrl} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 opacity-80 group-hover:scale-105 transition-transform duration-500"></div>
                                )}
                                <span className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-800 dark:text-white z-10">
                                    {blog.tags[0] || blog.category}
                                </span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                                    <Icons.Clock size={14} /> {blog.date}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                                    {blog.summary}
                                </p>
                                <span className="text-blue-600 text-sm font-semibold flex items-center mt-auto">
                                    Baca Artikel <Icons.ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>
            
             <div className="md:hidden text-center mt-8">
                <Link to="/blog" className="inline-block px-6 py-3 bg-white border border-slate-300 rounded-full font-semibold text-slate-700">
                  Lihat Semua Artikel
                </Link>
            </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
             <ScrollReveal>
                <h2 className="text-4xl font-extrabold mb-6">Siap Meledakkan Omset Bisnis Anda?</h2>
                <p className="text-xl text-blue-100 mb-10">Jangan biarkan kompetitor mendahului Anda. Konsultasikan kebutuhan digital Anda sekarang juga.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={getWhatsappLink("Halo saya ingin diskusi project")} target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                        Hubungi via WhatsApp
                    </a>
                    <Link to="/services" className="bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors">
                        Lihat Paket Harga
                    </Link>
                </div>
             </ScrollReveal>
          </div>
      </section>
    </div>
  );
};
