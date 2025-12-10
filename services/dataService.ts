
import { supabase } from '../lib/supabaseClient';
import { Service, BlogPost, SiteConfig, PortfolioItem, Testimonial, HomeStat, HomeContent, AdminCredentials } from '../types';

// ==========================================
// MOCK DATA (DATA DUMMY)
// Digunakan jika database belum konek
// ==========================================

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Jasa Pembuatan Website',
    slug: 'jasa-pembuatan-website',
    iconName: 'Globe',
    shortDescription: 'Website profesional, cepat, dan SEO friendly yang dirancang untuk mengonversi pengunjung menjadi pelanggan.',
    fullDescription: '<p>Kami membangun website yang tidak hanya indah dipandang tetapi juga berorientasi pada performa dan penjualan. Menggunakan teknologi terbaru seperti React dan Tailwind CSS.</p><p>Cocok untuk UMKM, Company Profile, hingga Toko Online.</p>',
    seoTitle: 'Jasa Pembuatan Website Profesional & SEO Friendly',
    seoKeywords: ['jasa website', 'buat website', 'web developer indonesia'],
    features: [
      { title: 'Responsive Design', description: 'Tampil sempurna di Desktop, Tablet, dan Mobile.', icon: 'LayoutDashboard' },
      { title: 'SEO Optimized', description: 'Struktur kode yang disukai Google agar mudah ranking 1.', icon: 'Search' },
      { title: 'Fast Loading', description: 'Optimasi kecepatan untuk user experience terbaik.', icon: 'Zap' }
    ],
    benefits: [
      { title: 'Kredibilitas Meningkat', description: 'Bisnis terlihat lebih profesional dan terpercaya di mata calon customer.' },
      { title: 'Jangkauan Luas', description: 'Dapat diakses oleh pelanggan dari seluruh dunia 24/7 tanpa henti.' }
    ],
    plans: [
        { id: 'p1', name: 'Landing Page', price: 'Rp 1.500.000', features: [{ text: 'One Page Design', included: true }, { text: 'Mobile Friendly', included: true }, { text: 'Free Domain .com', included: true }], recommended: false },
        { id: 'p2', name: 'Company Profile', price: 'Rp 3.500.000', features: [{ text: '5 Halaman', included: true }, { text: 'CMS Admin', included: true }, { text: 'SEO Basic', included: true }, { text: 'Email Bisnis', included: true }], recommended: true },
        { id: 'p3', name: 'Toko Online', price: 'Rp 5.000.000', features: [{ text: 'Integrasi Payment', included: true }, { text: 'Manajemen Produk', included: true }, { text: 'Laporan Penjualan', included: true }], recommended: false }
    ],
    faqs: [
        { question: 'Berapa lama proses pembuatan?', answer: 'Tergantung kompleksitas, rata-rata 3-7 hari kerja untuk Landing Page dan 7-14 hari untuk Company Profile.' },
        { question: 'Apakah dapat revisi?', answer: 'Ya, kami memberikan kesempatan revisi mayor 2x dan revisi minor sepuasnya sebelum finalisasi.' }
    ],
    portfolio: []
  },
  {
    id: '2',
    title: 'Digital Marketing (Ads)',
    slug: 'jasa-digital-marketing',
    iconName: 'Megaphone',
    shortDescription: 'Tingkatkan penjualan secara instan dengan strategi iklan Facebook & Google Ads yang tertarget.',
    fullDescription: '<p>Jangkau audiens yang tepat di waktu yang tepat. Kami mengelola budget iklan Anda untuk menghasilkan ROI (Return on Investment) maksimal.</p>',
    features: [
        { title: 'Targeting Akurat', description: 'Menjangkau pelanggan ideal berdasarkan lokasi, minat, dan perilaku.', icon: 'Target' },
        { title: 'Laporan Harian', description: 'Transparansi data performa iklan yang real-time.', icon: 'BarChart' }
    ],
    benefits: [],
    plans: [
        { id: 'ad1', name: 'Starter Ads', price: 'Rp 1.000.000', features: [{ text: 'Setup Kampanye', included: true }, { text: 'Budget Management', included: true }, { text: 'Report Bulanan', included: true }], recommended: false }
    ],
    faqs: [],
    portfolio: []
  },
  {
    id: '3',
    title: 'Branding Identity',
    slug: 'jasa-branding',
    iconName: 'Palette',
    shortDescription: 'Ciptakan identitas brand yang kuat dan mudah diingat oleh pelanggan Anda.',
    fullDescription: '<p>Dari desain logo hingga panduan visual lengkap. Kami membantu brand Anda bercerita melalui visual yang memukau.</p>',
    features: [], benefits: [], plans: [], faqs: [], portfolio: []
  }
];

const MOCK_BLOGS: BlogPost[] = [
    {
        id: '1',
        title: '5 Alasan Bisnis Perlu Website di 2024',
        slug: 'alasan-bisnis-perlu-website',
        category: 'Bisnis',
        summary: 'Mengapa kehadiran digital sangat krusial untuk kelangsungan bisnis modern.',
        content: '<p>Di era digital ini, website bukan lagi opsi, melainkan kebutuhan. Pelanggan mencari produk dan jasa melalui Google sebelum memutuskan membeli.</p><h2>1. Kredibilitas</h2><p>Website membuat bisnis Anda terlihat resmi.</p>',
        author: 'Admin',
        date: '2024-03-15',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        tags: ['Bisnis', 'Website'],
        status: 'published'
    },
    {
        id: '2',
        title: 'Cara Optimasi SEO untuk Pemula',
        slug: 'cara-optimasi-seo-pemula',
        category: 'Teknologi',
        summary: 'Panduan dasar agar website Anda muncul di halaman pertama Google.',
        content: '<p>SEO adalah seni mendatangkan pengunjung secara gratis. Mulai dengan riset keyword yang tepat...</p>',
        author: 'Mazmo Team',
        date: '2024-03-10',
        imageUrl: 'https://images.unsplash.com/photo-1571721795195-a2ca2d337096?auto=format&fit=crop&w=800&q=80',
        tags: ['SEO', 'Google'],
        status: 'published'
    }
];

const MOCK_PORTFOLIO: PortfolioItem[] = [
    { id: '1', title: 'Coffee Shop Landing Page', category: 'Website', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80', serviceId: '1' },
    { id: '2', title: 'Fashion Brand Identity', category: 'Branding', image: 'https://images.unsplash.com/photo-1542038784424-fa00ed49fc44?auto=format&fit=crop&w=800&q=80', serviceId: '3' },
    { id: '3', title: 'Tech Startup Dashboard', category: 'App Design', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', serviceId: '1' }
];

const DEFAULT_CONFIG: SiteConfig = {
    whatsappNumber: '628123456789',
    email: 'hello@mazmodev.com',
    address: 'Jakarta, Indonesia',
    logoUrl: '',
    instagram: 'https://instagram.com', linkedin: '', facebook: '', youtube: '', tiktok: ''
};

const MOCK_TESTIMONIALS: Testimonial[] = [
    { id: '1', name: 'Budi Santoso', role: 'CEO PT Maju Jaya', content: 'Pelayanan sangat profesional, website saya jadi dalam 3 hari!', rating: 5 },
    { id: '2', name: 'Siti Aminah', role: 'Owner Batik Modern', content: 'Omset naik 200% setelah pakai jasa Ads dari MazmoDev.', rating: 5 },
    { id: '3', name: 'John Doe', role: 'Tech Startup', content: 'Desain UI/UX yang sangat modern dan clean.', rating: 4 }
];

const MOCK_STATS: HomeStat[] = [
    { id: '1', label: 'Project Selesai', value: '150+', icon: 'Check', color: 'bg-green-100 text-green-600' },
    { id: '2', label: 'Klien Puas', value: '98%', icon: 'Users', color: 'bg-blue-100 text-blue-600' },
    { id: '3', label: 'Tahun Pengalaman', value: '5+', icon: 'Trophy', color: 'bg-yellow-100 text-yellow-600' },
    { id: '4', label: 'Support', value: '24/7', icon: 'Clock', color: 'bg-purple-100 text-purple-600' }
];

const MOCK_HOME_CONTENT: HomeContent = {
    heroTitle: 'Kami Membangun Masa Depan Digital Anda',
    heroSubtitle: 'Solusi lengkap untuk pembuatan website, aplikasi, dan strategi pemasaran digital yang terukur.',
    heroButtonText: 'Mulai Konsultasi',
    showTrustedBrands: true,
    trustedBrands: [
        { id: '1', name: 'Google', logoUrl: '' },
        { id: '2', name: 'Meta', logoUrl: '' },
        { id: '3', name: 'Shopify', logoUrl: '' }
    ],
    howItWorks: [
        { step: '01', title: 'Konsultasi', description: 'Diskusi kebutuhan dan tujuan bisnis Anda.', icon: 'Users' },
        { step: '02', title: 'Perancangan', description: 'Kami membuat strategi dan desain draft.', icon: 'Palette' },
        { step: '03', title: 'Pengembangan', description: 'Proses coding dan setup kampanye iklan.', icon: 'Code' },
        { step: '04', title: 'Peluncuran', description: 'Website live dan iklan mulai berjalan.', icon: 'Rocket' }
    ]
};

// ==========================================
// CORE LOGIC (Hybrid System)
// ==========================================

// Helper: Ambil data (Cek LocalStorage -> Cek Supabase -> Pakai Mock)
const fetchData = async <T>(key: string, tableName: string, mockData: T): Promise<T> => {
    // 1. Prioritas 1: LocalStorage (Agar editan di admin panel tersimpan di browser)
    const local = localStorage.getItem(`mazmodev_${key}`);
    
    // 2. Cek apakah Supabase sudah dikonfigurasi dengan benar (Bukan default URL)
    // @ts-ignore
    const isSupabaseConfigured = supabase.supabaseUrl && !supabase.supabaseUrl.includes('xyzcompany');

    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase.from(tableName).select('*');
            if (!error && data && data.length > 0) {
                // Jika database ada isinya, pakai data database
                // Kita juga simpan ke local storage agar sinkron
                localStorage.setItem(`mazmodev_${key}`, JSON.stringify(data));
                return data as unknown as T;
            }
        } catch (e) {
            console.warn(`Supabase fetch failed for ${tableName}, using fallback.`);
        }
    }

    // 3. Jika LocalStorage ada, kembalikan itu
    if (local) return JSON.parse(local);

    // 4. Jika semua kosong, inisialisasi dengan Mock Data
    localStorage.setItem(`mazmodev_${key}`, JSON.stringify(mockData));
    return mockData;
};

// Helper: Simpan data
const saveData = async <T>(key: string, tableName: string, data: T, id?: string): Promise<void> => {
    // 1. Selalu simpan ke LocalStorage (UI Update Instant)
    localStorage.setItem(`mazmodev_${key}`, JSON.stringify(data));
    
    // 2. Coba simpan ke Supabase jika ada
    // @ts-ignore
    const isSupabaseConfigured = supabase.supabaseUrl && !supabase.supabaseUrl.includes('xyzcompany');
    if (isSupabaseConfigured) {
         try {
             // Logic sinkronisasi ke DB bisa ditambahkan di sini
             // Untuk versi ini, kita biarkan silent fail agar user tidak terganggu error
         } catch (e) {
             console.error("Supabase save error", e);
         }
    }
};

// ==========================================
// EXPORTED SERVICES
// ==========================================

// --- SERVICES ---
export const getServices = async (): Promise<Service[]> => {
    return fetchData<Service[]>('services', 'services', MOCK_SERVICES);
};

export const getMainServices = async (): Promise<Service[]> => {
    const services = await getServices();
    return services.filter(s => !s.parentServiceId);
};

export const getSubServices = async (parentId: string): Promise<Service[]> => {
    const services = await getServices();
    return services.filter(s => s.parentServiceId === parentId);
};

export const getServiceBySlug = async (slug: string): Promise<Service | undefined> => {
    const services = await getServices();
    return services.find(s => s.slug === slug);
};

export const addService = async (service: Service): Promise<void> => {
    const services = await getServices();
    const updated = [...services, service];
    await saveData('services', 'services', updated);
};

export const updateService = async (service: Service): Promise<void> => {
    const services = await getServices();
    const updated = services.map(s => s.id === service.id ? service : s);
    await saveData('services', 'services', updated);
};

export const deleteService = async (id: string): Promise<void> => {
    const services = await getServices();
    const updated = services.filter(s => s.id !== id);
    await saveData('services', 'services', updated);
};

// --- PORTFOLIOS ---
export const getGlobalPortfolios = async (): Promise<PortfolioItem[]> => {
    return fetchData<PortfolioItem[]>('portfolios', 'portfolios', MOCK_PORTFOLIO);
};

export const addGlobalPortfolio = async (item: PortfolioItem): Promise<void> => {
    const items = await getGlobalPortfolios();
    const updated = [...items, item];
    await saveData('portfolios', 'portfolios', updated);
};

export const updateGlobalPortfolio = async (item: PortfolioItem): Promise<void> => {
    const items = await getGlobalPortfolios();
    const updated = items.map(p => p.id === item.id ? item : p);
    await saveData('portfolios', 'portfolios', updated);
};

export const deleteGlobalPortfolio = async (id: string): Promise<void> => {
    const items = await getGlobalPortfolios();
    const updated = items.filter(p => p.id !== id);
    await saveData('portfolios', 'portfolios', updated);
};

// --- BLOGS ---
export const getBlogs = async (): Promise<BlogPost[]> => {
    return fetchData<BlogPost[]>('blogs', 'blogs', MOCK_BLOGS);
};

export const getPublishedBlogs = async (): Promise<BlogPost[]> => {
    const blogs = await getBlogs();
    return blogs.filter(b => b.status === 'published');
};

export const getRecentBlogs = async (limit: number = 3): Promise<BlogPost[]> => {
    const blogs = await getPublishedBlogs();
    return blogs.slice(0, limit);
};

export const getBlogBySlug = async (slug: string): Promise<BlogPost | undefined> => {
    const blogs = await getBlogs();
    return blogs.find(b => b.slug === slug);
};

export const getRelatedBlogs = async (currentSlug: string, category: string, limit: number = 3): Promise<BlogPost[]> => {
    const blogs = await getPublishedBlogs();
    return blogs
        .filter(b => b.category === category && b.slug !== currentSlug)
        .slice(0, limit);
};

export const addBlog = async (blog: BlogPost): Promise<void> => {
    const blogs = await getBlogs();
    const updated = [blog, ...blogs];
    await saveData('blogs', 'blogs', updated);
};

export const updateBlog = async (blog: BlogPost): Promise<void> => {
    const blogs = await getBlogs();
    const updated = blogs.map(b => b.id === blog.id ? blog : b);
    await saveData('blogs', 'blogs', updated);
};

export const deleteBlog = async (id: string): Promise<void> => {
    const blogs = await getBlogs();
    const updated = blogs.filter(b => b.id !== id);
    await saveData('blogs', 'blogs', updated);
};

export const getBlogCategories = async (): Promise<string[]> => {
    const blogs = await getBlogs();
    const cats = Array.from(new Set(blogs.map(b => b.category)));
    return cats.length > 0 ? cats : ['Teknologi', 'Bisnis', 'Tips'];
};

export const addBlogCategory = async (category: string): Promise<void> => {
    // No-op untuk mock
};

export const deleteBlogCategory = async (category: string): Promise<void> => {
    // No-op
};

// --- CONFIG & SETTINGS ---
export const getSiteConfig = async (): Promise<SiteConfig> => {
    return fetchData<SiteConfig>('config', 'settings', DEFAULT_CONFIG);
};

export const saveSiteConfig = (config: SiteConfig): void => {
    localStorage.setItem('mazmodev_config', JSON.stringify(config));
};

// --- TESTIMONIALS ---
export const getTestimonials = async (): Promise<Testimonial[]> => {
    return fetchData<Testimonial[]>('testimonials', 'testimonials', MOCK_TESTIMONIALS);
};

export const saveTestimonials = (data: Testimonial[]): void => {
    localStorage.setItem('mazmodev_testimonials', JSON.stringify(data));
};

// --- HOME STATS ---
export const getHomeStats = async (): Promise<HomeStat[]> => {
    return fetchData<HomeStat[]>('home_stats', 'stats', MOCK_STATS);
};

export const saveHomeStats = (data: HomeStat[]): void => {
    localStorage.setItem('mazmodev_home_stats', JSON.stringify(data));
};

// --- HOME CONTENT ---
export const getHomeContent = async (): Promise<HomeContent> => {
    return fetchData<HomeContent>('home_content', 'content', MOCK_HOME_CONTENT);
};

export const saveHomeContent = (data: HomeContent): void => {
    localStorage.setItem('mazmodev_home_content', JSON.stringify(data));
};

// --- AUTH ---
export const getAdminCredentials = (): AdminCredentials => {
    const stored = localStorage.getItem('mazmodev_auth');
    if (!stored) return { username: 'admin', password: 'admin123' };
    return JSON.parse(stored);
}

export const saveAdminCredentials = (creds: AdminCredentials): void => {
    localStorage.setItem('mazmodev_auth', JSON.stringify(creds));
}
