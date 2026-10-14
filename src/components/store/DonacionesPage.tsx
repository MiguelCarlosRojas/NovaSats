import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bitcoin,
  DollarSign,
  QrCode,
  ExternalLink,
  ChevronRight,
  Home,
  Tag,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Zap,
  Server,
  Code2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartDrawer } from '../shared/CartDrawer';
import { StoreFooter } from './StoreFooter';

export const DonacionesPage: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const [showYapeModal, setShowYapeModal] = useState(false);
  const [copiedPaypal, setCopiedPaypal] = useState(false);

  const handleCopyPaypal = () => {
    navigator.clipboard.writeText('https://paypal.me/miguelcarlosrojas');
    setCopiedPaypal(true);
    setTimeout(() => setCopiedPaypal(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* NAVBAR LIMPIO (Sin botón de donar en el header) */}
      <header className="sticky top-0 z-40 bg-[#060911]/90 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <Bitcoin className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1 font-heading">
              Nova<span className="text-amber-500">Sats</span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-amber-400/90 font-bold uppercase tracking-widest block -mt-1 font-mono">
              Marketplace Web3
            </span>
          </div>
        </Link>

        {/* Acciones principales: Catálogo, Inicio, Carrito (Sin botón de donar) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Inicio</span>
          </Link>

          <Link
            to="/catalogo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
          >
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Catálogo</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:from-amber-400 hover:to-orange-400 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Carrito ({itemCount})</span>
          </button>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="bg-[#04060c] border-b border-white/[0.06] py-3.5 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-amber-400 transition flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Inicio</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-amber-400 font-bold">Donaciones y Apoyo Comunitario</span>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL DE LA PÁGINA DE DONACIONES */}
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto w-full space-y-12">
        
        {/* Encabezado Principal */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>Comunidad & Desarrollo Abierto</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
            Apoya el Ecosistema NovaSats
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            NovaSats es una plataforma descentralizada diseñada para impulsar el comercio libre mediante pagos peer-to-peer en Bitcoin y contratos inteligentes. Tus donaciones voluntarias financian la infraestructura técnica, el mantenimiento de nodos y las continuas auditorías de seguridad.
          </p>
        </div>

        {/* 3 Pilares del Destino de Fondos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#090e1c] border border-white/[0.06] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Nodos e Infraestructura</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mantenimiento de servidores de alta disponibilidad y nodos completos para verificación inmutable de transacciones Bitcoin.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090e1c] border border-white/[0.06] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Código Abierto & Smart Contracts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Desarrollo de firmas criptográficas para vouchers digitales inmutables en <code className="text-amber-400 font-mono text-[11px]">NovaSats.sol</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090e1c] border border-white/[0.06] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Seguridad & Privacidad</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Preservación de un modelo 100% no custodial, donde los usuarios mantienen control total de sus llaves privadas y fondos.
            </p>
          </div>
        </div>

        {/* MÉTODOS DE DONACIÓN: PAYPAL Y YAPE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
          
          {/* Tarjeta 1: Donación por PayPal */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090e1c] border border-white/[0.08] hover:border-blue-500/40 transition flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <DollarSign className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block mb-1">
                  Donaciones Internacionales
                </span>
                <h2 className="text-xl font-bold text-white">
                  PayPal Me
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Puedes donar cualquier importe de manera rápida y segura utilizando tu cuenta PayPal o cualquier tarjeta de débito/crédito internacional.
                </p>
              </div>

              <div className="p-3.5 bg-black/40 border border-white/[0.06] rounded-xl space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Usuario:</span>
                  <span className="text-blue-400 font-bold">@miguelcarlosrojas</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Enlace:</span>
                  <span className="text-slate-300 truncate max-w-[180px]">paypal.me/miguelcarlosrojas</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="https://paypal.me/miguelcarlosrojas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Donar con PayPal</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyPaypal}
                className="w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] font-semibold rounded-xl transition"
              >
                {copiedPaypal ? '¡Enlace copiado al portapapeles! ✓' : 'Copiar enlace de PayPal'}
              </button>
            </div>
          </div>

          {/* Tarjeta 2: Donación por Yape (Perú) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090e1c] border border-white/[0.08] hover:border-purple-500/40 transition flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <QrCode className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1">
                  Donaciones Locales (Perú)
                </span>
                <h2 className="text-xl font-bold text-white">
                  Yape con Código QR
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Realiza transferencias instantáneas desde la aplicación de Yape en tu teléfono celular o billeteras interoperables (Plin, Interbank, BBVA, etc.).
                </p>
              </div>

              {/* Contenedor del QR de Yape */}
              <div className="flex items-center gap-4 p-3.5 bg-black/40 border border-white/[0.06] rounded-2xl">
                <div
                  onClick={() => setShowYapeModal(true)}
                  className="w-24 h-24 bg-white p-1 rounded-xl cursor-pointer hover:scale-105 transition shrink-0 shadow-md"
                  title="Click para ver QR en grande"
                >
                  <img
                    src="/yape-qr.png"
                    alt="Código QR Yape"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-bold text-white">Titular: Miguel Carlos</p>
                  <p className="text-slate-400 text-[11px]">Escaneo directo sin cobro de comisiones bancarias.</p>
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

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowYapeModal(true)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <QrCode className="w-4 h-4" />
                <span>Abrir QR de Yape</span>
              </button>

              <a
                href="/yape-qr.png"
                download="yape-qr-miguel-carlos.png"
                className="w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[11px] font-semibold rounded-xl transition block text-center"
              >
                Descargar imagen del QR
              </a>
            </div>
          </div>

        </div>

        {/* Sección de Agradecimiento */}
        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 text-center space-y-2">
          <p className="text-sm font-bold text-white flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>¡Gracias por formar parte de la revolución del dinero libre y descentralizado!</span>
          </p>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Cada aporte, sin importar el monto, nos permite continuar construyendo alternativas tecnológicas soberanas para Latinoamérica y el mundo.
          </p>
        </div>

      </main>

      {/* MODAL DEL QR DE YAPE */}
      {showYapeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
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

            <div className="bg-white p-4 rounded-2xl shadow-xl mx-auto w-64 h-64 flex items-center justify-center">
              <img
                src="/yape-qr.png"
                alt="QR Yape Grande"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            <p className="text-xs text-slate-300">
              Abre tu app <strong>Yape</strong>, presiona "Escanear QR" y apunta tu cámara hacia esta pantalla.
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

      {/* FOOTER */}
      <StoreFooter />

      {/* Carrito Drawer */}
      <CartDrawer />

    </div>
  );
};
