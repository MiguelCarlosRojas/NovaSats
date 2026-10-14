import React from 'react';
import { Link } from 'react-router-dom';
import { Bitcoin, Heart } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#04060c] pt-14 pb-8 px-4 sm:px-8 lg:px-12 text-slate-400 text-xs mt-auto w-full">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
        
        {/* Columna Marca e Identidad */}
        <div className="space-y-3.5">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Bitcoin className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-white font-heading">
              Nova<span className="text-amber-500">Sats</span>
            </span>
          </Link>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Plataforma de comercio electrónico descentralizado respaldada en la red Bitcoin con firmas de contrato inteligente <code className="text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded font-mono">NovaSats.sol</code>.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-mono font-bold tracking-wide">
              100% Non-Custodial P2P
            </span>
            <Link
              to="/donaciones"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-bold hover:bg-rose-500/20 transition"
            >
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>Donaciones</span>
            </Link>
          </div>
        </div>

        {/* Columna 1: Nosotros */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Nosotros
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link to="/trabaja-con-nosotros" className="hover:text-amber-400 transition block">
                Trabaja con nosotros
              </Link>
            </li>
            <li>
              <Link to="/sobre-nosotros" className="hover:text-amber-400 transition block">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link to="/nuestro-proposito" className="hover:text-amber-400 transition block">
                Nuestro propósito
              </Link>
            </li>
            <li>
              <Link to="/promociones" className="hover:text-amber-400 transition block">
                Promociones
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 2: Servicio al cliente & Ayuda */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Servicio al cliente & Ayuda
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link to="/ayuda" className="hover:text-amber-400 transition block">
                Ayuda
              </Link>
            </li>
            <li>
              <Link to="/servicio-al-cliente" className="hover:text-amber-400 transition block">
                Servicio al cliente
              </Link>
            </li>
            <li>
              <Link to="/reclamos" className="hover:text-amber-400 transition block">
                Reclamos
              </Link>
            </li>
            <li>
              <Link to="/libro-de-reclamaciones" className="hover:text-amber-400 transition font-bold text-amber-400/90 block">
                Libro de reclamaciones
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Legales y Políticas */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Legales y Políticas
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link to="/terminos-y-condiciones" className="hover:text-amber-400 transition block">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link to="/como-cuidamos-tu-privacidad" className="hover:text-amber-400 transition block">
                Cómo cuidamos tu privacidad
              </Link>
            </li>
            <li>
              <Link to="/accesibilidad" className="hover:text-amber-400 transition block">
                Accesibilidad
              </Link>
            </li>
            <li>
              <Link to="/politica-cookies" className="hover:text-amber-400 transition block">
                Política de cookies
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Barra Inferior Copyright & Cripto */}
      <div className="w-full max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <p>© Todos los derechos reservados • NovaSats Technologies S.A.C.</p>
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px]">
          <span>Bitcoin Network Verified</span>
          <span>•</span>
          <span>NovaSats.sol • On-Chain</span>
        </div>
      </div>
    </footer>
  );
};
