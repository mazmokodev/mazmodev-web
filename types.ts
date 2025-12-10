
export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: PricingFeature[];
  recommended?: boolean;
}

export interface ServiceFeature {
  title: string;
  description: string;
  icon?: string; // Added icon support
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

// Global Portfolio Item
export interface PortfolioItem {
  id: string;
  image: string; // Base64
  title: string;
  category: string;
  serviceId?: string; // Optional link to a service
}

export interface Service {
  id: string;
  title: string;
  slug: string; 
  iconName: 'Code' | 'Megaphone' | 'Palette' | 'Search' | 'Globe';
  
  // NEW: Parent Service ID for Sub-Services hierarchy
  parentServiceId?: string; // If set, this service is a child and hidden from main list

  seoTitle?: string; 
  seoKeywords?: string[]; 
  shortDescription: string; 

  fullDescription: string; 
  
  contentSectionTitle?: string; 
  contentSectionBody?: string; 

  features: ServiceFeature[]; 
  benefits: ServiceBenefit[]; 
  portfolio: PortfolioItem[]; 
  faqs: ServiceFAQ[]; 
  
  plans: PricingPlan[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string; 
  summary: string;
  content: string; 
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
  status: 'published' | 'draft'; 
}

export interface AdminStats {
  views: number;
  inquiries: number;
  conversionRate: number;
}

export interface SiteConfig {
  whatsappNumber: string; 
  email: string;
  address: string;
  logoUrl?: string; 
  
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface AdminCredentials {
    username: string;
    password: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number; 
}

export interface HomeStat {
    id: string;
    label: string;
    value: string;
    icon: string;
    color: string;
}

export interface TrustedBrand {
    id: string;
    name: string; // Alt text
    logoUrl: string; // Base64
}

export interface ProcessStep {
    step: string; // "01", "02"
    title: string;
    description: string;
    icon: string;
}

export interface HomeContent {
    heroTitle: string;
    heroSubtitle: string;
    heroButtonText: string;
    
    // Updated Trusted Brands
    showTrustedBrands: boolean;
    trustedBrands: TrustedBrand[]; 

    // Updated How We Work
    howItWorks: ProcessStep[];
}
