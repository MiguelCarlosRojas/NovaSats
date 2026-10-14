import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Product, Order } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { CartDrawer } from '../shared/CartDrawer';
import { VoucherModal } from '../shared/VoucherModal';
import { StoreFooter } from './StoreFooter';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Bitcoin,
  Receipt,
  ChevronRight,
  Package,
  Tag,
  Heart,
  ArrowRight,
  Lock,
  AlertCircle
} from 'lucide-react';

import { fetchAllStoreProducts, BTC_PRICE_USD } from '../../data/productsData';
import { CATEGORY_CATALOG } from '../../data/categories';

export const StoreLanding: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Voucher lookup state
  const [lookupVoucherCode, setLookupVoucherCode] = useState('');
  const [lookupResult, setLookupResult] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);

  const { addToCart, itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchAllStoreProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching real products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const displayedCategories = showAllCategories ? CATEGORY_CATALOG : CATEGORY_CATALOG.slice(0, 12);

  // Productos destacados (primeros 6 u 8)
  const featuredProducts = products.slice(0, 8);

  const handleLookupVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupVoucherCode.trim()) return;

    setIsLookingUp(true);
    setLookupError('');
    try {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .or(`voucher_code.eq.${lookupVoucherCode.trim()},order_number.eq.${lookupVoucherCode.trim()}`)
        .single();

      if (orderErr || !orderData) {
        setLookupError('No se encontró ningún voucher con ese código o número de orden.');
        setIsLookingUp(false);
        return;
      }

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderData.id);

      const fullOrder: Order = {
        ...orderData,
        items: itemsData || [],
      };

      setLookupResult(fullOrder);
      setShowLookupModal(true);
    } catch (err: any) {
      console.error('Error looking up voucher:', err);
      setLookupError('Ocurrió un error al buscar el comprobante.');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* BARRA SUPERIOR TICKER */}
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
          <a
            href="#consultar-voucher"
            className="text-slate-300 hover:text-amber-400 transition flex items-center gap-1"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-500" />
            <span>Consultar Voucher</span>
          </a>
        </div>
      </div>

      {/* ENCABEZADO DE NAVEGACIÓN (Sin botón Portal Proveedores) */}
      <header className="sticky top-0 z-40 bg-[#060911]/90 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
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

        {/* Enlaces de Cabecera (Sin botón de donar) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-md shadow-amber-500/15 transition active:scale-95"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Catálogo Completo</span>
          </Link>
        </div>
      </header>

      {/* HERO SECTION DE NOVA SATS */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-12 border-b border-white/[0.08] bg-[#060911] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-amber-400 text-xs font-mono font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Marketplace Descentralizado On-Chain • Pagos Bitcoin P2P
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading leading-[1.1] break-words">
            El Marketplace Web3 con liquidación directa en{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Bitcoin
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Compra de proveedores verificados sin comisiones bancarias ni retenciones. Conectas tu wallet, pagas en Satoshi o BTC y recibes tu comprobante criptográfico validado por el contrato inteligente <code className="text-amber-400 font-mono text-xs">NovaSats.sol</code> con respaldo a Gmail y PDF.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/catalogo"
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explorar Catálogo Completo</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <a
              href="#consultar-voucher"
              className="px-5 sm:px-6 py-3.5 sm:py-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition flex items-center gap-2"
            >
              <Receipt className="w-4 h-4 text-slate-400" />
              <span>Consultar Voucher</span>
            </a>
          </div>

          {/* 3 Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 text-left">
            <div className="p-5 rounded-2xl bg-[#0a0f1e]/80 border border-white/[0.06] hover:border-amber-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <Bitcoin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">01 • Pagos Directos P2P</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sin intermediarios bancarios. El valor viaja de tu billetera al proveedor con confirmación en la red.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0f1e]/80 border border-white/[0.06] hover:border-amber-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">02 • Smart Contract NovaSats</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Firma criptográfica inmutable en contrato inteligente por cada orden registrada en el marketplace.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0f1e]/80 border border-white/[0.06] hover:border-amber-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">03 • Voucher & Entrega</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generación automática de voucher con QR, envío a tu Gmail y 4 modalidades de entrega en todo el Perú.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS DESTACADAS */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              Explora por Intereses
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
              Categorías en NovaSats
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
          >
            <span>Ver todas las categorías en el Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {displayedCategories.map((cat) => {
            return (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${encodeURIComponent(cat.name)}`}
                className="group p-4 rounded-2xl bg-[#0e1424]/70 border border-white/[0.06] hover:border-amber-500/40 hover:bg-[#141d34] transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-black text-amber-400 flex items-center justify-center mb-3 transition">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="mt-2 text-[10px] text-amber-400/80 font-mono">
                    {cat.subcategories.length} sub-catálogos
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 group-hover:text-amber-400 font-mono">
                  <span>Explorar</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-slate-200 transition"
          >
            <span>{showAllCategories ? 'Mostrar menos catálogos' : 'Ver todos los 21 catálogos completos'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllCategories ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        </div>
      </section>

      {/* SECCIÓN PREVIEW DE PRODUCTOS DESTACADOS */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 bg-[#04060c] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                Vitrina Destacada
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
                Novedades & Más Vendidos
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold text-amber-400 transition"
            >
              <span>Ver Catálogo Completo ({products.length} productos)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-[#0b101f] border border-white/[0.06] hover:border-amber-500/40 transition flex flex-col overflow-hidden"
                >
                  <Link to={`/producto/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-900">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {product.discount_percent && product.discount_percent > 0 ? (
                      <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shadow-md">
                        -{product.discount_percent}%
                      </span>
                    ) : null}
                    <span className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                      {product.category || 'General'}
                    </span>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <Link to={`/producto/${product.id}`} className="block">
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                          {product.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                      <div>
                        <div className="text-base font-black text-white">
                          ${Number(product.price_usd).toFixed(2)} USD
                        </div>
                        <div className="text-[11px] font-mono text-amber-400 font-bold">
                          {Number(product.price_btc).toFixed(8)} ₿
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 transition active:scale-95"
                        title="Agregar al Carrito"
                      >
                        <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Banner central de llamada al Catálogo completo */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/20 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
              ¿Buscando productos específicos, filtros avanzados o marcas?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Accede a nuestro catálogo completo con filtros por precio, stock, envío express, calificación de proveedores y ordenamiento personalizado.
            </p>
            <div className="pt-2">
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95"
              >
                <span>Ir a la Página Completa del Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SESIÓN DE DONACIONES (Lleva a la página dedicada completa /donaciones) */}
      {/* =================================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 border border-white/[0.08] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              <span>Comunidad & Desarrollo Abierto</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight">
              Apoya a NovaSats con una Donación
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Tus donaciones permiten mantener nuestra infraestructura descentralizada, servidores de alta disponibilidad y el desarrollo continuo de contratos inteligentes en Bitcoin. Contamos con donaciones por PayPal y Yape con código QR.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              to="/donaciones"
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2.5 active:scale-95"
            >
              <Heart className="w-4 h-4 fill-black" />
              <span>Ir a la Página de Donaciones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN CONSULTAR VOUCHER */}
      <section id="consultar-voucher" className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 bg-[#04060c] border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Receipt className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              Verificación Criptográfica
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-1">
              Consulta el Estado de tu Voucher
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2">
              Ingresa el código único de comprobante o el número de orden generado al momento de tu pago para recuperar tu voucher y comprobante en PDF.
            </p>
          </div>

          <form onSubmit={handleLookupVoucher} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="text"
              required
              value={lookupVoucherCode}
              onChange={(e) => setLookupVoucherCode(e.target.value)}
              placeholder="Ej: VOUCH-XXXXX o ORD-123456"
              className="flex-1 px-4 py-3 bg-[#0d1222] border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <button
              type="submit"
              disabled={isLookingUp}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md disabled:opacity-50"
            >
              {isLookingUp ? 'Buscando...' : 'Consultar'}
            </button>
          </form>

          {lookupError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 rounded-xl text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <StoreFooter />

      {/* BOTÓN FLOTANTE DEL CARRITO */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center shadow-2xl shadow-amber-500/35 border border-amber-300/40 hover:scale-110 active:scale-95 transition-all duration-300 group"
        title="Ver bolsa de compras"
        aria-label="Ver bolsa de compras"
      >
        <ShoppingBag className="w-6 h-6 text-black stroke-[2.2] group-hover:rotate-6 transition-transform" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1.5 bg-black text-amber-400 font-black text-xs font-mono rounded-full border-2 border-amber-400 flex items-center justify-center shadow-lg animate-bounce">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Voucher Modal */}
      {showLookupModal && lookupResult && (
        <VoucherModal
          order={lookupResult}
          isOpen={showLookupModal}
          onClose={() => setShowLookupModal(false)}
        />
      )}

    </div>
  );
};
