import React from 'react';
import { Link } from 'react-router-dom';
import { CartDrawer } from '../shared/CartDrawer';
import { FloatingCartButton } from '../shared/FloatingCartButton';
import { StoreFooter } from './StoreFooter';
import {
  Bitcoin,
  ArrowLeft,
  ChevronRight,
  Store,
  Receipt
} from 'lucide-react';

interface StorePageLayoutProps {
  categoryName: string;
  pageTitle: string;
  children: React.ReactNode;
}

const BTC_PRICE_USD = 65000;

export const StorePageLayout: React.FC<StorePageLayoutProps> = ({
  categoryName,
  pageTitle,
  children
}) => {

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Ticker Bar (Exact match with Landing Page) */}
      <div className="bg-[#04060c] border-b border-white/[0.06] text-[10px] sm:text-[11px] font-mono text-slate-400 py-2 px-3 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">Red Bitcoin: Bloque Verificado</span>
            <span className="xs:hidden">Bitcoin L1</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">1 BTC = ${BTC_PRICE_USD.toLocaleString()} USD</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="hidden md:inline text-slate-400">Smart Contract: NovaSats.sol v2.0</span>
          <Link
            to="/#consultar-voucher"
            className="text-slate-300 hover:text-amber-400 transition flex items-center gap-1"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-500" />
            <span>Consultar Voucher</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar (Minimalist, without Wallet button, clean brand and return link) */}
      <header className="sticky top-0 z-40 bg-[#060911]/90 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Bitcoin className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1 font-heading">
                Nova<span className="text-amber-500">Sats</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-400/90 font-bold uppercase tracking-widest block -mt-1 font-mono">
                Store Marketplace
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#0e1424] hover:bg-[#161f38] border border-white/[0.08] hover:border-amber-500/30 rounded-xl transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Volver a la Tienda</span>
            <span className="sm:hidden text-[11px]">Volver</span>
          </Link>
        </div>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-[#04060c] border-b border-white/[0.06] py-3 px-3.5 sm:px-8 lg:px-12">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-400 font-medium overflow-x-auto whitespace-nowrap lateral-scrollbar">
          <Link to="/" className="hover:text-amber-400 transition flex items-center gap-1 shrink-0">
            <Store className="w-3.5 h-3.5 text-slate-500" />
            <span>Tienda</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-slate-400 shrink-0">{categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-amber-400 font-bold truncate max-w-[200px] sm:max-w-none">{pageTitle}</span>
        </div>
      </div>

      {/* Main Page Content (Full available width with maximum bounds) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        {children}
      </main>

      {/* BOTÓN REUTILIZABLE DEL CARRITO */}
      <FloatingCartButton />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Unified Minimalist Footer */}
      <StoreFooter />

    </div>
  );
};
