
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedBlogs, getBlogCategories } from '../services/dataService';
import { BlogPost } from '../types';
import { Icons } from '../components/Icons';

export const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog & Artikel - MazmoDev";
    const fetch = async () => {
        setLoading(true);
        const [allBlogs, allCats] = await Promise.all([
            getPublishedBlogs(),
            getBlogCategories()
        ]);
        setBlogs(allBlogs);
        setCategories(['All', ...allCats]);
        setLoading(false);
    }
    fetch();
  }, []);

  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Mazmo Insight</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Artikel terbaru seputar teknologi, digital marketing, dan strategi bisnis.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedCategory === cat 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
        ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
                <article key={blog.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full group">
                <div className="h-48 bg-gray-200 dark:bg-slate-800 overflow-hidden relative">
                    {blog.imageUrl ? (
                        <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center">
                             <Icons.Megaphone className="text-white/30" size={48} />
                        </div>
                    )}
                    <span className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-blue-600">
                        {blog.category}
                    </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 hover:text-blue-600 transition-colors leading-snug">
                    <Link to={`/${blog.slug}`}>{blog.title}</Link>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {blog.summary}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Icons.Clock size={12}/> {blog.date}</span>
                        <span>{blog.author}</span>
                    </div>
                </div>
                </article>
            ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-slate-500">Belum ada artikel di kategori ini.</p>
            </div>
        )}
      </div>
    </div>
  );
};
