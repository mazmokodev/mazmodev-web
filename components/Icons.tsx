

import React from 'react';
import { 
  Code, 
  Megaphone, 
  Palette, 
  Search, 
  Globe, 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Moon, 
  Sun,
  Menu,
  X as CloseIcon, // Rename Lucide X to CloseIcon to avoid conflict
  ChevronRight,
  ChevronLeft,
  Check,
  BarChart,
  Users,
  DollarSign,
  Wand2,
  Star,
  Trophy,
  Zap,
  Target,
  Briefcase,
  Clock,
  ArrowRight,
  Quote,
  // Editor Icons
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Lock,
  Edit3,
  // Social Media (Keep import but we will use custom for some)
  Instagram,
  Linkedin,
  Youtube,
  Image, // New import
  Eye, // New import
  EyeOff // New import
} from 'lucide-react';

// Custom WhatsApp Icon
const Whatsapp = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 0C5.468 0 0.116 5.379 0.113 11.986c0 2.112.551 4.173 1.6 5.992L0 24l6.353-1.666a11.956 11.956 0 0 0 5.688 1.448h.005c6.574 0 11.924-5.378 11.926-11.987a11.922 11.922 0 0 0-11.932-11.795ZM12.04 21.785h-.004a9.927 9.927 0 0 1-5.07-1.39l-.363-.216-3.77.988 1.006-3.676-.236-.376a9.932 9.932 0 0 1-1.522-5.3c.003-5.489 4.471-9.954 9.965-9.954 2.66 0 5.16 1.037 7.042 2.919a9.902 9.902 0 0 1 2.914 7.045c-.002 5.49-4.47 9.955-9.962 9.955Zm5.46-7.46c-.3-.15-1.772-.875-2.046-.975-.273-.1-.472-.15-.672.15-.2.3-.772.975-.947 1.175-.174.2-.349.225-.649.075-.3-.15-1.265-.466-2.409-1.486-.89-.794-1.492-1.774-1.666-2.074-.175-.3-.019-.462.13-.612.136-.134.3-.35.45-.525.149-.175.199-.3.299-.5.1-.2.05-.375-.025-.525-.075-.15-.672-1.625-.922-2.225-.243-.583-.49-.504-.672-.513-.174-.009-.374-.011-.574-.011-.2 0-.524.075-.798.375-.274.3-1.048 1.025-1.048 2.5s1.073 2.9 1.223 3.1c.15.2 2.112 3.225 5.116 4.522.715.308 1.272.493 1.708.63.717.228 1.37.196 1.886.119.577-.086 1.772-.725 2.022-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35Z" />
  </svg>
);

// Custom Facebook Icon (Standard Round)
const FacebookBrand = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Custom X (Twitter) Icon
const XBrand = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom TikTok Icon (Standard Note Shape)
const TikTokBrand = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const Icons = {
  Code,
  Megaphone,
  Palette,
  Search,
  Globe,
  LayoutDashboard,
  Plus,
  Trash2,
  Moon,
  Sun,
  Menu,
  X: CloseIcon,
  ChevronRight,
  ChevronLeft,
  Check,
  BarChart,
  Users,
  DollarSign,
  Wand2,
  Star,
  Trophy,
  Zap,
  Target,
  Briefcase,
  Clock,
  ArrowRight,
  Quote,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  LinkIcon,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Lock,
  Edit3,
  Whatsapp,
  Instagram,
  Facebook: FacebookBrand,
  Linkedin,
  Youtube,
  Twitter: XBrand,
  TikTok: TikTokBrand,
  Image,
  Eye,
  EyeOff
};

export type IconName = keyof typeof Icons;

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className, size = 24 }) => {
  // @ts-ignore
  const IconComponent = Icons[name as IconName] || Icons.Globe;
  return <IconComponent className={className} size={size} />;
};
