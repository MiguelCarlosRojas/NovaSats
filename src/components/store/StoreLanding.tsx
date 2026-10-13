import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Product, Order } from '../../types/store';
import { useCart } from '../../context/CartContext';
import { CartDrawer } from '../shared/CartDrawer';
import { VoucherModal } from '../shared/VoucherModal';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Bitcoin,
  Receipt,
  ChevronRight,
  Package,
  Zap,
  Tag,
  Star,
  Heart,
  QrCode,
  ExternalLink,
  DollarSign,
  ArrowRight,
  Sparkles,
  Layers,
  Lock,
  AlertCircle
} from 'lucide-react';

import { fetchAllStoreProducts, BTC_PRICE_USD } from '../../data/productsData';

export const StoreLanding: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Voucher lookup state
  const [lookupVoucherCode, setLookupVoucherCode] = useState('');
  const [lookupResult, setLookupResult] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);

  // QR Modal para Yape
  const [showYapeModal, setShowYapeModal] = useState(false);

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

  // Categorías con conteo
  const categoryList = [
    { name: 'Tecnología', icon: Zap, desc: 'Hardware, minería y gadgets cripto' },
    { name: 'Moda', icon: Sparkles, desc: 'Indumentaria y estilo cypherpunk' },
    { name: 'Hogar', icon: Layers, desc: 'Equipamiento y accesorios para el hogar' },
    { name: 'Accesorios', icon: Tag, desc: 'Wallets físicas, cables y periféricos' },
    { name: 'Libros', icon: Package, desc: 'Economía austriaca, Bitcoin y programación' },
    { name: 'Calzado', icon: Star, desc: 'Zapatillas y calzado de calidad' },
  ];

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

        {/* Enlaces de Cabecera */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl shadow-md shadow-amber-500/15 transition active:scale-95"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Catálogo Completo</span>
          </Link>

          <a
            href="#donaciones"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition"
          >
            <Heart className="w-3.5 h-3.5 fill-amber-400" />
            <span className="hidden xs:inline">Donaciones</span>
          </a>
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
              href="#donaciones"
              className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#0e1424] hover:bg-[#161f38] border border-white/[0.08] hover:border-amber-500/40 text-slate-200 text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Apoyar con Donación</span>
            </a>

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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoryList.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/catalogo?categoria=${encodeURIComponent(cat.name)}`}
                className="group p-4 rounded-2xl bg-[#0e1424]/70 border border-white/[0.06] hover:border-amber-500/40 hover:bg-[#141d34] transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-black text-amber-400 flex items-center justify-center mb-3 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 group-hover:text-amber-400 font-mono">
                  <span>Ver items</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
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
      {/* SECCIÓN DE DONACIONES (PayPal & Yape QR)                             */}
      {/* =================================================================== */}
      <section id="donaciones" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>Comunidad & Desarrollo Libre</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-heading">
            Apoya a NovaSats con una Donación
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Tu apoyo permite mantener los servidores, la infraestructura de nodos Bitcoin, el desarrollo de contratos inteligentes y nuevas herramientas de código abierto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Tarjeta 1: Donaciones por PayPal */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b101f] border border-white/[0.08] hover:border-blue-500/40 transition flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block mb-1">
                  Donación Internacional
                </span>
                <h3 className="text-xl font-bold text-white">
                  PayPal Me
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Puedes enviar cualquier monto de donación de forma segura usando tu tarjeta de crédito, débito o saldo en cuenta PayPal.
                </p>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Destinatario:</span>
                <span className="font-bold text-blue-400">@miguelcarlosrojas</span>
              </div>
            </div>

            <div>
              <a
                href="https://paypal.me/miguelcarlosrojas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
              >
                <span>Donar con PayPal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                Enlace oficial seguro: paypal.me/miguelcarlosrojas
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Donaciones por Yape (QR) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b101f] border border-white/[0.08] hover:border-purple-500/40 transition flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1">
                  Donación Móvil Perú
                </span>
                <h3 className="text-xl font-bold text-white">
                  Yape con Código QR
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Escanea el código QR de Yape desde tu celular para transferir al instante desde cualquier cuenta en Perú.
                </p>
              </div>

              {/* Vista previa del QR de Yape */}
              <div className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                <div
                  onClick={() => setShowYapeModal(true)}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-white p-1 rounded-xl cursor-pointer hover:scale-105 transition shrink-0 shadow-md"
                  title="Click para ampliar QR"
                >
                  <img
                    src="/yape-qr.png"
                    alt="Código QR de Yape"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-white">Yape a Miguel Carlos</p>
                  <p className="text-slate-400 text-[11px]">Válido para Yape y billeteras interoperables (Plin, bancos).</p>
                  <button
                    type="button"
                    onClick={() => setShowYapeModal(true)}
                    className="text-purple-400 hover:text-purple-300 font-bold text-[11px] underline flex items-center gap-1 pt-1"
                  >
                    <span>Ver QR en pantalla completa</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowYapeModal(true)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Mostrar Código QR de Yape</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                Escaneo inmediato desde la App de Yape
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* MODAL PARA VER EL QR DE YAPE EN GRANDE */}
      {showYapeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative bg-[#0d1222] border border-white/[0.1] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl">
            <button
              onClick={() => setShowYapeModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold">
              <QrCode className="w-3.5 h-3.5" />
              <span>Yape Oficial</span>
            </div>

            <h3 className="text-lg font-bold text-white">
              Escanea para Donar por Yape
            </h3>

            {/* Imagen grande del QR */}
            <div className="bg-white p-4 rounded-2xl shadow-xl mx-auto w-64 h-64 flex items-center justify-center">
              <img
                src="/yape-qr.png"
                alt="QR Yape Grande"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            <p className="text-xs text-slate-300">
              Abre tu app <strong>Yape</strong>, selecciona "Escanear QR" y enfoca tu cámara sobre esta pantalla.
            </p>

            <button
              type="button"
              onClick={() => setShowYapeModal(false)}
              className="w-full py-2.5 bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-bold rounded-xl transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

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
      <footer className="mt-auto bg-[#030508] border-t border-white/[0.08] text-slate-400 pt-12 sm:pt-16 pb-8 px-4 sm:px-8 lg:px-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <Bitcoin className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <span className="text-base font-black text-white">Nova<span className="text-amber-500">Sats</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Infraestructura de comercio descentralizado directo en Bitcoin. Pagos seguros y vouchers respaldados por smart contracts.
            </p>
            <div className="pt-1">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                100% Non-Custodial P2P
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Explorar
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/catalogo" className="hover:text-amber-400 transition block">
                  Catálogo de Productos
                </Link>
              </li>
              <li>
                <a href="#donaciones" className="hover:text-amber-400 transition block">
                  Donaciones (PayPal & Yape)
                </a>
              </li>
              <li>
                <a href="#consultar-voucher" className="hover:text-amber-400 transition block">
                  Consultar Voucher
                </a>
              </li>
              <li>
                <Link to="/promociones" className="hover:text-amber-400 transition block">
                  Promociones
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Servicio al Cliente & Ayuda
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/ayuda" className="hover:text-amber-400 transition block">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/servicio-al-cliente" className="hover:text-amber-400 transition block">
                  Servicio al Cliente
                </Link>
              </li>
              <li>
                <Link to="/reclamos" className="hover:text-amber-400 transition block">
                  Reclamos
                </Link>
              </li>
              <li>
                <Link to="/libro-de-reclamaciones" className="hover:text-amber-400 transition font-bold text-amber-400 block">
                  Libro de Reclamaciones
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Legales y Políticas
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/terminos-y-condiciones" className="hover:text-amber-400 transition block">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/como-cuidamos-tu-privacidad" className="hover:text-amber-400 transition block">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to="/accesibilidad" className="hover:text-amber-400 transition block">
                  Accesibilidad
                </Link>
              </li>
              <li>
                <Link to="/politica-cookies" className="hover:text-amber-400 transition block">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© Todos los derechos reservados • NovaSats Technologies S.A.C.</p>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px]">
            <span>Bitcoin Network Verified</span>
            <span>•</span>
            <span>NovaSats.sol • On-Chain</span>
          </div>
        </div>
      </footer>

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
