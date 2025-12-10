
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlug, getRelatedBlogs } from '../services/dataService';
import { BlogPost } from '../types';
import { Icons } from '../components/Icons';
import { SEO } from '../components/SEO';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | undefined>();
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadData = async () => {
        if (slug) {
            const found = await getBlogBySlug(slug);
            setBlog(found);
            if (found) {
                const related = await getRelatedBlogs(found.slug, found.category);
                setRelatedBlogs(related);
            }
            window.scrollTo(0, 0);
        }
    };
    loadData();
  }, [slug]);

  if (!blog) return (
    <div className="min-h-screen pt-32 text-center dark:text-white bg-white dark:bg-slate-950">
        <SEO title="Artikel Tidak Ditemukan" description="" />
        <div className="py-20">
            <h2 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h2>
            <Link to="/blog" className="text-blue-600 hover:underline">Kembali ke Blog</Link>
        </div>
    </div>
  );

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20">
      <SEO 
        title={blog.title} 
        description={blog.summary} 
        keywords={blog.tags}
        image={blog.imageUrl}
        type="article"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Icons.ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Icons.ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <span className="text-slate-800 dark:text-slate-300 font-semibold">{blog.category}</span>
        </nav>

        <header className="mb-10 text-center">
            <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-full mb-4">
                {blog.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                {blog.title}
            </h1>
            <div className="flex justify-center items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {blog.author.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{blog.author}</span>
                </div>
                <span>•</span>
                <span>{blog.date}</span>
                <span>•</span>
                <span>{Math.ceil(blog.content.length / 1000)} min read</span>
            </div>
        </header>

        {/* Featured Image */}
        {blog.imageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
            </div>
        )}

        {/* Content Area */}
        <div 
            className="prose prose-lg dark:prose-invert max-w-none mx-auto
            prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-lg
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
        />
        
        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                    <span key={tag} className="text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-md">
                        #{tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Share Section */}
        <div className="mt-8">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Bagikan Artikel Ini</h3>
             <div className="flex gap-3">
                 <button className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                     <Icons.Facebook size={16} /> Facebook
                 </button>
                 <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                     <Icons.Twitter size={16} /> X (Twitter)
                 </button>
                 <button className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                     <Icons.Whatsapp size={16} /> WhatsApp
                 </button>
             </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
          <section className="mt-20 py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Artikel Terkait</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {relatedBlogs.map(rb => (
                          <Link key={rb.id} to={`/${rb.slug}`} className="group block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                               <div className="h-40 bg-gray-200 dark:bg-slate-800 overflow-hidden">
                                   {rb.imageUrl ? (
                                       <img src={rb.imageUrl} alt={rb.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                   ) : (
                                       <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-800"></div>
                                   )}
                               </div>
                               <div className="p-4">
                                   <div className="text-xs text-blue-600 font-bold mb-2 uppercase">{rb.category}</div>
                                   <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">{rb.title}</h4>
                               </div>
                          </Link>
                      ))}
                  </div>
              </div>
          </section>
      )}

    </article>
  );
};
