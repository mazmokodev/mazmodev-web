
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons, DynamicIcon } from './Icons';
import { useConfig } from '../contexts/ConfigContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { getWhatsappLink, config } = useConfig();

  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // --- LOGO COMPONENT ---
  const LogoIcon = ({ size = "w-8 h-8" }: { size?: string }) => {
      if (config.logoUrl) {
          return <img src={config.logoUrl} alt="Logo" className={`${size} object-contain rounded-lg`} />;
      }
      return (
        <div className={`${size} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold`}>
            M
        </div>
      );
  }

  // --- SOCIAL MEDIA HELPER ---
  const socialLinks = [
      { name: 'Instagram', url: config.instagram, icon: Icons.Instagram },
      { name: 'LinkedIn', url: config.linkedin, icon: Icons.Linkedin },
      { name: 'Facebook', url: config.facebook, icon: Icons.Facebook },
      { name: 'YouTube', url: config.youtube, icon: Icons.Youtube },
      { name: 'TikTok', url: config.tiktok, icon: Icons.TikTok },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <LogoIcon />
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                  Mazmo<span className="text-blue-500">Dev</span>
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`${location.pathname === '/' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'} transition-colors`}>Home</Link>
              <Link to="/services" className={`${isActive('/services') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'} transition-colors`}>Layanan</Link>
              <Link to="/portfolio" className={`${isActive('/portfolio') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'} transition-colors`}>Portfolio</Link>
              <Link to="/blog" className={`${isActive('/blog') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'} transition-colors`}>Blog</Link>
              <Link to="/about" className={`${isActive('/about') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'} transition-colors`}>Tentang</Link>
              <Link to="/contact" className={`${isActive('/contact') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'} transition-colors`}>Kontak</Link>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
              </button>
              
              <a href={getWhatsappLink('Halo MazmoDev, saya ingin konsultasi layanan.')} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-transform transform hover:scale-105 shadow-lg shadow-blue-500/30">
                Konsultasi
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300">
                {isDark ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 dark:text-slate-300"
              >
                {isMenuOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link onClick={() => setIsMenuOpen(false)} to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800">Home</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800">Layanan</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/portfolio" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800">Portfolio</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800">Blog</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800">Tentang</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800">Kontak</Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800">Admin</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Floating WhatsApp Button */}
      <a 
         href={getWhatsappLink("Halo, saya mau tanya jasa MazmoDev.")} 
         target="_blank" 
         rel="noopener noreferrer"
         className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-3.5 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center animate-bounce-subtle"
         aria-label="Chat WhatsApp"
      >
          <Icons.Whatsapp size={32} />
      </a>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                 <LogoIcon />
                <span className="font-bold text-xl text-white">MazmoDev</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 mb-4">
                Partner digital terpercaya untuk pertumbuhan bisnis Anda. Website, Iklan, dan Branding kelas dunia.
              </p>
              <p className="text-xs text-slate-500">
                {config.address} <br/>
                {config.email}
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="hover:text-blue-400 transition-colors">Pembuatan Website</Link></li>
                <li><Link to="/services" className="hover:text-blue-400 transition-colors">Google & FB Ads</Link></li>
                <li><Link to="/services" className="hover:text-blue-400 transition-colors">Branding Identity</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/portfolio" className="hover:text-blue-400 transition-colors">Portfolio</Link></li>
                <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog Artikel</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Kontak</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Social Media</h3>
              <ul className="space-y-3">
                  {socialLinks.length > 0 ? socialLinks.map((social) => (
                      <li key={social.name}>
                          <a 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                          >
                              <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600 transition-colors">
                                  <social.icon size={18} />
                              </div>
                              <span className="text-sm font-medium">{social.name}</span>
                          </a>
                      </li>
                  )) : (
                      <li className="text-slate-500 text-sm">Belum ada social media terhubung.</li>
                  )}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MazmoDev Agency. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
