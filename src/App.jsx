import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// SafeIcon Component - converts kebab-case to PascalCase
const SafeIcon = ({ name, size = 24, className, color }) => {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    import('lucide-react').then((icons) => {
      const pascalCase = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      const IconComponent = icons[pascalCase] || icons.HelpCircle;
      setIcon(() => IconComponent);
    });
  }, [name]);

  if (!Icon) return <div style={{ width: size, height: size }} className={className} />;

  return <Icon size={size} className={className} color={color} />;
};

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmit <boltArtifact id="baza-barbershop-prague" title="BAZA Barbershop Prague">
  <boltAction type="file" filePath="package.json">{
  "name": "baza-barbershop",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "maplibre-gl": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.4",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17"
  }
}