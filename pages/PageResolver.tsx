
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceBySlug, getBlogBySlug } from '../services/dataService';
import { ServiceDetail } from './ServiceDetail';
import { BlogDetail } from './BlogDetail';
import { SEO } from '../components/SEO';

export const PageResolver: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'service' | 'blog' | '404'>('404');

  useEffect(() => {
    const resolve = async () => {
        if (!slug) return;
        setLoading(true);
        
        // Parallel check (optimization)
        const [service, blog] = await Promise.all([
            getServiceBySlug(slug),
            getBlogBySlug(slug)
        ]);

        if (service) {
            setType('service');
        } else if (blog) {
            setType('blog');
        } else {
            setType('404');
        }
        setLoading(false);
    };

    resolve();
  }, [slug]);

  if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
  }

  if (type === 'service') return <ServiceDetail />;
  if (type === 'blog') return <BlogDetail />;

  // 404
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 flex-col px-4 text-center">
        <SEO title="Halaman Tidak Ditemukan" description="Halaman yang Anda cari tidak tersedia." />
        <h1 className="text-6xl font-bold text-slate-200 dark:text-slate-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
            Halaman "{slug}" yang Anda cari mungkin sudah dihapus atau tidak tersedia.
        </p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Kembali ke Beranda
        </Link>
    </div>
  );
};
