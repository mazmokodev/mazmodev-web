import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  schema?: object; // Allow passing specific schema
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords = [], 
  image = '/vite.svg', 
  type = 'website',
  schema
}) => {
  const location = useLocation();
  const { config } = useConfig();
  const fullUrl = `${window.location.origin}${location.pathname}`;
  const siteName = "MazmoDev Agency";

  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | ${siteName}`;

    // 2. Helper to update/create meta tags
    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Standard SEO
    updateMeta('description', description);
    if (keywords.length > 0) {
      updateMeta('keywords', keywords.join(', '));
    }
    // Performance hint
    updateMeta('viewport', 'width=device-width, initial-scale=1');

    // 4. Open Graph (Facebook/LinkedIn/WhatsApp)
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', fullUrl, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', siteName, 'property');
    updateMeta('og:locale', 'id_ID', 'property');

    // 5. Twitter Card
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', title, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:image', image, 'name');

    // 6. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // 7. JSON-LD Schema (Structured Data) - SUPER SEO
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
    }

    // Default Organization Schema
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": siteName,
        "url": window.location.origin,
        "logo": `${window.location.origin}/vite.svg`,
        "telephone": config.whatsappNumber,
        "email": config.email,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": config.address,
            "addressCountry": "ID"
        },
        "priceRange": "$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
            }
        ]
    };

    // Use specific schema if provided (e.g., BlogPosting), otherwise base schema
    const finalSchema = schema ? { ...baseSchema, ...schema } : baseSchema;
    script.textContent = JSON.stringify(finalSchema);

  }, [title, description, keywords, image, type, fullUrl, config, schema]);

  return null;
};