import type { Metadata } from 'next';
import './globals.css';
import { Film, FolderKanban, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Shorts Agent — Dashboard Pembuat Konten Viral',
  description: 'Platform AI otomatisasi pembuatan naskah, storyboard, dan SEO metadata untuk video pendek (Shorts/TikTok/Reels).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f9fafb] text-slate-800 min-h-screen font-sans antialiased flex flex-col selection:bg-[#7d2ae8]/10 selection:text-[#7d2ae8]">
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className="w-9 h-9 bg-gradient-to-br from-[#7d2ae8] to-[#ec4899] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#7d2ae8]/10">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-[#7d2ae8] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent flex items-center gap-1.5">
                  AI Shorts Agent <Sparkles className="w-3.5 h-3.5 text-[#a855f7] fill-[#a855f7]/10 animate-pulse" />
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Creator Studio</span>
              </div>
            </a>
            <div className="flex items-center gap-6">
              <a href="/" className="text-sm font-semibold text-slate-500 hover:text-[#7d2ae8] transition-colors flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-slate-400" />
                Beranda
              </a>
              <a href="/projects" className="text-sm font-semibold text-slate-500 hover:text-[#7d2ae8] transition-colors flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4 text-slate-400" />
                Proyek Saya
              </a>
            </div>
          </div>
        </nav>
        <main className="flex-1 w-full">{children}</main>
        <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 shadow-sm">
          <p>© {new Date().getFullYear()} AI Shorts Agent. Crafted for viral content creators.</p>
        </footer>
      </body>
    </html>
  );
}

