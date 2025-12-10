
import React, { useState, useEffect, useRef } from 'react';
import { 
    getServices, addService, deleteService, updateService, 
    getBlogs, addBlog, deleteBlog, updateBlog, 
    getBlogCategories, addBlogCategory, deleteBlogCategory,
    getHomeContent, saveHomeContent, 
    getHomeStats, saveHomeStats, 
    getTestimonials, saveTestimonials,
    getGlobalPortfolios, addGlobalPortfolio, updateGlobalPortfolio, deleteGlobalPortfolio,
    getAdminCredentials, saveAdminCredentials 
} from '../services/dataService';
import { generateBlogArticle, generateServiceFAQs } from '../services/geminiService';
import { Service, BlogPost, PricingPlan, PortfolioItem, HomeContent, HomeStat, Testimonial, TrustedBrand } from '../types';
import { Icons, DynamicIcon, IconName } from '../components/Icons';
import { RichTextEditor } from '../components/RichTextEditor';
import { useConfig } from '../contexts/ConfigContext';
import { useToast } from '../contexts/ToastContext';

// --- INTERNAL COMPONENT: MODERN IMAGE UPLOAD ---
const ImageUploader = ({ 
    image, 
    onChange, 
    label = "Upload Image", 
    height = "h-48" 
}: { 
    image: string, 
    onChange: (base64: string) => void, 
    label?: string,
    height?: string
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onChange(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-bold mb-2 dark:text-slate-300">{label}</label>
            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group w-full ${height} border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all hover:border-blue-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700`}
            >
                {image ? (
                    <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                            <Icons.Image size={32} className="mb-2" />
                            <span className="font-bold text-sm">Ganti Gambar</span>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                            <Icons.Image size={24} />
                        </div>
                        <span className="text-sm font-medium">Klik untuk upload</span>
                        <span className="text-xs opacity-70 mt-1">PNG, JPG up to 5MB</span>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                />
            </div>
            {image && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onChange(''); }} 
                    className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                >
                    <Icons.Trash2 size={12} /> Hapus Gambar
                </button>
            )}
        </div>
    );
};

// --- INTERNAL COMPONENT: ICON PICKER ---
const IconPicker = ({ onSelect, onClose }: { onSelect: (iconName: string) => void, onClose: () => void }) => {
    const iconList = Object.keys(Icons) as IconName[];
    const [search, setSearch] = useState('');
    
    const filtered = iconList.filter(icon => icon.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold dark:text-white">Pilih Ikon</h3>
                    <button onClick={onClose}><Icons.X size={20} className="dark:text-white"/></button>
                </div>
                <div className="p-4 border-b dark:border-slate-800">
                    <input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
                        placeholder="Cari nama ikon..."
                        autoFocus
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 gap-2">
                    {filtered.map(icon => (
                        <button 
                            key={icon} 
                            onClick={() => onSelect(icon)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded flex flex-col items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600"
                            title={icon}
                        >
                            <DynamicIcon name={icon} size={24} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const AdminDashboard: React.FC = () => {
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false); 

  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'blog' | 'home_editor' | 'testimonials' | 'settings' | 'portfolio_manager' | 'profile'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- GLOBAL CONTEXT ---
  const { config, updateConfig } = useConfig();
  const { showToast } = useToast();
  const [tempConfig, setTempConfig] = useState(config);

  // --- DATA STATES ---
  const [services, setServices] = useState<Service[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContent>(getHomeContent());
  const [stats, setStats] = useState<HomeStat[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [globalPortfolios, setGlobalPortfolios] = useState<PortfolioItem[]>([]);
  
  // --- SERVICE EDITOR ---
  const [isEditingService, setIsEditingService] = useState<string | null>(null);
  const [editingServiceData, setEditingServiceData] = useState<Service | null>(null);
  const [editTab, setEditTab] = useState<'general' | 'features' | 'benefits' | 'pricing' | 'seo' | 'portfolio' | 'faqs'>('general');
  const [newServiceName, setNewServiceName] = useState('');
  const [selectedGlobalPortfolioId, setSelectedGlobalPortfolioId] = useState<string>(''); // For linking
  const [faqGenerating, setFaqGenerating] = useState(false);
  
  // --- PRICING EDITOR ---
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [tempPlanData, setTempPlanData] = useState<PricingPlan | null>(null);

  // --- PORTFOLIO EDITOR (GLOBAL & SERVICE) ---
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [tempPortfolio, setTempPortfolio] = useState<PortfolioItem | null>(null);

  // --- ICON PICKER STATE ---
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconPickerCallback, setIconPickerCallback] = useState<((icon: string) => void) | null>(null);

  // --- BLOG EDITOR & MANAGEMENT STATE ---
  const [blogView, setBlogView] = useState<'list' | 'editor'>('list');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Blog List State
  const [blogSearch, setBlogSearch] = useState('');
  const [blogPage, setBlogPage] = useState(1);
  const blogsPerPage = 5;

  // Blog Editor State
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('');
  const [newBlogImage, setNewBlogImage] = useState('');
  const [newBlogKeywords, setNewBlogKeywords] = useState('');
  const [blogGenerating, setBlogGenerating] = useState(false);
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogSummary, setNewBlogSummary] = useState('');

  // --- PROFILE ---
  const [profileUsername, setProfileUsername] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profilePasswordConfirm, setProfilePasswordConfirm] = useState('');
  const [showProfilePassword, setShowProfilePassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      const creds = getAdminCredentials();
      setProfileUsername(creds.username);
      setProfilePassword(creds.password);
      setProfilePasswordConfirm(creds.password);
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => { setTempConfig(config); }, [config]);

  const refreshData = () => {
    setServices(getServices());
    setBlogs(getBlogs());
    setCustomCategories(getBlogCategories());
    setHomeContent(getHomeContent());
    setStats(getHomeStats());
    setTestimonials(getTestimonials());
    setGlobalPortfolios(getGlobalPortfolios());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => callback(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  const openIconPicker = (callback: (icon: string) => void) => {
      setIconPickerCallback(() => callback);
      setShowIconPicker(true);
  };

  // --- AUTHENTICATION ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = getAdminCredentials();
    if (username === creds.username && password === creds.password) {
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Selamat datang Admin!', 'success');
    } else {
      setLoginError('Username atau Password salah!');
    }
  };

  // --- SERVICE LOGIC ---
  const handleDeleteService = (e: React.MouseEvent, id: string) => {
      e.stopPropagation(); // STOP PROPAGATION AGAR TIDAK MEMBUKA EDIT
      if (window.confirm('Hapus layanan ini permanen?')) {
          const updated = services.filter(s => s.id !== id);
          setServices(updated); 
          deleteService(id);
          showToast('Layanan dihapus', 'success');
      }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newServiceName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const newService: Service = {
      id: Date.now().toString(),
      title: newServiceName,
      slug: slug,
      shortDescription: 'Deskripsi singkat...',
      fullDescription: '<p>Deskripsi lengkap...</p>',
      iconName: 'Globe',
      seoTitle: newServiceName,
      seoKeywords: [],
      features: [], benefits: [], portfolio: [], faqs: [], plans: [] 
    };
    addService(newService);
    refreshData();
    setNewServiceName('');
    startEditService(newService);
    showToast('Layanan baru dibuat', 'success');
  };

  const startEditService = (service: Service) => {
      setIsEditingService(service.id);
      setEditingServiceData({ ...service });
      setEditTab('general');
      setEditingPlanId(null);
  };

  const saveServiceEdit = () => {
      if (editingServiceData) {
          updateService(editingServiceData);
          setIsEditingService(null);
          setEditingServiceData(null);
          refreshData();
          showToast('Perubahan disimpan', 'success');
      }
  };

  const updateArrayItem = (arrayName: 'features' | 'benefits' | 'portfolio' | 'faqs', index: number, field: string, value: any) => {
      if (!editingServiceData) return;
      // @ts-ignore
      const arr = [...editingServiceData[arrayName]];
      arr[index] = { ...arr[index], [field]: value };
      // @ts-ignore
      setEditingServiceData({ ...editingServiceData, [arrayName]: arr });
  };
  
  const removeArrayItem = (arrayName: 'features' | 'benefits' | 'portfolio' | 'faqs', index: number) => {
      if (!editingServiceData) return;
      // @ts-ignore
      const arr = editingServiceData[arrayName].filter((_, i) => i !== index);
      // @ts-ignore
      setEditingServiceData({ ...editingServiceData, [arrayName]: arr });
  };
  
  const addItem = (type: 'features' | 'benefits' | 'portfolio' | 'faqs') => {
      if (!editingServiceData) return;
      let newItem;
      if (type === 'features') newItem = { title: 'Keunggulan Baru', description: '', icon: 'Star' };
      if (type === 'benefits') newItem = { title: 'Manfaat', description: '' };
      if (type === 'portfolio') newItem = { id: Date.now().toString(), image: '', title: 'Project', category: 'Portfolio', serviceId: editingServiceData.id };
      if (type === 'faqs') newItem = { question: 'Pertanyaan?', answer: 'Jawaban' };
      // @ts-ignore
      setEditingServiceData({ ...editingServiceData, [type]: [...(editingServiceData[type] || []), newItem] });
  };

  const linkGlobalPortfolio = () => {
      if (!editingServiceData || !selectedGlobalPortfolioId) return;
      const selectedItem = globalPortfolios.find(p => p.id === selectedGlobalPortfolioId);
      if (selectedItem) {
          // Check if already exists
          const exists = editingServiceData.portfolio.some(p => p.id === selectedItem.id);
          if (exists) {
              showToast("Portfolio sudah ada di layanan ini", 'info');
              return;
          }
          // Copy item to service portfolio
          setEditingServiceData({
              ...editingServiceData,
              portfolio: [...editingServiceData.portfolio, selectedItem]
          });
          setSelectedGlobalPortfolioId('');
          showToast("Portfolio berhasil ditambahkan", 'success');
      }
  };

  const handleAutoGenerateFAQs = async () => {
      if (!editingServiceData) return;
      setFaqGenerating(true);
      const generated = await generateServiceFAQs(editingServiceData.title);
      if (generated && generated.length > 0) {
          // Merge or Replace? Let's append.
          setEditingServiceData({
              ...editingServiceData,
              faqs: [...editingServiceData.faqs, ...generated]
          });
          showToast('FAQ berhasil dibuat oleh AI!', 'success');
      } else {
          showToast('Gagal generate FAQ', 'error');
      }
      setFaqGenerating(false);
  }

  // --- PRICING LOGIC ---
  const startAddPlan = () => {
      setTempPlanData({ id: Date.now().toString(), name: 'Paket Baru', price: 'Rp 0', features: [{ text: 'Fitur 1', included: true }], recommended: false });
      setEditingPlanId('NEW');
  };

  const startEditPlan = (plan: PricingPlan) => {
      setTempPlanData({ ...plan });
      setEditingPlanId(plan.id);
  };

  const savePlan = () => {
      if (!editingServiceData || !tempPlanData) return;
      let newPlans = [...editingServiceData.plans];
      if (editingPlanId === 'NEW') {
          newPlans.push(tempPlanData);
      } else {
          const idx = newPlans.findIndex(p => p.id === tempPlanData.id);
          if (idx !== -1) newPlans[idx] = tempPlanData;
      }
      setEditingServiceData({ ...editingServiceData, plans: newPlans });
      setEditingPlanId(null);
      setTempPlanData(null);
  };

  const deletePlan = (id: string) => {
      if (!editingServiceData) return;
      if (window.confirm('Hapus paket harga ini?')) {
          const newPlans = editingServiceData.plans.filter(p => p.id !== id);
          setEditingServiceData({ ...editingServiceData, plans: newPlans });
      }
  }

  // --- BLOG LOGIC ---
  const handleSaveBlog = (status: 'published' | 'draft') => {
      if (!newBlogTitle) return showToast('Judul wajib diisi', 'error');
      const blogData: BlogPost = {
          id: editingBlogId || Date.now().toString(),
          title: newBlogTitle,
          slug: newBlogTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
          category: newBlogCategory || customCategories[0] || 'Uncategorized',
          content: newBlogContent,
          summary: newBlogSummary,
          author: 'Admin',
          date: new Date().toISOString().split('T')[0],
          imageUrl: newBlogImage,
          tags: newBlogKeywords.split(',').map(s => s.trim()).filter(s => s !== ''),
          status: status
      };
      if (editingBlogId) updateBlog(blogData);
      else addBlog(blogData);
      
      refreshData();
      setBlogView('list');
      setEditingBlogId(null);
      setNewBlogTitle(''); setNewBlogContent(''); setNewBlogSummary(''); setNewBlogImage(''); setNewBlogKeywords('');
      showToast('Artikel disimpan', 'success');
  };

  const handleGenerateBlog = async () => {
    if (!newBlogTitle) return showToast("Judul wajib diisi", 'error');
    setBlogGenerating(true);
    const res = await generateBlogArticle(newBlogTitle, newBlogKeywords || 'teknologi');
    setNewBlogContent(res.content);
    setNewBlogSummary(res.summary);
    setBlogGenerating(false);
    showToast("Artikel digenerate AI", 'success');
  };

  const handleDeleteBlog = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm('Hapus artikel?')) {
          setBlogs(blogs.filter(b => b.id !== id));
          deleteBlog(id);
      }
  }

  const handleAddCategory = () => {
      if(newCategoryName && !customCategories.includes(newCategoryName)) {
          addBlogCategory(newCategoryName);
          setNewCategoryName('');
          refreshData();
          showToast('Kategori ditambahkan', 'success');
      }
  }

  // --- BLOG PAGINATION & FILTER LOGIC ---
  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
    b.category.toLowerCase().includes(blogSearch.toLowerCase())
  );
  
  const indexOfLastBlog = blogPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const startEditBlog = (blog: BlogPost) => {
      setEditingBlogId(blog.id);
      setNewBlogTitle(blog.title);
      setNewBlogContent(blog.content);
      setNewBlogSummary(blog.summary);
      setNewBlogCategory(blog.category);
      setNewBlogImage(blog.imageUrl);
      setNewBlogKeywords(blog.tags.join(', '));
      setBlogView('editor');
  }

  // --- HOME EDITOR LOGIC ---
  const handleSaveHomeContent = () => {
      saveHomeContent(homeContent);
      saveHomeStats(stats);
      showToast('Halaman Home berhasil diupdate!', 'success');
  }

  const updateStat = (index: number, field: keyof HomeStat, value: string) => {
      const newStats = [...stats];
      // @ts-ignore
      newStats[index][field] = value;
      setStats(newStats);
  }

  const addTrustedBrand = () => {
      setHomeContent({...homeContent, trustedBrands: [...homeContent.trustedBrands, { id: Date.now().toString(), name: 'Brand', logoUrl: '' }]});
  }

  const updateTrustedBrand = (idx: number, field: keyof TrustedBrand, value: any) => {
      const updated = [...homeContent.trustedBrands];
      // @ts-ignore
      updated[idx][field] = value;
      setHomeContent({...homeContent, trustedBrands: updated});
  }

  const removeTrustedBrand = (idx: number) => {
      const updated = homeContent.trustedBrands.filter((_, i) => i !== idx);
      setHomeContent({...homeContent, trustedBrands: updated});
  }

  const updateProcessStep = (idx: number, field: keyof typeof homeContent.howItWorks[0], value: string) => {
      const updated = [...homeContent.howItWorks];
      // @ts-ignore
      updated[idx][field] = value;
      setHomeContent({...homeContent, howItWorks: updated});
  }

  // --- TESTIMONIAL LOGIC ---
  const addTestimonial = () => {
      const newTesti: Testimonial = { id: Date.now().toString(), name: 'Klien Baru', role: 'CEO', content: 'Isi testimoni...', rating: 5 };
      setTestimonials([...testimonials, newTesti]);
      saveTestimonials([...testimonials, newTesti]); // Auto save draft
  }

  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
      const updated = [...testimonials];
      // @ts-ignore
      updated[index][field] = value;
      setTestimonials(updated);
  }

  const handleDeleteTestimonial = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm('Hapus testimoni?')) {
          const updated = testimonials.filter(t => t.id !== id);
          setTestimonials(updated);
          saveTestimonials(updated);
      }
  }

  const saveTestimonialsManual = () => {
      saveTestimonials(testimonials);
      showToast('Semua testimoni tersimpan', 'success');
  }

  // --- SETTINGS LOGIC ---
  const handleSaveSettings = () => {
      updateConfig(tempConfig);
      showToast('Pengaturan disimpan', 'success');
  }

  // --- PORTFOLIO MANAGER LOGIC ---
  const handleSavePortfolio = () => {
      if(!tempPortfolio) return;
      if (editingPortfolioId === 'NEW') {
          addGlobalPortfolio({...tempPortfolio, id: Date.now().toString()});
      } else {
          updateGlobalPortfolio(tempPortfolio);
      }
      setEditingPortfolioId(null);
      setTempPortfolio(null);
      refreshData();
      showToast('Portfolio disimpan', 'success');
  }

  const handleDeletePortfolio = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm('Hapus portfolio?')) {
          setGlobalPortfolios(globalPortfolios.filter(p => p.id !== id));
          deleteGlobalPortfolio(id);
      }
  }

  // --- PROFILE LOGIC ---
  const handleSaveProfile = () => {
      if(profilePassword && profilePassword === profilePasswordConfirm) {
          saveAdminCredentials({ username: profileUsername, password: profilePassword });
          showToast('Profile updated', 'success');
      } else {
          showToast('Password tidak cocok', 'error');
      }
  }


  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 font-sans p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-slate-800 animate-fade-in-up">
          <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                  <Icons.LayoutDashboard size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">MazmoAdmin</h2>
              <p className="text-slate-500 text-sm mt-2">Login untuk mengelola website</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">{loginError}</div>}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Username</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Users size={18} /></div>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all" placeholder="Enter username" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Lock size={18} /></div>
                  <input type={showLoginPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all" placeholder="Enter password" />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showLoginPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                  </button>
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-[1.02]">
              Masuk Dashboard
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-slate-400">Default: admin / admin123</div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950 overflow-hidden font-sans">
      
      {/* GLOBAL ICON PICKER MODAL */}
      {showIconPicker && (
          <IconPicker 
            onSelect={(icon) => { if(iconPickerCallback) iconPickerCallback(icon); setShowIconPicker(false); }}
            onClose={() => setShowIconPicker(false)}
          />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="text-blue-600">Mazmo</span>Panel
          </h2>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500"><Icons.X size={24} /></button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {[
              { id: 'overview', label: 'Overview', icon: Icons.LayoutDashboard },
              { id: 'home_editor', label: 'Editor Home', icon: Icons.Globe },
              { id: 'portfolio_manager', label: 'Portfolio', icon: Icons.Image },
              { id: 'services', label: 'Layanan', icon: Icons.Code },
              { id: 'testimonials', label: 'Testimoni', icon: Icons.Users },
              { id: 'blog', label: 'Blog & SEO', icon: Icons.Megaphone },
              { id: 'settings', label: 'Pengaturan', icon: Icons.Briefcase },
              { id: 'profile', label: 'Profil Admin', icon: Icons.Lock }
          ].map((item) => (
             <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }} 
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             >
                <item.icon size={18} /> {item.label}
             </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium w-full px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                <Icons.X size={18} /> Keluar
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950 flex flex-col relative">
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Panel Admin</h2>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600"><Icons.Menu size={24} /></button>
        </div>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Layanan', value: services.length, icon: Icons.Code, color: 'bg-blue-500' },
                            { label: 'Artikel Blog', value: blogs.length, icon: Icons.Megaphone, color: 'bg-purple-500' },
                            { label: 'Portfolio Item', value: globalPortfolios.length, icon: Icons.Image, color: 'bg-orange-500' },
                            { label: 'Testimoni', value: testimonials.length, icon: Icons.Users, color: 'bg-green-500' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4">
                                <div className={`p-4 rounded-xl ${stat.color} text-white shadow-lg`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                    <span className="text-slate-500 text-sm">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: SERVICES */}
            {activeTab === 'services' && (
                <div className="space-y-6 animate-fade-in">
                    {isEditingService && editingServiceData ? (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border dark:border-slate-800 flex flex-col h-[85vh]">
                            {/* Editor Header */}
                            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 rounded-t-xl">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">Edit Layanan</h2>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => {setIsEditingService(null); setEditingServiceData(null)}} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700">Batal</button>
                                    <button onClick={saveServiceEdit} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow hover:bg-blue-700">Simpan Perubahan</button>
                                </div>
                            </div>

                            {/* Editor Tabs */}
                            <div className="flex border-b dark:border-slate-800 px-6 overflow-x-auto bg-white dark:bg-slate-900">
                                {['general', 'features', 'benefits', 'pricing', 'portfolio', 'faqs', 'seo'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setEditTab(tab as any)}
                                        className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${editTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Editor Content */}
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-slate-950/50">
                                {editTab === 'general' && (
                                    <div className="space-y-4 max-w-3xl bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                                        <label className="block mb-1 font-bold dark:text-white text-sm">Nama Layanan</label>
                                        <input value={editingServiceData.title} onChange={(e) => setEditingServiceData({...editingServiceData, title: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"/>
                                        
                                        {/* SERVICE ICON PICKER */}
                                        <label className="block mb-1 font-bold dark:text-white text-sm">Icon Layanan</label>
                                        <div className="flex gap-4 items-center mb-4">
                                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 border dark:border-slate-700">
                                                <DynamicIcon name={editingServiceData.iconName} size={32} />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => openIconPicker((icon) => setEditingServiceData({...editingServiceData, iconName: icon as any}))}
                                                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                Ganti Icon
                                            </button>
                                        </div>

                                        {/* PARENT SERVICE SELECTOR (SUB-SERVICE) */}
                                        <div>
                                            <label className="block mb-1 font-bold dark:text-white text-sm">Induk Layanan (Parent Service)</label>
                                            <select 
                                                value={editingServiceData.parentServiceId || ''} 
                                                onChange={(e) => setEditingServiceData({...editingServiceData, parentServiceId: e.target.value || undefined})} 
                                                className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
                                            >
                                                <option value="">-- Tidak Ada (Layanan Utama) --</option>
                                                {services.filter(s => s.id !== editingServiceData.id && !s.parentServiceId).map(s => (
                                                    <option key={s.id} value={s.id}>{s.title}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-slate-500 mt-1">Jika dipilih, layanan ini akan menjadi sub-layanan dari Induk yang dipilih.</p>
                                        </div>

                                        <label className="block mb-1 font-bold dark:text-white text-sm">Deskripsi Singkat</label>
                                        <textarea value={editingServiceData.shortDescription} onChange={(e) => setEditingServiceData({...editingServiceData, shortDescription: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white" rows={2}/>
                                        <RichTextEditor label="Deskripsi Lengkap" value={editingServiceData.fullDescription} onChange={(val) => setEditingServiceData({...editingServiceData, fullDescription: val})} />
                                        
                                        {/* NEW: SEO Content Section Fields */}
                                        <div className="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6">
                                            <h4 className="font-bold mb-4 text-blue-600 dark:text-blue-400">SEO Content Section (Optional)</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block mb-1 font-bold dark:text-white text-sm">Judul Seksi Konten (SEO)</label>
                                                    <input 
                                                        value={editingServiceData.contentSectionTitle || ''} 
                                                        onChange={(e) => setEditingServiceData({...editingServiceData, contentSectionTitle: e.target.value})} 
                                                        className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
                                                        placeholder="Contoh: Jasa Website Profesional di Jakarta"
                                                    />
                                                </div>
                                                <RichTextEditor 
                                                    label="Isi Seksi Konten (SEO)" 
                                                    value={editingServiceData.contentSectionBody || ''} 
                                                    onChange={(val) => setEditingServiceData({...editingServiceData, contentSectionBody: val})} 
                                                    placeholder="Tulis artikel SEO tambahan disini..."
                                                    minHeight="200px"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {editTab === 'features' && (
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                                            <div className="flex justify-between mb-4"><h3 className="font-bold dark:text-white">Keunggulan Kami (Features)</h3><button onClick={() => addItem('features')} className="text-xs text-blue-600 font-bold">+ Tambah</button></div>
                                            {editingServiceData.features.map((item, idx) => (
                                                <div key={idx} className="flex flex-col md:flex-row gap-2 mb-4 p-3 border rounded dark:border-slate-800 items-start">
                                                    <button 
                                                        onClick={() => openIconPicker((icon) => updateArrayItem('features', idx, 'icon', icon))}
                                                        className="w-10 h-10 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                                                        title="Ganti Ikon"
                                                    >
                                                        <DynamicIcon name={item.icon || 'Star'} size={20} />
                                                    </button>
                                                    <div className="flex-1 space-y-2 w-full">
                                                        <input value={item.title} onChange={(e) => updateArrayItem('features', idx, 'title', e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-900 dark:text-white" placeholder="Judul Keunggulan"/>
                                                        <textarea value={item.description} onChange={(e) => updateArrayItem('features', idx, 'description', e.target.value)} className="w-full p-2 border rounded text-xs dark:bg-slate-900 dark:text-white" placeholder="Deskripsi singkat..." rows={2}/>
                                                    </div>
                                                    <button onClick={() => removeArrayItem('features', idx)} className="text-red-500 p-1"><Icons.X size={16}/></button>
                                                </div>
                                            ))}
                                            {editingServiceData.features.length === 0 && <p className="text-slate-400 italic text-center">Belum ada fitur ditambahkan.</p>}
                                        </div>
                                    </div>
                                )}

                                {editTab === 'benefits' && (
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                                            <div className="flex justify-between mb-4"><h3 className="font-bold dark:text-white">Manfaat Utama (Benefits)</h3><button onClick={() => addItem('benefits')} className="text-xs text-blue-600 font-bold">+ Tambah</button></div>
                                            {editingServiceData.benefits.map((item, idx) => (
                                                <div key={idx} className="flex gap-2 mb-2 items-start">
                                                    <div className="flex-1 space-y-2">
                                                        <input value={item.title} onChange={(e) => updateArrayItem('benefits', idx, 'title', e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-900 dark:text-white" placeholder="Judul Manfaat"/>
                                                        <textarea value={item.description} onChange={(e) => updateArrayItem('benefits', idx, 'description', e.target.value)} className="w-full p-2 border rounded text-xs dark:bg-slate-900 dark:text-white" placeholder="Deskripsi..." rows={2}/>
                                                    </div>
                                                    <button onClick={() => removeArrayItem('benefits', idx)} className="text-red-500 mt-2"><Icons.X size={16}/></button>
                                                </div>
                                            ))}
                                             {editingServiceData.benefits.length === 0 && <p className="text-slate-400 italic text-center">Belum ada manfaat ditambahkan.</p>}
                                        </div>
                                    </div>
                                )}

                                {editTab === 'pricing' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-lg dark:text-white">Paket Harga</h3>
                                            {!editingPlanId && <button onClick={startAddPlan} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">+ Tambah Paket</button>}
                                        </div>
                                        
                                        {editingPlanId ? (
                                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 shadow-lg max-w-2xl">
                                                <h4 className="font-bold mb-4 dark:text-white border-b pb-2">Editor Paket</h4>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <input value={tempPlanData?.name || ''} onChange={e => setTempPlanData(prev => prev ? {...prev, name: e.target.value} : null)} placeholder="Nama Paket" className="p-3 border rounded dark:bg-slate-800 dark:text-white font-bold"/>
                                                    <input value={tempPlanData?.price || ''} onChange={e => setTempPlanData(prev => prev ? {...prev, price: e.target.value} : null)} placeholder="Harga" className="p-3 border rounded dark:bg-slate-800 dark:text-white font-bold"/>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" checked={tempPlanData?.recommended || false} onChange={e => setTempPlanData(prev => prev ? {...prev, recommended: e.target.checked} : null)} className="w-5 h-5"/>
                                                        <span className="font-medium dark:text-white">Rekomendasi (Best Value)</span>
                                                    </label>
                                                </div>
                                                <div className="space-y-2 mb-6">
                                                    <label className="font-bold text-sm dark:text-slate-300">Fitur Paket</label>
                                                    {tempPlanData?.features.map((feat, idx) => (
                                                        <div key={idx} className="flex gap-2 items-center">
                                                            <input value={feat.text} onChange={e => { if(!tempPlanData) return; const fs = [...tempPlanData.features]; fs[idx].text = e.target.value; setTempPlanData({...tempPlanData, features: fs}); }} className="flex-1 p-2 border rounded text-sm dark:bg-slate-800 dark:text-white"/>
                                                            <input type="checkbox" checked={feat.included} onChange={e => { if(!tempPlanData) return; const fs = [...tempPlanData.features]; fs[idx].included = e.target.checked; setTempPlanData({...tempPlanData, features: fs}); }} className="w-5 h-5 accent-green-500"/>
                                                            <button onClick={() => { if(!tempPlanData) return; const fs = tempPlanData.features.filter((_, i) => i !== idx); setTempPlanData({...tempPlanData, features: fs}); }} className="text-red-500 p-1"><Icons.X size={18}/></button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => { if(!tempPlanData) return; setTempPlanData({...tempPlanData, features: [...tempPlanData.features, {text: '', included: true}]}); }} className="text-xs text-blue-600 font-bold hover:underline">+ Tambah Fitur</button>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={savePlan} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Simpan</button>
                                                    <button onClick={() => setEditingPlanId(null)} className="bg-slate-200 text-slate-800 px-4 py-2 rounded">Batal</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {editingServiceData.plans.map(plan => (
                                                    <div key={plan.id} className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 relative group hover:shadow-lg transition-all ${plan.recommended ? 'border-blue-500 ring-2 ring-blue-500/10' : 'dark:border-slate-800'}`}>
                                                        {plan.recommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Recommended</span>}
                                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => startEditPlan(plan)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><Icons.Edit3 size={16}/></button>
                                                            <button onClick={() => deletePlan(plan.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><Icons.Trash2 size={16}/></button>
                                                        </div>
                                                        <h4 className="font-bold text-lg dark:text-white">{plan.name}</h4>
                                                        <p className="text-2xl font-extrabold text-blue-600 mb-4">{plan.price}</p>
                                                        <div className="space-y-2 border-t pt-4 dark:border-slate-800">
                                                            {plan.features.map((f, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-sm">
                                                                    {f.included ? <Icons.Check size={14} className="text-green-500"/> : <Icons.X size={14} className="text-red-400 opacity-50"/>}
                                                                    <span className={`dark:text-slate-300 ${!f.included && 'line-through opacity-50'}`}>{f.text}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {editTab === 'portfolio' && (
                                    <div className="space-y-8">
                                        {/* LINK EXISTING PORTFOLIO */}
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                                            <h3 className="font-bold mb-4 dark:text-white">Pilih dari Global Portfolio</h3>
                                            <div className="flex gap-4">
                                                <select 
                                                    value={selectedGlobalPortfolioId} 
                                                    onChange={e => setSelectedGlobalPortfolioId(e.target.value)} 
                                                    className="flex-1 p-2 border rounded dark:bg-slate-800 dark:text-white"
                                                >
                                                    <option value="">-- Pilih Project --</option>
                                                    {globalPortfolios.map(p => (
                                                        <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                                                    ))}
                                                </select>
                                                <button 
                                                    onClick={linkGlobalPortfolio} 
                                                    className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm whitespace-nowrap"
                                                >
                                                    + Tambahkan
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                                            <h3 className="font-bold mb-4 dark:text-white">Daftar Portfolio Layanan Ini</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                {/* Upload NEW Portfolio specific to service */}
                                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 relative cursor-pointer min-h-[160px]">
                                                    <input type="file" onChange={(e) => handleImageUpload(e, (b64) => { if(editingServiceData) { const newItem: PortfolioItem = { id: Date.now().toString(), title: 'New Project', category: 'Portfolio', image: b64, serviceId: editingServiceData.id }; setEditingServiceData({...editingServiceData, portfolio: [...(editingServiceData.portfolio || []), newItem]}); } })} className="absolute inset-0 opacity-0 cursor-pointer"/>
                                                    <Icons.Plus size={32} className="mb-2"/>
                                                    <span className="text-xs font-bold text-center">Upload Baru</span>
                                                </div>
                                                
                                                {editingServiceData.portfolio && editingServiceData.portfolio.map((item, idx) => (
                                                    <div key={idx} className="border dark:border-slate-700 rounded-xl overflow-hidden relative group">
                                                        <img src={item.image} className="w-full h-32 object-cover"/>
                                                        <div className="p-2 space-y-1 bg-white dark:bg-slate-900">
                                                            <input value={item.title} onChange={(e) => updateArrayItem('portfolio', idx, 'title', e.target.value)} className="w-full text-xs border p-1 rounded font-bold dark:bg-slate-800 dark:text-white" placeholder="Judul Project"/>
                                                        </div>
                                                        <button onClick={() => removeArrayItem('portfolio', idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity"><Icons.X size={14}/></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editTab === 'faqs' && (
                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                                <h3 className="font-bold dark:text-white">Pertanyaan Umum (FAQ)</h3>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={handleAutoGenerateFAQs} 
                                                        disabled={faqGenerating}
                                                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                                                    >
                                                        <Icons.Wand2 size={16}/> {faqGenerating ? 'Generating...' : 'Auto Generate by AI'}
                                                    </button>
                                                    <button onClick={() => addItem('faqs')} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">+ Manual</button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {editingServiceData.faqs.map((item, idx) => (
                                                    <div key={idx} className="border dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-950 relative">
                                                        <div className="space-y-2 pr-8">
                                                            <input value={item.question} onChange={(e) => updateArrayItem('faqs', idx, 'question', e.target.value)} className="w-full p-2 border rounded font-bold text-sm dark:bg-slate-800 dark:text-white" placeholder="Pertanyaan"/>
                                                            <textarea value={item.answer} onChange={(e) => updateArrayItem('faqs', idx, 'answer', e.target.value)} className="w-full p-2 border rounded text-xs dark:bg-slate-800 dark:text-white" placeholder="Jawaban" rows={2}/>
                                                        </div>
                                                        <button onClick={() => removeArrayItem('faqs', idx)} className="absolute top-4 right-4 text-red-500"><Icons.X size={16}/></button>
                                                    </div>
                                                ))}
                                                {editingServiceData.faqs.length === 0 && <p className="text-slate-400 italic text-center py-4">Belum ada FAQ.</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editTab === 'seo' && (
                                     <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 space-y-4">
                                        <div><label className="block mb-1 text-sm font-bold dark:text-white">SEO Title</label><input value={editingServiceData.seoTitle || ''} onChange={(e) => setEditingServiceData({...editingServiceData, seoTitle: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"/></div>
                                        <div><label className="block mb-1 text-sm font-bold dark:text-white">Keywords</label><input value={editingServiceData.seoKeywords?.join(', ') || ''} onChange={(e) => setEditingServiceData({...editingServiceData, seoKeywords: e.target.value.split(',')})} className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"/></div>
                                     </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold dark:text-white">Daftar Layanan</h3>
                            <form onSubmit={handleAddService} className="flex gap-2">
                                <input value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} className="p-2 border rounded dark:bg-slate-800 dark:text-white dark:border-slate-700" placeholder="Nama Layanan Baru..." />
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">+ Buat</button>
                            </form>
                        </div>
                        <div className="grid gap-4">
                            {services.map((s) => (
                                <div 
                                    key={s.id} 
                                    className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-6 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow group"
                                    onClick={() => startEditService(s)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <DynamicIcon name={s.iconName} size={24}/>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg dark:text-white group-hover:text-blue-600 transition-colors">{s.title}</h4>
                                                {s.parentServiceId && <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-500 px-2 py-0.5 rounded-full">Sub-Layanan</span>}
                                            </div>
                                            <p className="text-xs text-slate-500">{s.slug}</p>
                                        </div>
                                    </div>
                                    
                                    {/* DELETE BUTTON (STRICT) */}
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDeleteService(e, s.id)}
                                        className="text-slate-400 hover:text-red-600 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        title="Hapus Layanan"
                                    >
                                        <Icons.Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        </>
                    )}
                </div>
            )}
            
            {/* TAB: BLOG (REVAMPED) */}
            {activeTab === 'blog' && (
                <div className="space-y-6 animate-fade-in">
                    {blogView === 'editor' ? (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 shadow-xl flex flex-col h-full">
                           <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-slate-800">
                               <h3 className="font-bold text-xl dark:text-white">{editingBlogId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
                               <button onClick={() => setBlogView('list')} className="text-slate-500 hover:text-slate-700">Batal</button>
                           </div>
                           
                           {/* Editor Main Content */}
                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                               {/* Left Column: Editor */}
                               <div className="lg:col-span-2 space-y-4">
                                   <div>
                                       <label className="block mb-1 text-sm font-bold dark:text-slate-300">Judul Artikel</label>
                                       <input 
                                          value={newBlogTitle} 
                                          onChange={e => setNewBlogTitle(e.target.value)} 
                                          className="w-full p-3 border rounded-lg text-lg font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                                          placeholder="Contoh: 5 Tips SEO di 2024..."
                                       />
                                   </div>
                                   
                                   <RichTextEditor label="Konten Artikel" value={newBlogContent} onChange={setNewBlogContent} minHeight="400px" />
                               </div>

                               {/* Right Column: Meta & Settings */}
                               <div className="space-y-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <ImageUploader 
                                            image={newBlogImage} 
                                            onChange={setNewBlogImage} 
                                            label="Gambar Utama (Thumbnail)"
                                        />
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-bold dark:text-white">Kategori</label>
                                            <div className="flex gap-2">
                                                <select 
                                                    value={newBlogCategory} 
                                                    onChange={e => setNewBlogCategory(e.target.value)} 
                                                    className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white text-sm"
                                                >
                                                    <option value="">Pilih Kategori</option>
                                                    {customCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            {/* Quick Add Category */}
                                            <div className="mt-2 flex gap-1">
                                                <input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Atau buat baru..." className="flex-1 text-xs p-1.5 border rounded dark:bg-slate-900 dark:border-slate-700"/>
                                                <button onClick={handleAddCategory} className="text-xs bg-slate-200 dark:bg-slate-700 px-2 rounded font-bold">+</button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-bold dark:text-white">Tags (Keywords)</label>
                                            <input 
                                                value={newBlogKeywords} 
                                                onChange={e => setNewBlogKeywords(e.target.value)} 
                                                className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white text-sm" 
                                                placeholder="seo, tips, bisnis..."
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-xl border border-purple-100 dark:border-slate-700">
                                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                            <Icons.Wand2 size={16}/> AI Assistant
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-3">Generate artikel otomatis berdasarkan judul & keywords.</p>
                                        <button 
                                            onClick={handleGenerateBlog} 
                                            disabled={blogGenerating} 
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors"
                                        >
                                            {blogGenerating ? 'Sedang Menulis...' : 'Generate Content'}
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-4 border-t dark:border-slate-700">
                                        <button onClick={() => handleSaveBlog('published')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/30">
                                            Publish Artikel
                                        </button>
                                        <button onClick={() => handleSaveBlog('draft')} className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-lg font-bold">
                                            Simpan Draft
                                        </button>
                                    </div>
                               </div>
                           </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Management Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="font-bold text-xl dark:text-white">Manajemen Blog</h3>
                                    <p className="text-slate-500 text-sm">Kelola semua artikel dan berita terbaru.</p>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={() => { 
                                            setEditingBlogId(null); 
                                            setNewBlogTitle(''); 
                                            setNewBlogContent(''); 
                                            setNewBlogCategory(''); 
                                            setNewBlogKeywords(''); 
                                            setNewBlogImage('');
                                            setBlogView('editor'); 
                                        }} 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                                    >
                                        <Icons.Plus size={18} /> Buat Baru
                                    </button>
                                </div>
                            </div>

                            {/* Search & Filter Bar */}
                            <div className="flex gap-4 items-center">
                                <div className="relative flex-1">
                                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Cari artikel berdasarkan judul atau kategori..." 
                                        value={blogSearch}
                                        onChange={(e) => { setBlogSearch(e.target.value); setBlogPage(1); }}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Blog List Table */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                                {currentBlogs.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {currentBlogs.map(blog => (
                                            <div key={blog.id} className="p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                {/* Thumbnail */}
                                                <div className="w-full md:w-32 h-20 flex-shrink-0 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                                                    {blog.imageUrl ? (
                                                        <img src={blog.imageUrl} className="w-full h-full object-cover" alt={blog.title} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <Icons.Image size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            {blog.category}
                                                        </span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${blog.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                            {blog.status}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-1">{blog.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1"><Icons.Users size={12}/> {blog.author}</span>
                                                        <span className="flex items-center gap-1"><Icons.Clock size={12}/> {blog.date}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => startEditBlog(blog)}
                                                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                                                        title="Edit Artikel"
                                                    >
                                                        <Icons.Edit3 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleDeleteBlog(e, blog.id)}
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                                                        title="Hapus Artikel"
                                                    >
                                                        <Icons.Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-slate-500">
                                        <Icons.Search size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>Tidak ada artikel yang ditemukan.</p>
                                    </div>
                                )}
                                
                                {/* Pagination Footer */}
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                        <span className="text-sm text-slate-500">Halaman {blogPage} dari {totalPages}</span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setBlogPage(p => Math.max(1, p - 1))}
                                                disabled={blogPage === 1}
                                                className="px-3 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded text-sm disabled:opacity-50"
                                            >
                                                Prev
                                            </button>
                                            <button 
                                                onClick={() => setBlogPage(p => Math.min(totalPages, p + 1))}
                                                disabled={blogPage === totalPages}
                                                className="px-3 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded text-sm disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: PORTFOLIO MANAGER */}
            {activeTab === 'portfolio_manager' && (
                <div className="space-y-6 animate-fade-in">
                     {editingPortfolioId ? (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 shadow-xl max-w-2xl mx-auto">
                            <h3 className="font-bold text-xl mb-6 dark:text-white">{editingPortfolioId === 'NEW' ? 'Tambah Portfolio' : 'Edit Portfolio'}</h3>
                            <div className="space-y-4">
                                <ImageUploader 
                                    image={tempPortfolio?.image || ''} 
                                    onChange={(b64) => setTempPortfolio(prev => prev ? {...prev, image: b64} : null)}
                                    label="Gambar Project"
                                />
                                <div>
                                    <label className="block text-sm font-bold mb-1 dark:text-white">Judul Project</label>
                                    <input 
                                        value={tempPortfolio?.title || ''} 
                                        onChange={e => setTempPortfolio(prev => prev ? {...prev, title: e.target.value} : null)} 
                                        className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1 dark:text-white">Kategori</label>
                                    <input 
                                        value={tempPortfolio?.category || ''} 
                                        onChange={e => setTempPortfolio(prev => prev ? {...prev, category: e.target.value} : null)} 
                                        className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
                                        placeholder="Web App, Mobile App, Branding..."
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={handleSavePortfolio} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Simpan Portfolio</button>
                                    <button onClick={() => setEditingPortfolioId(null)} className="bg-gray-200 text-slate-800 px-6 py-2 rounded-lg font-bold">Batal</button>
                                </div>
                            </div>
                        </div>
                     ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 shadow-sm">
                                <div>
                                    <h3 className="font-bold text-xl dark:text-white">Global Portfolio</h3>
                                    <p className="text-slate-500 text-sm">Kelola semua project yang telah dikerjakan.</p>
                                </div>
                                <button onClick={() => { setTempPortfolio({id:'', title:'', category:'Web', image:''}); setEditingPortfolioId('NEW'); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20">+ Tambah Project</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {globalPortfolios.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group relative">
                                        <div className="h-56 bg-gray-200 dark:bg-slate-800 relative">
                                            <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button onClick={() => { setTempPortfolio(item); setEditingPortfolioId(item.id); }} className="bg-white p-2 rounded-full text-blue-600 hover:scale-110 transition-transform"><Icons.Edit3 size={20}/></button>
                                                <button onClick={(e) => handleDeletePortfolio(e, item.id)} className="bg-white p-2 rounded-full text-red-600 hover:scale-110 transition-transform"><Icons.Trash2 size={20}/></button>
                                            </div>
                                            <span className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-bold text-lg dark:text-white mb-1">{item.title}</h4>
                                            <p className="text-xs text-slate-500">Service ID: {item.serviceId || 'Global'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     )}
                </div>
            )}

            {/* TAB: HOME EDITOR (FULL FEATURES) */}
            {activeTab === 'home_editor' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between"><h2 className="text-2xl font-bold dark:text-white">Edit Home</h2><button onClick={handleSaveHomeContent} className="bg-green-600 text-white px-4 py-2 rounded font-bold">Simpan</button></div>
                    
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                        <h3 className="font-bold mb-4 dark:text-white">Hero Section</h3>
                        <label className="block mb-1 font-bold text-sm">Judul Utama</label>
                        <input value={homeContent.heroTitle} onChange={(e) => setHomeContent({...homeContent, heroTitle: e.target.value})} className="w-full p-2 border rounded mb-4"/>
                        <label className="block mb-1 font-bold text-sm">Sub Judul</label>
                        <textarea value={homeContent.heroSubtitle} onChange={(e) => setHomeContent({...homeContent, heroSubtitle: e.target.value})} className="w-full p-2 border rounded" rows={2}/>
                        <label className="block mt-4 mb-1 font-bold text-sm">Teks Tombol CTA</label>
                        <input value={homeContent.heroButtonText} onChange={(e) => setHomeContent({...homeContent, heroButtonText: e.target.value})} className="w-full p-2 border rounded"/>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="font-bold dark:text-white">Trusted Brands (Logo Klien)</h3>
                             <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={homeContent.showTrustedBrands} onChange={e => setHomeContent({...homeContent, showTrustedBrands: e.target.checked})} /> Tampilkan</label>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {homeContent.trustedBrands.map((brand, idx) => (
                                <div key={idx} className="border p-4 rounded relative text-center">
                                    <input type="file" onChange={(e) => handleImageUpload(e, (b64) => updateTrustedBrand(idx, 'logoUrl', b64))} className="text-xs mb-2"/>
                                    {brand.logoUrl && <img src={brand.logoUrl} className="h-8 mx-auto mb-2"/>}
                                    <input value={brand.name} onChange={(e) => updateTrustedBrand(idx, 'name', e.target.value)} className="w-full text-xs border p-1 rounded text-center" placeholder="Nama Brand"/>
                                    <button onClick={() => removeTrustedBrand(idx)} className="text-red-500 absolute top-1 right-1"><Icons.X size={14}/></button>
                                </div>
                            ))}
                            <button onClick={addTrustedBrand} className="border-dashed border-2 p-4 text-gray-400 font-bold flex flex-col items-center justify-center h-full hover:bg-slate-50">+ Add Brand</button>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                        <h3 className="font-bold mb-4 dark:text-white">Statistik</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {stats.map((stat, i) => (
                                 <div key={i} className="flex gap-2 items-center border p-2 rounded">
                                     <div className="w-8 flex-shrink-0 text-center text-xl">{i+1}</div>
                                     <div className="flex-1 space-y-2">
                                         <input value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} className="w-full p-1 border rounded font-bold" placeholder="Value (e.g. 100+)"/>
                                         <input value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} className="w-full p-1 border rounded text-sm" placeholder="Label"/>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800">
                        <h3 className="font-bold mb-4 dark:text-white">Cara Kerja (Process Steps)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {homeContent.howItWorks.map((step, idx) => (
                                <div key={idx} className="border p-4 rounded bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
                                    <div className="font-bold mb-2 self-start">Langkah {step.step}</div>
                                    <button 
                                        onClick={() => openIconPicker((icon) => updateProcessStep(idx, 'icon', icon))}
                                        className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"
                                    >
                                        <DynamicIcon name={step.icon} size={24} />
                                    </button>
                                    <input value={step.title} onChange={(e) => updateProcessStep(idx, 'title', e.target.value)} className="w-full p-1 border rounded mb-2 font-bold text-center" placeholder="Judul"/>
                                    <textarea value={step.description} onChange={(e) => updateProcessStep(idx, 'description', e.target.value)} className="w-full p-1 border rounded text-xs text-center" rows={3} placeholder="Deskripsi"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: TESTIMONIALS (RESTORED) */}
            {activeTab === 'testimonials' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center"><h2 className="text-2xl font-bold dark:text-white">Testimoni</h2><button onClick={addTestimonial} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">+ Baru</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((testi, idx) => (
                            <div key={testi.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-700 shadow-sm relative group">
                                <button onClick={(e) => handleDeleteTestimonial(e, testi.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-2"><Icons.Trash2 size={18}/></button>
                                <div className="space-y-2 pr-8">
                                    <input value={testi.name} onChange={(e) => updateTestimonial(idx, 'name', e.target.value)} className="w-full p-2 border rounded font-bold" placeholder="Nama"/>
                                    <input value={testi.role} onChange={(e) => updateTestimonial(idx, 'role', e.target.value)} className="w-full p-2 border rounded text-xs" placeholder="Role"/>
                                    <textarea value={testi.content} onChange={(e) => updateTestimonial(idx, 'content', e.target.value)} className="w-full p-2 border rounded text-sm" rows={2}/>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Rating:</span>
                                        <select value={testi.rating} onChange={(e) => updateTestimonial(idx, 'rating', parseInt(e.target.value))} className="p-1 border rounded">
                                            {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Bintang</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={saveTestimonialsManual} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl shadow">Simpan Semua Perubahan</button>
                </div>
            )}

            {/* TAB: SETTINGS (FULL SOCIALS) */}
            {activeTab === 'settings' && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 space-y-6 max-w-3xl animate-fade-in">
                    <h2 className="text-2xl font-bold dark:text-white mb-6">Pengaturan Website Global</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block font-bold mb-1">WhatsApp Admin</label>
                             <input value={tempConfig.whatsappNumber} onChange={e => setTempConfig({...tempConfig, whatsappNumber: e.target.value})} className="w-full p-2 border rounded" placeholder="628..."/>
                        </div>
                        <div>
                             <label className="block font-bold mb-1">Email Bisnis</label>
                             <input value={tempConfig.email} onChange={e => setTempConfig({...tempConfig, email: e.target.value})} className="w-full p-2 border rounded"/>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block font-bold mb-1">Alamat Kantor</label>
                        <textarea value={tempConfig.address} onChange={e => setTempConfig({...tempConfig, address: e.target.value})} className="w-full p-2 border rounded" rows={2}/>
                    </div>

                    <div>
                        <ImageUploader 
                            image={tempConfig.logoUrl || ''} 
                            onChange={(b64) => setTempConfig({...tempConfig, logoUrl: b64})}
                            label="Logo Website"
                            height="h-32"
                        />
                    </div>

                    <div className="pt-6 border-t dark:border-slate-700">
                        <h3 className="font-bold mb-4 text-lg">Social Media Links</h3>
                        <div className="space-y-3">
                             <div className="flex items-center gap-2">
                                 <Icons.Instagram size={20} className="text-pink-600"/>
                                 <input value={tempConfig.instagram || ''} onChange={e => setTempConfig({...tempConfig, instagram: e.target.value})} className="flex-1 p-2 border rounded" placeholder="Instagram URL"/>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Icons.Facebook size={20} className="text-blue-600"/>
                                 <input value={tempConfig.facebook || ''} onChange={e => setTempConfig({...tempConfig, facebook: e.target.value})} className="flex-1 p-2 border rounded" placeholder="Facebook URL"/>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Icons.Linkedin size={20} className="text-blue-700"/>
                                 <input value={tempConfig.linkedin || ''} onChange={e => setTempConfig({...tempConfig, linkedin: e.target.value})} className="flex-1 p-2 border rounded" placeholder="LinkedIn URL"/>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Icons.Youtube size={20} className="text-red-600"/>
                                 <input value={tempConfig.youtube || ''} onChange={e => setTempConfig({...tempConfig, youtube: e.target.value})} className="flex-1 p-2 border rounded" placeholder="YouTube URL"/>
                             </div>
                             <div className="flex items-center gap-2">
                                 <Icons.TikTok size={20} className="text-black dark:text-white"/>
                                 <input value={tempConfig.tiktok || ''} onChange={e => setTempConfig({...tempConfig, tiktok: e.target.value})} className="flex-1 p-2 border rounded" placeholder="TikTok URL"/>
                             </div>
                        </div>
                    </div>
                    
                    <button onClick={handleSaveSettings} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold mt-4 shadow-lg hover:bg-blue-700 w-full md:w-auto">Simpan Konfigurasi</button>
                </div>
            )}

            {/* TAB: PROFILE (UPDATED WITH PASSWORD TOGGLE) */}
            {activeTab === 'profile' && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-slate-800 space-y-4 max-w-md animate-fade-in">
                    <h2 className="text-2xl font-bold dark:text-white mb-6">Ganti Password Admin</h2>
                    <input value={profileUsername} onChange={e => setProfileUsername(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Username"/>
                    
                    <div className="relative">
                        <input 
                            type={showProfilePassword ? "text" : "password"} 
                            value={profilePassword} 
                            onChange={e => setProfilePassword(e.target.value)} 
                            className="w-full p-3 pr-10 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                            placeholder="New Password"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowProfilePassword(!showProfilePassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            {showProfilePassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input 
                            type={showProfilePassword ? "text" : "password"} 
                            value={profilePasswordConfirm} 
                            onChange={e => setProfilePasswordConfirm(e.target.value)} 
                            className="w-full p-3 pr-10 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                            placeholder="Confirm Password"
                        />
                         {/* Toggle button linked to same state for convenience */}
                    </div>

                    <button onClick={handleSaveProfile} className="bg-blue-600 text-white w-full py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition-colors">Update Profile</button>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};
