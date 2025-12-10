

import { Service, BlogPost, SiteConfig, PortfolioItem, Testimonial, HomeStat, HomeContent, TrustedBrand, ProcessStep, AdminCredentials } from '../types';

const SERVICES_KEY = 'mazmodev_services';
const BLOG_KEY = 'mazmodev_blogs';
const BLOG_CATEGORIES_KEY = 'mazmodev_blog_categories';
const PORTFOLIO_KEY = 'mazmodev_portfolios';
const CONFIG_KEY = 'mazmodev_config';
const TESTIMONIALS_KEY = 'mazmodev_testimonials';
const HOME_STATS_KEY = 'mazmodev_home_stats';
const HOME_CONTENT_KEY = 'mazmodev_home_content';
const AUTH_KEY = 'mazmodev_auth';

// --- DEFAULTS ---

const DEFAULT_PORTFOLIOS: PortfolioItem[] = [
    { 
      id: 'p1',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      title: 'Startup Dashboard Analytics',
      category: 'Web App'
    },
    { 
      id: 'p2',
      image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80',
      title: 'Modern E-Commerce',
      category: 'Toko Online'
    },
    { 
      id: 'p3',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      title: 'Corporate Profile PT Maju',
      category: 'Company Profile'
    }
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Jasa Pembuatan Website',
    slug: 'jasa-pembuatan-website',
    iconName: 'Code',
    seoTitle: 'Jasa Pembuatan Website Profesional & SEO Friendly | MazmoDev',
    seoKeywords: ['jasa website', 'buat website toko online', 'web developer jakarta', 'jasa website seo'],
    shortDescription: 'Jasa pembuatan website profesional, cepat, dan SEO friendly. Tingkatkan kredibilitas bisnis Anda dengan desain modern dan performa tinggi.',
    contentSectionTitle: 'Jasa Pembuatan Website Company Profile & UMKM Terpercaya',
    contentSectionBody: '<p>Di era digital saat ini, memiliki website bukan lagi pilihan, melainkan keharusan. <strong>MazmoDev</strong> hadir sebagai solusi jasa pembuatan website profesional yang mengutamakan performa, desain estetis, dan struktur SEO yang kuat.</p><p>Kami memahami bahwa setiap bisnis memiliki keunikan. Oleh karena itu, layanan kami mencakup:</p><ul class="list-disc pl-5 mb-4"><li><strong>Desain Custom:</strong> Disesuaikan dengan branding identitas perusahaan Anda.</li><li><strong>Kecepatan Tinggi:</strong> Website dioptimalkan untuk loading di bawah 2 detik.</li><li><strong>Mobile Responsive:</strong> Tampilan sempurna di semua perangkat (HP, Tablet, Desktop).</li></ul><p>Hubungi kami sekarang untuk konsultasi gratis mengenai kebutuhan digital bisnis Anda.</p>',
    fullDescription: '<p>Kami membangun website modern menggunakan teknologi terbaru seperti <strong>React, Next.js, dan Tailwind CSS</strong>. Website Anda akan dioptimalkan untuk kecepatan (Core Web Vitals) dan mesin pencari (Google).</p><p>Cocok untuk Company Profile, Toko Online, hingga Web App kompleks. Kami memastikan struktur kode yang bersih agar mudah diindeks oleh Google dan nyaman digunakan oleh pengunjung.</p>',
    features: [
        { title: 'Super Cepat', description: 'Optimasi loading speed < 1 detik untuk retensi pengunjung maksimal.' },
        { title: 'SEO Optimized', description: 'Struktur kode ramah Google agar mudah naik ranking.' },
        { title: 'Mobile Friendly', description: 'Tampilan responsif sempurna di HP, Tablet, dan Desktop.' }
    ],
    benefits: [
        { title: 'Kredibilitas Meningkat', description: 'Bisnis terlihat lebih profesional dan terpercaya di mata calon klien.' },
        { title: 'Buka 24 Jam', description: 'Website bekerja mempromosikan bisnis Anda bahkan saat Anda tidur.' }
    ],
    portfolio: [ DEFAULT_PORTFOLIOS[0], DEFAULT_PORTFOLIOS[1], DEFAULT_PORTFOLIOS[2] ], 
    faqs: [
        { question: 'Berapa lama proses pembuatan website?', answer: 'Untuk Company Profile sekitar 3-5 hari kerja. Untuk Toko Online atau Custom Web sekitar 7-14 hari kerja tergantung kompleksitas.' },
        { question: 'Apakah dapat gratis domain?', answer: 'Ya, semua paket kami sudah termasuk gratis Domain .com selama 1 tahun.' }
    ],
    plans: [
      {
        id: 'p1',
        name: 'Starter',
        price: 'Rp 1.500.000',
        features: [
          { text: 'Landing Page (1 Halaman)', included: true },
          { text: 'Gratis Domain .com', included: true },
          { text: 'SSL Security', included: true },
          { text: 'SEO Basic', included: false },
        ]
      },
      {
        id: 'p2',
        name: 'Business',
        price: 'Rp 3.500.000',
        features: [
          { text: 'Multi Page (5 Halaman)', included: true },
          { text: 'Gratis Domain & Hosting', included: true },
          { text: 'Optimasi SEO Advanced', included: true },
          { text: 'Integrasi Analytics', included: true },
        ],
        recommended: true
      }
    ]
  },
  {
    id: 'sub1',
    title: 'Jasa Website Rental Mobil',
    slug: 'jasa-website-rental-mobil',
    parentServiceId: '1', // LINKED TO PARENT
    iconName: 'Code',
    shortDescription: 'Solusi website khusus pengusaha rental mobil. Fitur booking online, katalog armada, dan integrasi WhatsApp.',
    fullDescription: '<p>Tingkatkan pemesanan rental mobil Anda dengan website khusus yang dirancang untuk konversi. Dilengkapi fitur hitung tarif otomatis dan booking via WA.</p>',
    seoTitle: 'Jasa Buat Website Rental Mobil Murah & Mewah',
    seoKeywords: ['website rental mobil', 'jasa web rental', 'aplikasi rental mobil'],
    features: [], benefits: [], portfolio: [], faqs: [], plans: []
  },
  {
    id: 'sub2',
    title: 'Jasa Website Apotik & Klinik',
    slug: 'jasa-website-apotik',
    parentServiceId: '1', // LINKED TO PARENT
    iconName: 'Code',
    shortDescription: 'Website profesional untuk Apotik, Klinik, dan Praktik Dokter. Tampilkan jadwal, layanan, dan katalog obat.',
    fullDescription: '<p>Digitalisasi layanan kesehatan Anda. Memudahkan pasien mencari informasi jadwal dokter dan ketersediaan layanan.</p>',
    seoTitle: 'Jasa Pembuatan Website Klinik & Apotik',
    seoKeywords: ['website apotik', 'website klinik', 'web dokter'],
    features: [], benefits: [], portfolio: [], faqs: [], plans: []
  },
  {
    id: '2',
    title: 'Jasa Iklan (ADS)',
    slug: 'jasa-iklan-ads',
    iconName: 'Megaphone',
    shortDescription: 'Tingkatkan omset drastis dengan Jasa Google Ads, Facebook Ads, dan TikTok Ads tertarget.',
    fullDescription: 'Tim advertiser kami yang berpengalaman akan membantu Anda menargetkan audiens yang tepat untuk memaksimalkan ROI bisnis Anda. Kami menggunakan strategi data-driven.',
    seoTitle: 'Jasa Iklan Google & Facebook Ads Terpercaya',
    seoKeywords: ['jasa google ads', 'jasa fb ads', 'digital marketing'],
    contentSectionTitle: 'Solusi Iklan Digital (Paid Traffic)',
    contentSectionBody: '<p>Jangkau pelanggan potensial secara instan. Layanan kami fokus pada konversi, bukan sekadar klik.</p>',
    features: [
        { title: 'Tertarget', description: 'Iklan hanya muncul ke orang yang mencari produk Anda.' },
        { title: 'Laporan Transparan', description: 'Akses real-time ke performa iklan Anda.' }
    ],
    benefits: [],
    portfolio: [],
    faqs: [],
    plans: [
      {
        id: 'a1',
        name: 'Basic Ads',
        price: 'Rp 2.000.000',
        features: [
          { text: 'Setup Google Ads', included: true },
          { text: 'Riset Keyword Basic', included: true },
          { text: 'Laporan Bulanan', included: true },
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Branding & Identitas',
    slug: 'branding-identity',
    iconName: 'Palette',
    shortDescription: 'Bangun citra merek yang kuat dan tak terlupakan dengan layanan Branding Identity lengkap.',
    fullDescription: 'Layanan branding komprehensif mulai dari desain logo, panduan gaya (style guide), hingga strategi komunikasi merek.',
    features: [],
    benefits: [],
    portfolio: [],
    faqs: [],
    plans: []
  }
];

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'Pentingnya SEO untuk Bisnis Lokal di 2024',
    slug: 'pentingnya-seo-bisnis-lokal',
    category: 'SEO',
    summary: 'Mengapa bisnis lokal harus peduli dengan SEO? Simak strategi jitu memenangkan pasar lokal dan tampil di Google Maps.',
    content: '<p>SEO Lokal adalah kunci untuk bisnis kecil dan menengah...</p><p>Dengan Google Maps dan pencarian berbasis lokasi, pelanggan dapat menemukan toko Anda dengan mudah.</p>',
    author: 'Admin Mazmo',
    date: '2024-03-15',
    imageUrl: 'https://images.unsplash.com/photo-1571721795195-a2d8d14abd75?auto=format&fit=crop&w=1000&q=80',
    tags: ['SEO', 'Bisnis', 'Digital Marketing'],
    status: 'published'
  },
  {
      id: '2',
      title: '5 Tips Facebook Ads Anti Boncos',
      slug: 'tips-fb-ads-anti-boncos',
      category: 'Digital Marketing',
      summary: 'Pelajari cara menargetkan audience yang tepat agar budget iklan Anda tidak terbuang percuma.',
      content: '<p>Facebook Ads memiliki fitur targeting yang sangat detail...</p>',
      author: 'Advertiser Team',
      date: '2024-03-20',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
      tags: ['Facebook Ads', 'Marketing', 'Paid Traffic'],
      status: 'published'
  }
];

const DEFAULT_CATEGORIES = ['Teknologi', 'Digital Marketing', 'SEO', 'Branding', 'Social Media', 'Bisnis', 'Tutorial'];

const DEFAULT_CONFIG: SiteConfig = {
    whatsappNumber: '628123456789',
    email: 'hello@mazmodev.com',
    address: 'Jakarta, Indonesia',
    logoUrl: '', // Default empty
    instagram: 'https://instagram.com/mazmodev',
    linkedin: 'https://linkedin.com/company/mazmodev',
    facebook: '',
    youtube: '',
    tiktok: ''
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    { id: '1', name: 'Budi Santoso', role: 'CEO, PT Maju Jaya', content: 'Website kami sekarang jauh lebih cepat dan mendatangkan banyak leads dari Google. Sangat puas dengan layanan SEO MazmoDev.', rating: 5 },
    { id: '2', name: 'Siti Aminah', role: 'Owner, Batik Cantik', content: 'Penjualan online meningkat 200% setelah dibantu setup Facebook Ads. Timnya sangat responsif dan edukatif.', rating: 5 },
    { id: '3', name: 'Rizky Pratama', role: 'Founder, TechStart', content: 'Desain branding yang dibuat sangat on-point dan modern. Benar-benar merepresentasikan visi startup kami.', rating: 5 }
];

const DEFAULT_HOME_STATS: HomeStat[] = [
    { id: '1', icon: 'Trophy', value: '5+', label: 'Tahun Pengalaman', color: 'text-yellow-500' },
    { id: '2', icon: 'Check', value: '150+', label: 'Project Selesai', color: 'text-green-500' },
    { id: '3', icon: 'Users', value: '80+', label: 'Klien Puas', color: 'text-blue-500' },
    { id: '4', icon: 'Zap', value: '24/7', label: 'Support Cepat', color: 'text-purple-500' },
];

const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
    { step: '01', title: 'Konsultasi', description: 'Diskusi mendalam tentang tujuan dan kebutuhan bisnis Anda.', icon: 'Briefcase' },
    { step: '02', title: 'Strategi', description: 'Merancang blueprint dan roadmap solusi digital.', icon: 'Target' },
    { step: '03', title: 'Eksekusi', description: 'Pengembangan website atau setup iklan oleh ahli.', icon: 'Code' },
    { step: '04', title: 'Optimasi', description: 'Monitoring dan perbaikan berkelanjutan untuk hasil maksimal.', icon: 'BarChart' }
];

const DEFAULT_HOME_CONTENT: HomeContent = {
    heroTitle: 'Kami Membangun Masa Depan Digital',
    heroSubtitle: 'Partner strategis untuk pertumbuhan bisnis Anda melalui Website High-Performance, Iklan Tertarget, dan Identitas Brand yang Ikonik.',
    heroButtonText: 'Lihat Layanan & Harga',
    showTrustedBrands: true,
    trustedBrands: [], // Empty initially for images
    howItWorks: DEFAULT_PROCESS_STEPS
};

// --- AUTH CREDENTIALS ---
const DEFAULT_AUTH: AdminCredentials = {
    username: 'admin',
    password: 'admin123'
};

export const getAdminCredentials = (): AdminCredentials => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_AUTH));
        return DEFAULT_AUTH;
    }
    return JSON.parse(stored);
}

export const saveAdminCredentials = (creds: AdminCredentials): void => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(creds));
}

// --- Services ---

export const getServices = (): Service[] => {
  const stored = localStorage.getItem(SERVICES_KEY);
  if (!stored) {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(DEFAULT_SERVICES));
    return DEFAULT_SERVICES;
  }
  return JSON.parse(stored);
};

// Filter: Get Only Main Services (Not children)
export const getMainServices = (): Service[] => {
    return getServices().filter(s => !s.parentServiceId);
};

// Filter: Get Child Services by Parent ID
export const getSubServices = (parentId: string): Service[] => {
    return getServices().filter(s => s.parentServiceId === parentId);
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  const services = getServices();
  return services.find(s => s.slug === slug);
};

export const saveServices = (services: Service[]): void => {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
};

export const addService = (service: Service): void => {
  const current = getServices();
  const updated = [...current, service];
  saveServices(updated);
};

export const updateService = (updatedService: Service): void => {
    const services = getServices();
    const index = services.findIndex(s => s.id === updatedService.id);
    if (index !== -1) {
        services[index] = updatedService;
        saveServices(services);
    }
}

export const deleteService = (id: string): void => {
  const current = getServices();
  const updated = current.filter(s => s.id !== id);
  saveServices(updated);
};

// --- GLOBAL PORTFOLIOS (NEW) ---

export const getGlobalPortfolios = (): PortfolioItem[] => {
    const stored = localStorage.getItem(PORTFOLIO_KEY);
    if (!stored) {
        localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(DEFAULT_PORTFOLIOS));
        return DEFAULT_PORTFOLIOS;
    }
    return JSON.parse(stored);
};

export const saveGlobalPortfolios = (items: PortfolioItem[]): void => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(items));
};

export const addGlobalPortfolio = (item: PortfolioItem): void => {
    const current = getGlobalPortfolios();
    saveGlobalPortfolios([item, ...current]);
};

export const updateGlobalPortfolio = (item: PortfolioItem): void => {
    const current = getGlobalPortfolios();
    const idx = current.findIndex(p => p.id === item.id);
    if (idx !== -1) {
        current[idx] = item;
        saveGlobalPortfolios(current);
    }
};

export const deleteGlobalPortfolio = (id: string): void => {
    const current = getGlobalPortfolios();
    saveGlobalPortfolios(current.filter(p => p.id !== id));
};

// Legacy Helper wrapper for page compatibility if needed, 
// though Pages should now call getGlobalPortfolios directly.
export const getAllPortfolios = (): any[] => {
    // For Service pages that use extended item, we can synthesize this
    // But better to use getGlobalPortfolios.
    // This maintains old signature roughly but uses new data
    const globalP = getGlobalPortfolios();
    const services = getServices();
    
    return globalP.map(p => {
        const service = services.find(s => s.id === p.serviceId);
        return {
            ...p,
            serviceSlug: service?.slug || '',
            serviceTitle: service?.title || 'General'
        };
    });
};

// --- Blogs ---

export const getBlogs = (): BlogPost[] => {
  const stored = localStorage.getItem(BLOG_KEY);
  if (!stored) {
    localStorage.setItem(BLOG_KEY, JSON.stringify(DEFAULT_BLOGS));
    return DEFAULT_BLOGS;
  }
  return JSON.parse(stored);
};

// Public helper: only published blogs
export const getPublishedBlogs = (): BlogPost[] => {
    return getBlogs().filter(b => b.status === 'published');
}

export const getRecentBlogs = (limit: number = 3): BlogPost[] => {
    const blogs = getPublishedBlogs();
    return blogs.slice(0, limit);
}

export const getBlogBySlug = (slug: string): BlogPost | undefined => {
    const blogs = getPublishedBlogs();
    return blogs.find(b => b.slug === slug);
};

export const getRelatedBlogs = (currentSlug: string, category: string, limit: number = 3): BlogPost[] => {
    const blogs = getPublishedBlogs();
    return blogs
        .filter(b => b.slug !== currentSlug && b.category === category)
        .slice(0, limit);
}

// Get Saved Categories
export const getBlogCategories = (): string[] => {
    const stored = localStorage.getItem(BLOG_CATEGORIES_KEY);
    if (!stored) {
        localStorage.setItem(BLOG_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
    }
    return JSON.parse(stored);
}

export const saveBlogCategories = (categories: string[]): void => {
    localStorage.setItem(BLOG_CATEGORIES_KEY, JSON.stringify(categories));
}

export const addBlogCategory = (category: string): void => {
    const cats = getBlogCategories();
    if (!cats.includes(category)) {
        saveBlogCategories([...cats, category]);
    }
}

export const deleteBlogCategory = (category: string): void => {
    const cats = getBlogCategories();
    saveBlogCategories(cats.filter(c => c !== category));
}

export const saveBlogs = (blogs: BlogPost[]): void => {
  localStorage.setItem(BLOG_KEY, JSON.stringify(blogs));
};

export const addBlog = (blog: BlogPost): void => {
  const current = getBlogs();
  const updated = [blog, ...current]; // Newest first
  saveBlogs(updated);
};

export const updateBlog = (updatedBlog: BlogPost): void => {
    const blogs = getBlogs();
    const index = blogs.findIndex(b => b.id === updatedBlog.id);
    if (index !== -1) {
        blogs[index] = updatedBlog;
        saveBlogs(blogs);
    }
}

export const deleteBlog = (id: string): void => {
    const current = getBlogs();
    const updated = current.filter(b => b.id !== id);
    saveBlogs(updated);
};

// --- Config / Settings ---

export const getSiteConfig = (): SiteConfig => {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
        return DEFAULT_CONFIG;
    }
    return JSON.parse(stored);
};

export const saveSiteConfig = (config: SiteConfig): void => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// --- Testimonials ---

export const getTestimonials = (): Testimonial[] => {
    const stored = localStorage.getItem(TESTIMONIALS_KEY);
    if (!stored) {
        localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
        return DEFAULT_TESTIMONIALS;
    }
    return JSON.parse(stored);
};

export const saveTestimonials = (data: Testimonial[]): void => {
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(data));
};

// --- Home Stats ---

export const getHomeStats = (): HomeStat[] => {
    const stored = localStorage.getItem(HOME_STATS_KEY);
    if (!stored) {
        localStorage.setItem(HOME_STATS_KEY, JSON.stringify(DEFAULT_HOME_STATS));
        return DEFAULT_HOME_STATS;
    }
    return JSON.parse(stored);
};

export const saveHomeStats = (data: HomeStat[]): void => {
    localStorage.setItem(HOME_STATS_KEY, JSON.stringify(data));
};

// --- Home Content (Hero, etc) ---

export const getHomeContent = (): HomeContent => {
    const stored = localStorage.getItem(HOME_CONTENT_KEY);
    if (!stored) {
        localStorage.setItem(HOME_CONTENT_KEY, JSON.stringify(DEFAULT_HOME_CONTENT));
        return DEFAULT_HOME_CONTENT;
    }
    return JSON.parse(stored);
};

export const saveHomeContent = (data: HomeContent): void => {
    localStorage.setItem(HOME_CONTENT_KEY, JSON.stringify(data));
};
