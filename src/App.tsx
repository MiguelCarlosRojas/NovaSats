import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SupplierProvider } from './context/SupplierContext';
import { SupplierDataProvider } from './context/SupplierDataContext';
import { SupplierNotificationsProvider } from './context/SupplierNotificationsContext';
import { WalletProvider } from './context/WalletContext';
import { CartProvider } from './context/CartContext';
import { Web3AppKitProvider } from './context/Web3AppKitProvider';
import { useSupplier } from './context/SupplierContext';
import { StoreLanding } from './components/store/StoreLanding';

// Minimal Suspense Fallback Loader for Slow Network Connections
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#060911] flex flex-col items-center justify-center text-slate-400 gap-3">
    <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    <span className="text-xs font-mono tracking-wider text-slate-500">Cargando NovaSats...</span>
  </div>
);

// Lazy Loaded Store Pages
const CatalogPage = lazy(() => import('./components/store/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const ProductsPage = lazy(() => import('./components/store/ProductsPage').then((m) => ({ default: m.ProductsPage })));
const DonacionesPage = lazy(() => import('./components/store/DonacionesPage').then((m) => ({ default: m.DonacionesPage })));
const ProductDetailPage = lazy(() => import('./components/store/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));

// Lazy Loaded Information Pages
const TrabajaConNosotrosPage = lazy(() => import('./components/store/pages/TrabajaConNosotrosPage').then((m) => ({ default: m.TrabajaConNosotrosPage })));
const SobreNosotrosPage = lazy(() => import('./components/store/pages/SobreNosotrosPage').then((m) => ({ default: m.SobreNosotrosPage })));
const NuestroPropositoPage = lazy(() => import('./components/store/pages/NuestroPropositoPage').then((m) => ({ default: m.NuestroPropositoPage })));
const PromocionesPage = lazy(() => import('./components/store/pages/PromocionesPage').then((m) => ({ default: m.PromocionesPage })));
const AyudaPage = lazy(() => import('./components/store/pages/AyudaPage').then((m) => ({ default: m.AyudaPage })));
const ServicioClientePage = lazy(() => import('./components/store/pages/ServicioClientePage').then((m) => ({ default: m.ServicioClientePage })));
const ReclamosPage = lazy(() => import('./components/store/pages/ReclamosPage').then((m) => ({ default: m.ReclamosPage })));
const LibroReclamacionesPage = lazy(() => import('./components/store/pages/LibroReclamacionesPage').then((m) => ({ default: m.LibroReclamacionesPage })));
const TerminosCondicionesPage = lazy(() => import('./components/store/pages/TerminosCondicionesPage').then((m) => ({ default: m.TerminosCondicionesPage })));
const PrivacidadPage = lazy(() => import('./components/store/pages/PrivacidadPage').then((m) => ({ default: m.PrivacidadPage })));
const AccesibilidadPage = lazy(() => import('./components/store/pages/AccesibilidadPage').then((m) => ({ default: m.AccesibilidadPage })));
const LegalesCampanasPage = lazy(() => import('./components/store/pages/LegalesCampanasPage').then((m) => ({ default: m.LegalesCampanasPage })));
const PoliticasGeneralesPage = lazy(() => import('./components/store/pages/PoliticasGeneralesPage').then((m) => ({ default: m.PoliticasGeneralesPage })));
const PoliticaCookiesPage = lazy(() => import('./components/store/pages/PoliticaCookiesPage').then((m) => ({ default: m.PoliticaCookiesPage })));
const ProteccionDatosPage = lazy(() => import('./components/store/pages/ProteccionDatosPage').then((m) => ({ default: m.ProteccionDatosPage })));

// Lazy Loaded Supplier Portal Components
const SupplierLogin = lazy(() => import('./components/supplier/SupplierLogin').then((m) => ({ default: m.SupplierLogin })));
const SupplierLogout = lazy(() => import('./components/supplier/SupplierLogout').then((m) => ({ default: m.SupplierLogout })));
const SupplierProtectedRoute = lazy(() => import('./components/supplier/SupplierProtectedRoute').then((m) => ({ default: m.SupplierProtectedRoute })));
const SupplierDashboard = lazy(() => import('./components/supplier/SupplierDashboard').then((m) => ({ default: m.SupplierDashboard })));
const SupplierProducts = lazy(() => import('./components/supplier/SupplierProducts').then((m) => ({ default: m.SupplierProducts })));
const SupplierQuestions = lazy(() => import('./components/supplier/SupplierQuestions').then((m) => ({ default: m.SupplierQuestions })));
const SupplierReviews = lazy(() => import('./components/supplier/SupplierReviews').then((m) => ({ default: m.SupplierReviews })));
const SupplierOrders = lazy(() => import('./components/supplier/SupplierOrders').then((m) => ({ default: m.SupplierOrders })));
const SupplierProfile = lazy(() => import('./components/supplier/SupplierProfile').then((m) => ({ default: m.SupplierProfile })));
const SupplierSalesReport = lazy(() => import('./components/supplier/reports/SupplierSalesReport').then((m) => ({ default: m.SupplierSalesReport })));
const SupplierInventoryReport = lazy(() => import('./components/supplier/reports/SupplierInventoryReport').then((m) => ({ default: m.SupplierInventoryReport })));
const SupplierCustomersReport = lazy(() => import('./components/supplier/reports/SupplierCustomersReport').then((m) => ({ default: m.SupplierCustomersReport })));
const SupplierAccountDeletedPage = lazy(() => import('./components/supplier/SupplierAccountDeletedPage').then((m) => ({ default: m.SupplierAccountDeletedPage })));

// Dynamic Route Title Updater Component
const RouteTitleUpdater: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    const titleMap: Record<string, string> = {
      '/': 'NovaSats | Marketplace Web3 & Pagos Bitcoin',
      '/catalogo': 'Catálogo & Categorías | NovaSats',
      '/productos': 'Productos & Filtros | NovaSats Store',
      '/donaciones': 'Donaciones & Apoyo Comunitario | NovaSats',
      '/trabaja-con-nosotros': 'Trabaja con Nosotros | NovaSats Marketplace',
      '/nosotros': 'Sobre Nosotros | NovaSats Ecosistema',
      '/sobre-nosotros': 'Sobre Nosotros | NovaSats Ecosistema',
      '/nuestro-proposito': 'Nuestro Propósito | NovaSats',
      '/promociones': 'Promociones & Ofertas | NovaSats',
      '/ayuda': 'Centro de Ayuda | NovaSats',
      '/servicio-al-cliente': 'Servicio al Cliente | NovaSats',
      '/reclamos': 'Libro de Reclamaciones | NovaSats',
      '/libro-de-reclamaciones': 'Libro de Reclamaciones | NovaSats',
      '/terminos-y-condiciones': 'Términos y Condiciones | NovaSats',
      '/como-cuidamos-tu-privacidad': 'Aviso de Privacidad | NovaSats',
      '/privacidad': 'Política de Privacidad | NovaSats',
      '/accesibilidad': 'Declaración de Accesibilidad | NovaSats',
      '/legales-campanas': 'Legales de Campañas | NovaSats',
      '/politicas-generales': 'Políticas Generales | NovaSats',
      '/politica-cookies': 'Política de Cookies | NovaSats',
      '/proteccion-de-datos': 'Protección de Datos | NovaSats',
      '/proveedores/login': 'Iniciar Sesión | Portal Proveedores',
      '/login': 'Iniciar Sesión | Portal Proveedores',
      '/proveedores/logout': 'Sesión Finalizada | NovaSats',
      '/proveedores/sesion-cerrada': 'Sesión Finalizada | NovaSats',
      '/proveedores/cuenta-eliminada': 'Cuenta Eliminada con Éxito | NovaSats',
      '/proveedores': 'Panel Principal | Portal Proveedores',
      '/proveedores/dashboard': 'Panel de Control | Portal Proveedores',
      '/proveedores/productos': 'Mis Productos & Inventario | Portal Proveedores',
      '/proveedores/preguntas': 'Preguntas de Clientes | Portal Proveedores',
      '/proveedores/calificaciones': 'Calificaciones & Reseñas | Portal Proveedores',
      '/proveedores/ventas': 'Ventas & Vouchers | Portal Proveedores',
      '/proveedores/perfil': 'Mi Perfil & Configuración | Portal Proveedores',
      '/proveedores/reportes/ventas': 'Reporte de Ventas | Portal Proveedores',
      '/proveedores/reportes/inventario': 'Reporte de Inventario | Portal Proveedores',
      '/proveedores/reportes/clientes': 'Reporte de Clientes | Portal Proveedores',
    };

    if (titleMap[path]) {
      document.title = titleMap[path];
    } else if (path.startsWith('/producto/')) {
      if (!document.title.includes(' | NovaSats Marketplace')) {
        document.title = 'Detalle de Producto | NovaSats';
      }
    } else if (path.startsWith('/proveedores/')) {
      document.title = 'Portal Proveedores | NovaSats';
    } else {
      document.title = 'NovaSats | Marketplace Web3 & Pagos Bitcoin';
    }
  }, [location]);

  return null;
};

// Guest-only Route (Redirects authenticated suppliers away from login to dashboard)
const SupplierGuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supplier } = useSupplier();
  if (supplier) {
    return <Navigate to="/proveedores/dashboard" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Web3AppKitProvider>
      <SupplierProvider>
        <SupplierDataProvider>
          <SupplierNotificationsProvider>
            <WalletProvider>
              <CartProvider>
                <Router>
                  <RouteTitleUpdater />
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Routes>
                      {/* Store Landing Page (Default Home - Immediate Eager Load) */}
                      <Route path="/" element={<StoreLanding />} />

                      {/* Dedicated Category & Catalog Tree Explorer Page */}
                      <Route path="/catalogo" element={<CatalogPage />} />

                      {/* Dedicated Full Products & 16-Filter Showcase Page */}
                      <Route path="/productos" element={<ProductsPage />} />

                      {/* Dedicated Donations Page */}
                      <Route path="/donaciones" element={<DonacionesPage />} />

                      {/* Dedicated Product Detail Page with URL */}
                      <Route path="/producto/:id" element={<ProductDetailPage />} />

                      {/* Dedicated Separate Pages: Nosotros */}
                      <Route path="/trabaja-con-nosotros" element={<TrabajaConNosotrosPage />} />
                      <Route path="/nosotros" element={<SobreNosotrosPage />} />
                      <Route path="/sobre-nosotros" element={<SobreNosotrosPage />} />
                      <Route path="/nuestro-proposito" element={<NuestroPropositoPage />} />
                      <Route path="/promociones" element={<PromocionesPage />} />

                      {/* Dedicated Separate Pages: Servicio al cliente & Ayuda */}
                      <Route path="/ayuda" element={<AyudaPage />} />
                      <Route path="/servicio-al-cliente" element={<ServicioClientePage />} />
                      <Route path="/reclamos" element={<ReclamosPage />} />
                      <Route path="/libro-de-reclamaciones" element={<LibroReclamacionesPage />} />

                      {/* Dedicated Separate Pages: Legales y Políticas */}
                      <Route path="/terminos-y-condiciones" element={<TerminosCondicionesPage />} />
                      <Route path="/como-cuidamos-tu-privacidad" element={<PrivacidadPage />} />
                      <Route path="/privacidad" element={<PrivacidadPage />} />
                      <Route path="/accesibilidad" element={<AccesibilidadPage />} />
                      <Route path="/legales-campanas" element={<LegalesCampanasPage />} />
                      <Route path="/politicas-generales" element={<PoliticasGeneralesPage />} />
                      <Route path="/politica-cookies" element={<PoliticaCookiesPage />} />
                      <Route path="/proteccion-de-datos" element={<ProteccionDatosPage />} />

                      {/* Supplier Auth & Logout */}
                      <Route
                        path="/proveedores/login"
                        element={
                          <SupplierGuestRoute>
                            <SupplierLogin />
                          </SupplierGuestRoute>
                        }
                      />
                      <Route path="/login" element={<Navigate to="/proveedores/login" replace />} />
                      <Route path="/logout" element={<Navigate to="/proveedores/logout" replace />} />
                      <Route path="/proveedores/logout" element={<SupplierLogout />} />
                      <Route path="/proveedores/sesion-cerrada" element={<SupplierLogout />} />
                      <Route path="/proveedores/cuenta-eliminada" element={<SupplierAccountDeletedPage />} />

                      {/* Supplier Portal Protected Routes */}
                      <Route
                        path="/proveedores"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierDashboard />
                          </SupplierProtectedRoute>
                        }
                      />
                      <Route
                        path="/proveedores/dashboard"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierDashboard />
                          </SupplierProtectedRoute>
                        }
                      />
                      <Route
                        path="/proveedores/productos"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierProducts />
                          </SupplierProtectedRoute>
                        }
                      />
                      <Route
                        path="/proveedores/productos/nuevo"
                        element={<Navigate to="/proveedores/productos" replace />}
                      />
                      <Route
                        path="/proveedores/productos/editar/:id"
                        element={<Navigate to="/proveedores/productos" replace />}
                      />
                      <Route
                        path="/proveedores/ventas"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierOrders />
                          </SupplierProtectedRoute>
                        }
                      />
                      <Route
                        path="/proveedores/preguntas"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierQuestions />
                          </SupplierProtectedRoute>
                        }
                      />
                      <Route
                        path="/proveedores/calificaciones"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierReviews />
                          </SupplierProtectedRoute>
                        }
                      />
                      <Route
                        path="/proveedores/perfil"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierProfile />
                          </SupplierProtectedRoute>
                        }
                      />

                      {/* Supplier Reports in Separate Pages */}
                      <Route
                        path="/proveedores/reportes/ventas"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierSalesReport />
                          </SupplierProtectedRoute>
                        }
                      />
                      <Route
                        path="/proveedores/reportes/inventario"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierInventoryReport />
                          </SupplierProtectedRoute>
                        }
                      />
                      <Route
                        path="/proveedores/reportes/clientes"
                        element={
                          <SupplierProtectedRoute>
                            <SupplierCustomersReport />
                          </SupplierProtectedRoute>
                        }
                      />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </Router>
              </CartProvider>
            </WalletProvider>
          </SupplierNotificationsProvider>
        </SupplierDataProvider>
      </SupplierProvider>
    </Web3AppKitProvider>
  );
};

export default App;
