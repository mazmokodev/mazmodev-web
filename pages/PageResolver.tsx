
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceBySlug, getBlogBySlug } from '../services/dataService';
import { ServiceDetail } from './ServiceDetail';
import { BlogDetail } from './BlogDetail';
import { SEO } from '../components/SEO';

export const PageResolver: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // 1. Check if it's a Service
  const service = slug ? getServiceBySlug(slug) : undefined;
  if (service) {
    return <ServiceDetail />;
  }

  // 2. Check if it's a Blog
  const blog = slug ? getBlogBySlug(slug) : undefined;
  if (blog) {
    return <BlogDetail />;
  }

  // 3. Not Found
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
