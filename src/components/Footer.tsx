import React from 'react';
import { Instagram } from 'lucide-react';

export const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-stone-900 text-stone-300 p-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-50 border-t-4 border-indigo-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-bold text-xl text-white tracking-wide flex items-center gap-2">
          <span className="bg-indigo-500 text-white px-2 py-1 rounded-md text-sm">Profe</span>
          la_transformada_de_naomi
        </div>
        <div className="flex gap-4">
          <a href="https://instagram.com/la_transformada_de_naomi" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white hover:bg-pink-600 transition bg-stone-800 px-5 py-2.5 rounded-full font-semibold">
            <Instagram size={20} />
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a href="https://tiktok.com/@la_transformada_de_naomi" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white hover:bg-black transition bg-stone-800 px-5 py-2.5 rounded-full font-semibold border border-stone-700 hover:border-stone-500">
            <TikTokIcon className="w-5 h-5" />
            <span className="hidden sm:inline">TikTok</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
