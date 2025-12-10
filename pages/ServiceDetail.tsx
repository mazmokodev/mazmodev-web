
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceBySlug, getServices, getSubServices } from '../services/dataService';
import { Service, PortfolioItem } from '../types';
import { Icons, DynamicIcon } from '../components/Icons';
import { SEO } from '../components/SEO';
import { useConfig } from '../contexts/ConfigContext';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | undefined>();
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const { getWhatsappLink } = useConfig();

  useEffect(() => {
    const loadData = async () => {
      if (slug) {
        const found = await getServiceBySlug(slug);
        setService(found);
        
        if (found) {
            // Explicit Sub-Service Logic
            // 1. Get explicit children (Services that have this service ID as parent)
            const explicitChildren = await getSubServices(found.id);
            
            // 2. If this IS a sub-service, show siblings (same parent) to allow navigation
            let explicitSiblings: Service[] = [];
            if (found.parentServiceId) {
                const siblings = await getSubServices(found.parentServiceId);
                explicitSiblings = siblings.filter(s => s.id !== found.id);
            }

            setRelatedServices([...explicitChildren, ...explicitSiblings]);
        }
        
        window.scrollTo(0, 0);
      }
    };
    loadData();
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <SEO title="Layanan Tidak Ditemukan" description="Halaman layanan yang Anda cari tidak tersedia." />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Layanan Tidak Ditemukan</h2>
          <Link to="/services" className="text-blue-600 hover:underline">Kembali ke Daftar Layanan</Link>
        </div>
      </div>
    );
  }

  // --- SUPER SEO SCHEMA CONSTRUCTION ---
  
  // 1. Service Schema
  const serviceSchema = {
      "@type": "Service",
      "name": service.title,
      "description": service.shortDescription,
      "provider": {
          "@type": "Organization",
          "name": "MazmoDev Agency",
          "url": window.location.origin
      },
      "serviceType": service.title,
      "areaServed": "Indonesia",
      "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `${service.title} Packages`,
          "itemListElement": service.plans.map((plan) => ({
              "@type": "Offer",
              "itemOffered": {
                  "@type": "Service",
                  "name": plan.name
              },
              "priceSpecification": {
                  "@type": "PriceSpecification",
                  "priceCurrency": "IDR",
                  "price": plan.price.replace(/[^0-9]/g, '')
              }
          }))
      }
  };

  // 2. FAQ Schema
  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    "@type": "FAQPage",
    "mainEntity": service.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : {};

  const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [
          serviceSchema,
          ...(Object.keys(faqSchema).length ? [faqSchema] : [])
      ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <SEO 
        title={service.seoTitle || service.title} 
        description={service.shortDescription}
        keywords={service.seoKeywords || [service.title, 'MazmoDev']}
        // @ts-ignore
        schema={combinedSchema} 
      />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                <li><Icons.ChevronRight size={14} /></li>
                <li><Link to="/services" className="hover:text-blue-600">Layanan</Link></li>
                <li><Icons.ChevronRight size={14} /></li>
                <li className="text-slate-900 dark:text-white font-semibold" aria-current="page">{service.title}</li>
            </ol>
          </nav>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-6">
                <DynamicIcon name={service.iconName} size={40} className="text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white leading-tight">
                {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                {service.shortDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#pricing" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
                    Lihat Paket Harga
                </a>
                <a href={getWhatsappLink(`Halo, saya ingin konsultasi tentang ${service.title}`)} target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    Konsultasi Gratis
                </a>
            </div>
          </div>
        </div>
      </header>

      {/* NEW: SEO CONTENT SECTION (Full Width Background, Centered Content) */}
      {(service.contentSectionTitle || service.contentSectionBody) && (
        <section className="w-full bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {service.contentSectionTitle && (
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-8 text-center leading-tight">
                        {service.contentSectionTitle}
                    </h2>
                )}
                {service.contentSectionBody && (
                    <div 
                        className="prose prose-lg dark:prose-invert max-w-4xl mx-auto
                        prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                        prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                        prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
                        prose-li:text-slate-600 dark:prose-li:text-slate-300
                        prose-img:rounded-2xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: service.contentSectionBody }}
                    />
                )}
            </div>
        </section>
      )}

      {/* Full Description & Benefits Layout */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: Content */}
              <article className="prose prose-lg dark:prose-invert max-w-none">
                  <h2 className="text-3xl font-bold mb-6">Tentang Layanan Ini</h2>
                  <div dangerouslySetInnerHTML={{ __html: service.fullDescription }} />
                  
                  {service.benefits && service.benefits.length > 0 && (
                      <div className="mt-12">
                          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Manfaat Utama</h3>
                          <ul className="space-y-4 list-none pl-0">
                              {service.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex gap-4">
                                      <div className="flex-shrink-0 mt-1">
                                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                              <Icons.Check size={14} strokeWidth={3} />
                                          </div>
                                      </div>
                                      <div>
                                          <strong className="block text-slate-900 dark:text-white">{benefit.title}</strong>
                                          <span className="text-slate-600 dark:text-slate-400 text-sm">{benefit.description}</span>
                                      </div>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}
              </article>

              {/* Right: Features Grid */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold mb-8 uppercase tracking-wider text-slate-500 text-sm">Keunggulan Kami</h3>
                  <div className="grid gap-6">
                      {service.features && service.features.map((feature, idx) => (
                          <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
                              <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600">
                                      <Icons.Star size={24} />
                                  </div>
                              </div>
                              <div>
                                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                              </div>
                          </div>
                      ))}
                      {(!service.features || service.features.length === 0) && <p className="text-slate-500 italic">Fitur belum ditambahkan.</p>}
                  </div>
              </div>
          </div>
      </section>

      {/* Portfolio Section (Image Grid with Lightbox) */}
      {service.portfolio && service.portfolio.length > 0 && (
          <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Portfolio Project</h2>
                      <p className="text-slate-600 dark:text-slate-400">Hasil karya terbaik kami untuk klien-klien sebelumnya.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {service.portfolio.map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setLightboxImage(item)}
                            className="group relative aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                          >
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                  <span className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">{item.category}</span>
                                  <h4 className="text-white font-bold text-lg">{item.title}</h4>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-screen flex flex-col" onClick={e => e.stopPropagation()}>
             <button 
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white p-2"
             >
                <Icons.X size={32} />
             </button>
             <img 
                src={lightboxImage.image} 
                alt={lightboxImage.title} 
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl bg-black"
             />
             <div className="mt-4 text-center">
                 <h3 className="text-white text-xl font-bold">{lightboxImage.title}</h3>
                 <p className="text-blue-400 text-sm font-medium uppercase tracking-wide">{lightboxImage.category}</p>
             </div>
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Penawaran Spesial</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Investasi terbaik untuk pertumbuhan bisnis Anda. Transparan, tanpa biaya tersembunyi.
              </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {service.plans.length > 0 ? service.plans.map((plan) => (
                  <div 
                      key={plan.id} 
                      className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                        plan.recommended 
                          ? 'border-blue-500 bg-slate-900 text-white shadow-xl shadow-blue-900/20' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                      }`}
                  >
                      {plan.recommended && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                              Most Popular
                          </div>
                      )}
                      
                      <div className="mb-8">
                          <h3 className={`text-lg font-bold mb-2 opacity-90`}>{plan.name}</h3>
                          <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-extrabold">{plan.price}</span>
                              <span className="text-sm opacity-60">/project</span>
                          </div>
                      </div>

                      <ul className="space-y-4 mb-8 flex-1">
                          {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm">
                                  <div className={`mt-0.5 flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-slate-400'}`}>
                                      {feature.included ? <Icons.Check size={18} /> : <Icons.X size={18} />}
                                  </div>
                                  <span className={`${feature.included ? 'opacity-90' : 'opacity-40 line-through'}`}>
                                      {feature.text}
                                  </span>
                              </li>
                          ))}
                      </ul>

                      <a 
                          href={getWhatsappLink(`Hi, saya mau ambil paket ${plan.name} untuk ${service.title}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-4 px-6 rounded-xl font-bold text-center transition-all ${
                              plan.recommended 
                                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/40' 
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                          Pilih Paket Ini
                      </a>
                  </div>
              )) : (
                <div className="col-span-full text-center p-12 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-lg text-slate-500 mb-4">Harga bersifat custom sesuai kebutuhan project Anda.</p>
                    <a href={getWhatsappLink(`Tanya harga custom ${service.title}`)} target="_blank" className="text-blue-600 font-bold hover:underline">
                        Hubungi untuk Penawaran
                    </a>
                </div>
              )}
          </div>
      </section>

      {/* FAQ Automation Section */}
      {service.faqs && service.faqs.length > 0 && (
          <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                  <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">Pertanyaan Umum (FAQ)</h2>
                  <div className="space-y-4">
                      {service.faqs.map((faq, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                              <button 
                                  onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                              >
                                  <span className="font-bold text-slate-900 dark:text-white pr-8">{faq.question}</span>
                                  <Icons.ChevronRight className={`transform transition-transform duration-300 ${activeFaqIndex === idx ? 'rotate-90' : ''}`} size={20} />
                              </button>
                              <div 
                                  className={`px-6 text-slate-600 dark:text-slate-400 transition-all duration-300 ease-in-out overflow-hidden ${activeFaqIndex === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                              >
                                  {faq.answer}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* AUTOMATIC INTERNAL LINKING (SUB SERVICES / SIBLINGS) */}
      {relatedServices.length > 0 && (
          <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
                      {service.parentServiceId ? 'Layanan Terkait Lainnya' : 'Layanan Spesifik (Sub-Service)'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {relatedServices.map(rs => (
                          <Link key={rs.id} to={`/${rs.slug}`} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-slate-200 dark:border-slate-800 group">
                              <div className="flex items-center gap-3">
                                  <div className="text-blue-500">
                                      <DynamicIcon name={rs.iconName} size={20} />
                                  </div>
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{rs.title}</span>
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* Sticky Bottom CTA for Mobile / Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white text-center px-4">
          <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Siap Memulai Project Anda?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Jangan ragu untuk berdiskusi dengan tim ahli kami. Konsultasi gratis dan solusi terbaik menanti Anda.
              </p>
              <a 
                  href={getWhatsappLink(`Halo MazmoDev, saya ingin start project untuk ${service.title}`)}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform animate-bounce-subtle"
              >
                  <Icons.Whatsapp className="mr-3" size={24} />
                  Chat WhatsApp Sekarang
              </a>
          </div>
      </section>
    </div>
  );
};
