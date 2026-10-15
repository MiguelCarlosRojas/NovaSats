import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWallet } from '../../context/WalletContext';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { apiClient } from '../../lib/apiClient';
import { VoucherModal } from './VoucherModal';
import { Order } from '../../types/store';
import { signPurchaseWithNovaSats, NOVASATS_CONTRACT_ADDRESS } from '../../utils/novaSatsSignature';
import confetti from 'canvas-confetti';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Bitcoin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Wallet,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  Zap,
  Store,
  Navigation,
  ExternalLink,
  Mail,
  Search,
  LocateFixed
} from 'lucide-react';

// Departamentos y provincias de Perú
const PERU_LOCATIONS: Record<string, { provincias: Record<string, string[]> }> = {
  Lima: {
    provincias: {
      'Lima Metropolitana': [
        'Miraflores', 'San Isidro', 'Santiago de Surco', 'San Borja', 'La Molina',
        'Barranco', 'San Miguel', 'Magdalena del Mar', 'Pueblo Libre', 'Jesús María',
        'Lince', 'Surquillo', 'Breña', 'Cercado de Lima', 'Los Olivos', 'San Martín de Porres',
        'Independencia', 'Comas', 'San Juan de Lurigancho', 'Ate', 'Chorrillos', 'Villa El Salvador'
      ],
      'Callao': ['Callao', 'Bellavista', 'La Perla', 'La Punta', 'Carmen de La Legua', 'Ventanilla', 'Mi Perú'],
      'Cañete': ['San Vicente de Cañete', 'Asia', 'Mala', 'Cerro Azul', 'Chilca'],
      'Huaral': ['Huaral', 'Chancay', 'Aucallama'],
      'Huaura': ['Huacho', 'Hualmay', 'Santa María', 'Carquín']
    }
  },
  Arequipa: {
    provincias: {
      'Arequipa': ['Arequipa', 'Cayma', 'Cerro Colorado', 'Yanahuara', 'José Luis Bustamante y Rivero', 'Paucarpata'],
      'Camaná': ['Camaná', 'José María Quimper', 'Mariscal Cáceres'],
      'Islay': ['Mollendo', 'Cocachacra', 'Mejía']
    }
  },
  Cusco: {
    provincias: {
      'Cusco': ['Cusco', 'Santiago', 'Wanchaq', 'San Sebastián', 'San Jerónimo'],
      'Urubamba': ['Urubamba', 'Ollantaytambo', 'Machupicchu', 'Maras'],
      'Calca': ['Calca', 'Pisac', 'Lamay', 'Coya']
    }
  },
  'La Libertad': {
    provincias: {
      'Trujillo': ['Trujillo', 'Víctor Larco Herrera', 'Huanchaco', 'Moche', 'El Porvenir', 'La Esperanza'],
      'Pacasmayo': ['San Pedro de Lloc', 'Pacasmayo', 'Guadalupe']
    }
  },
  Piura: {
    provincias: {
      'Piura': ['Piura', 'Castilla', 'Veintiséis de Octubre', 'Catacaos'],
      'Sullana': ['Sullana', 'Bellavista', 'Marcavelica'],
      'Talara': ['Pariñas', 'El Alto', 'Los Órganos', 'Máncora']
    }
  },
  Lambayeque: {
    provincias: {
      'Chiclayo': ['Chiclayo', 'José Leonardo Ortiz', 'La Victoria', 'Pimentel', 'Reque'],
      'Lambayeque': ['Lambayeque', 'Mórrope', 'Olmos']
    }
  },
  Junín: {
    provincias: {
      'Huancayo': ['Huancayo', 'El Tambo', 'Chilca'],
      'Tarma': ['Tarma', 'Acobamba', 'Palca']
    }
  },
  Ancash: {
    provincias: {
      'Santa': ['Chimbote', 'Nuevo Chimbote', 'Coishco'],
      'Huaraz': ['Huaraz', 'Independencia']
    }
  },
  Ica: {
    provincias: {
      'Ica': ['Ica', 'La Tinguiña', 'Parcona', 'Subtanjalla'],
      'Chincha': ['Chincha Alta', 'Chincha Baja', 'Grocio Prado'],
      'Pisco': ['Pisco', 'Paracas', 'San Andrés']
    }
  },
  Tacna: {
    provincias: {
      'Tacna': ['Tacna', 'Alto de la Alianza', 'Ciudad Nueva', 'Coronel Gregorio Albarracín']
    }
  },
  Puno: {
    provincias: {
      'Puno': ['Puno', 'Acora', 'Chucuito'],
      'San Román': ['Juliaca', 'Caracoto']
    }
  },
  'San Martín': {
    provincias: {
      'San Martín': ['Tarapoto', 'Morales', 'La Banda de Shilcayo'],
      'Moyobamba': ['Moyobamba', 'Soritor']
    }
  },
  Loreto: {
    provincias: {
      'Maynas': ['Iquitos', 'Punchana', 'Belén', 'San Juan Bautista']
    }
  }
};

type DeliveryType = 'retira' | 'express' | 'programada' | 'rango';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalUsd, totalBtc, itemCount, isCartOpen, setIsCartOpen } = useCart();
  const { walletAddress, sendBtcPayment } = useWallet();
  const { open } = useAppKit();
  const { address: appKitAddress } = useAppKitAccount();

  const effectiveWallet = appKitAddress || walletAddress;

  // Pasos: 1 = Carro, 2 = Entrega, 3 = Pago
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Sub-pasos dentro de Paso 2 (Entrega):
  // 1 = Contacto & Comprobante
  // 2 = Agregar Dirección
  // 3 = Elige un tipo de entrega
  const [deliverySubStep, setDeliverySubStep] = useState<1 | 2 | 3>(1);

  // Datos de Entrega
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [direccion, setDireccion] = useState('');
  const [deptoInterior, setDeptoInterior] = useState('');
  const [guardarPrincipal, setGuardarPrincipal] = useState(true);
  const [addressSaved, setAddressSaved] = useState(false);

  // Tipo de entrega seleccionado y campos específicos
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('programada');
  const [pickupStore, setPickupStore] = useState('Sede Principal Miraflores - Av. Larco 1045');
  const [pickupPersonName, setPickupPersonName] = useState('');
  const [pickupPersonDni, setPickupPersonDni] = useState('');
  const [expressInstructions, setExpressInstructions] = useState('');
  const [expressPhone, setExpressPhone] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('Mañana (9:00 AM - 1:00 PM)');

  // GPS y Google Maps
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [mapSearchInput, setMapSearchInput] = useState('');
  const [mapSearching, setMapSearching] = useState(false);
  const [mapSearchMessage, setMapSearchMessage] = useState('');

  // Tasa de cambio Soles / USD
  const PEN_RATE = 3.75;

  const getItemOriginalPen = (item: any) => {
    const origUsd = item.product.original_price_usd && Number(item.product.original_price_usd) > Number(item.product.price_usd)
      ? Number(item.product.original_price_usd)
      : (item.product.discount_percent
        ? Number(item.product.price_usd) / (1 - item.product.discount_percent / 100)
        : Number(item.product.price_usd));
    return origUsd * PEN_RATE * item.quantity;
  };

  const getItemCurrentPen = (item: any) => {
    return Number(item.product.price_usd) * PEN_RATE * item.quantity;
  };

  const totalOriginalPen = cart.reduce((sum, item) => sum + getItemOriginalPen(item), 0);
  const totalCurrentPen = cart.reduce((sum, item) => sum + getItemCurrentPen(item), 0);
  const totalDiscountsPen = Math.max(0, totalOriginalPen - totalCurrentPen);

  const deliveryCostPen = deliveryType === 'retira' ? 0 : (deliveryType === 'express' ? 15.00 : 7.90);
  const deliveryCostUsd = deliveryCostPen / PEN_RATE;
  const deliveryCostBtc = deliveryCostUsd / 65000;

  const grandTotalPen = totalCurrentPen + deliveryCostPen;
  const grandTotalUsd = totalUsd + deliveryCostUsd;
  const grandTotalBtc = totalBtc + deliveryCostBtc;

  const getDeliveryEstimatedDateText = () => {
    if (deliveryType === 'retira') {
      return 'Retira a partir de mañana';
    }
    if (deliveryType === 'express') {
      return 'Llega hoy en 2 a 3 horas';
    }
    if (deliveryType === 'programada') {
      if (scheduledDate) {
        const parts = scheduledDate.split('-');
        if (parts.length === 3) {
          return `Llega el ${parts[2]}/${parts[1]}`;
        }
      }
      return 'Llega el 16/10';
    }
    return 'Llega entre el 16/10 y el 18/10';
  };

  const requestSystemLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('La geolocalización no es compatible con tu navegador actual.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    setGpsSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setGpsLoading(false);
        setGpsSuccess(true);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const road = data.address.road || data.address.pedestrian || data.address.suburb || '';
              const houseNum = data.address.house_number || '';
              const foundAddr = `${road} ${houseNum}`.trim();
              if (foundAddr) {
                setDireccion(foundAddr);
                setMapSearchInput(foundAddr);
              }
              if (data.address.state && !departamento) {
                const matched = Object.keys(PERU_LOCATIONS).find(d =>
                  data.address.state.toLowerCase().includes(d.toLowerCase()) ||
                  d.toLowerCase().includes(data.address.state.toLowerCase())
                );
                if (matched) {
                  setDepartamento(matched);
                }
              }
            }
          }
        } catch {
          // Coordenadas detectadas exitosamente
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) {
          setGpsError('Permiso de ubicación denegado en tu navegador. Puedes ingresar tu dirección manualmente.');
        } else {
          setGpsError('No se pudo determinar tu posición por GPS. Ingresa tu dirección manualmente.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Buscar dirección ingresada en el mapa y sincronizar coordenadas
  const handleMapSearch = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : mapSearchInput || direccion).trim();
    if (!q) return;

    setMapSearching(true);
    setMapSearchMessage('');
    try {
      const searchParam = `${q}, ${distrito ? distrito + ', ' : ''}${departamento ? departamento + ', ' : ''}Peru`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchParam)}&limit=1`
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const first = results[0];
          const newLat = parseFloat(first.lat);
          const newLng = parseFloat(first.lon);
          setCoords({ lat: newLat, lng: newLng });
          setMapSearchMessage('Ubicación localizada en el mapa.');
          if (!direccion) {
            setDireccion(q);
          }
        } else {
          setMapSearchMessage('Mostrando referencia en el mapa.');
        }
      }
    } catch {
      setMapSearchMessage('Buscando referencia en Google Maps...');
    } finally {
      setMapSearching(false);
    }
  };

  // Estado de checkout y pago
  const [processingPayment, setProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCartOpen) return null;

  // Provincias disponibles según departamento seleccionado
  const availableProvincias = departamento && PERU_LOCATIONS[departamento]
    ? Object.keys(PERU_LOCATIONS[departamento].provincias)
    : [];

  // Distritos disponibles según departamento y provincia seleccionados
  const availableDistritos = departamento && provincia && PERU_LOCATIONS[departamento]?.provincias[provincia]
    ? PERU_LOCATIONS[departamento].provincias[provincia]
    : [];

  const handleDeptChange = (dept: string) => {
    setDepartamento(dept);
    setProvincia('');
    setDistrito('');
  };

  const handleProvChange = (prov: string) => {
    setProvincia(prov);
    setDistrito('');
  };

  // Navegación Paso 1 -> Paso 2
  const handleGoToDelivery = () => {
    setErrorMessage('');
    if (cart.length === 0) {
      setErrorMessage('Tu carrito está vacío.');
      return;
    }
    setStep(2);
    setDeliverySubStep(1);
  };

  // Sub-paso 2.1 -> Sub-paso 2.2
  const handleContinueToAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!customerEmail.trim()) {
      setErrorMessage('Por favor ingresa tu correo Gmail para enviarte tu comprobante.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      setErrorMessage('Por favor ingresa un correo Gmail válido.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }
    setDeliverySubStep(2);
  };

  // Sub-paso 2.2 -> Sub-paso 2.3
  const handleContinueToDeliveryType = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!departamento || !provincia || !distrito) {
      setErrorMessage('Por favor selecciona Departamento, Provincia y Distrito.');
      return;
    }
    if (!direccion.trim()) {
      setErrorMessage('Por favor ingresa la calle, número, Mz o Lote de la dirección.');
      return;
    }
    setAddressSaved(true);
    setDeliverySubStep(3);
  };

  // Sub-paso 2.3 -> Paso 3 (Pago)
  const handleGoToPayment = () => {
    setErrorMessage('');
    if (!customerEmail.trim() || !direccion.trim()) {
      setErrorMessage('Por favor completa los datos de entrega antes de continuar.');
      return;
    }
    setStep(3);
  };

  // Proceso final de pago en Paso 3
  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!effectiveWallet) {
      setErrorMessage('Por favor conecta tu billetera con WalletConnect antes de autorizar el pago.');
      return;
    }

    const payerWalletAddress = effectiveWallet;
    const recipientWallet = cart[0]?.product?.suppliers?.wallet_address || '';

    setProcessingPayment(true);

    try {
      // 1. Envío de pago en cripto / verificación
      const payResult = await sendBtcPayment(grandTotalBtc, recipientWallet);
      if (!payResult.success) {
        throw new Error(payResult.error || 'Error al procesar la transferencia en blockchain');
      }

      const txHash = payResult.txHash || '';
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      const voucherCode = `VOUCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      // 2. Firma criptográfica con el contrato inteligente NovaSats.sol
      const signResult = await signPurchaseWithNovaSats(
        payerWalletAddress,
        orderNumber,
        voucherCode,
        grandTotalBtc,
        grandTotalUsd
      );

      let deliveryDetails = '';
      if (deliveryType === 'retira') {
        deliveryDetails = `Retiro en Tienda: ${pickupStore} | Retira: ${pickupPersonName || customerName} (DNI: ${pickupPersonDni || 'N/A'})`;
      } else if (deliveryType === 'express') {
        deliveryDetails = `Envío Express | Cel: ${expressPhone || 'N/A'} | Instrucciones: ${expressInstructions || 'Sin instrucciones adicionales'}`;
      } else if (deliveryType === 'programada') {
        deliveryDetails = `Envío Programado: ${scheduledDate || 'Próxima fecha'} (${scheduledTimeSlot})`;
      } else {
        deliveryDetails = `Envío en Rango: 2 a 4 días hábiles`;
      }

      const fullDeliveryAddress = `${direccion}${deptoInterior ? `, ${deptoInterior}` : ''}, ${distrito}, ${provincia}, ${departamento} [${deliveryDetails}]`;

      // 3. Insertar orden e ítems mediante Backend API seguro
      const orderPayload = {
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_wallet: payerWalletAddress,
        delivery_address: fullDeliveryAddress,
        payment_tx_hash: txHash,
        payment_currency: 'BTC',
        total_usd: grandTotalUsd,
        total_btc: grandTotalBtc,
        status: 'completed',
        voucher_code: voucherCode,
        signature_novasats: signResult.signature,
        contract_address: NOVASATS_CONTRACT_ADDRESS,
      };

      const orderItems = cart.map((item) => ({
        product_id: item.product.id,
        supplier_id: item.product.supplier_id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price_usd: item.product.price_usd,
        unit_price_btc: item.product.price_btc,
        total_usd: Number(item.product.price_usd) * item.quantity,
        total_btc: Number(item.product.price_btc) * item.quantity,
      }));

      const res = await apiClient.post<{ success: boolean; order: any; error?: string }>('/api/orders', {
        order: orderPayload,
        items: orderItems,
      });

      if (!res?.success || !res.order) {
        throw new Error(res?.error || 'Error registrando la orden en el servidor.');
      }

      const activeOrderData = res.order;

      // 6. Confeti de celebración
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      const fullOrder: Order = {
        ...activeOrderData,
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_wallet: payerWalletAddress,
        total_usd: totalUsd,
        total_btc: totalBtc,
        voucher_code: voucherCode,
        created_at: new Date().toISOString(),
        status: 'completed',
        items: orderItems,
      };

      setCompletedOrder(fullOrder);
      clearCart();
      setStep(1);
      setIsCartOpen(false);
      setShowVoucher(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error durante el procesamiento del pago.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Manejador de teclado para subir y bajar cantidad con ArrowUp / ArrowDown
  const handleKeyDownQuantity = (e: React.KeyboardEvent, productId: string, currentQty: number, maxStock: number) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentQty < maxStock) {
        updateQuantity(productId, currentQty + 1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentQty > 1) {
        updateQuantity(productId, currentQty - 1);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <div className="w-full sm:w-screen sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800">
            
            {/* Header con Stepper */}
            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800">
              <div className={`flex items-center justify-between ${step >= 2 ? 'mb-3' : ''}`}>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {step === 1 && `Carrito de Compras (${itemCount})`}
                    {step === 2 && 'Datos de Entrega'}
                    {step === 3 && 'Confirmar y Pagar'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Indicador de 3 Pasos (Visible a partir de Paso 2: Entrega) */}
              {step >= 2 && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                      step === 1
                        ? 'bg-amber-500 text-black shadow-sm font-bold'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-black/20 font-bold">1</span>
                    <span>Carro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (cart.length > 0) setStep(2);
                    }}
                    disabled={cart.length === 0}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                      step === 2
                        ? 'bg-amber-500 text-black shadow-sm font-bold'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-black/20 font-bold">2</span>
                    <span>Entrega</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (customerEmail && direccion) setStep(3);
                    }}
                    disabled={!customerEmail || !direccion}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                      step === 3
                        ? 'bg-amber-500 text-black shadow-sm font-bold'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-black/20 font-bold">3</span>
                    <span>Pago</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Contenido según el paso */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* ======================================================== */}
              {/* PASO 1: CARRO (Con control de teclas Arriba / Abajo)     */}
              {/* ======================================================== */}
              {step === 1 && (
                <>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Tu carrito está vacío</h3>
                      <p className="text-xs text-gray-500 max-w-xs">
                        Explora los productos en el catálogo y agrégalos para comprar con Bitcoin.
                      </p>
                    </div>
                  ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700/80 hover:border-amber-500/40 transition group"
                          >
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                                  {item.product.name}
                                </h4>
                                <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                                    ${Number(item.product.price_usd).toFixed(2)} USD
                                  </span>
                                  <span className="text-[11px] text-gray-500 font-semibold">
                                    (S/ {(Number(item.product.price_usd) * PEN_RATE).toFixed(2)})
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-mono">
                                  {Number(item.product.price_btc).toFixed(8)} ₿ c/u
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                                {/* Selector de cantidad: Teclas Arriba/Abajo, sin botones nativos y botón de menos solo si cantidad > 1 */}
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm focus-within:ring-2 focus-within:ring-amber-500">
                                  {item.quantity > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
                                      title="Disminuir cantidad"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/\D/g, '');
                                      const val = parseInt(raw, 10);
                                      if (!isNaN(val)) {
                                        updateQuantity(item.product.id, Math.min(item.product.stock, Math.max(1, val)));
                                      }
                                    }}
                                    onKeyDown={(e) => handleKeyDownQuantity(e, item.product.id, item.quantity, item.product.stock)}
                                    className="w-12 text-center text-xs font-bold text-gray-900 dark:text-white bg-transparent focus:outline-none"
                                    title="Usa flechas Arriba/Abajo para cambiar cantidad"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.product.stock}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition"
                                    title="Aumentar cantidad"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                                  title="Eliminar producto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                  )}
                </>
              )}

              {/* ======================================================== */}
              {/* PASO 2: ENTREGA (Secuencial: 1 -> 2 -> 3)               */}
              {/* ======================================================== */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* SUB-PASO 1: Contacto & Comprobante */}
                  {deliverySubStep === 1 && (
                    <form onSubmit={handleContinueToAddress} className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-amber-500" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            1. Contacto & Comprobante
                          </h3>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Nombre Completo *
                          </label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ej: Miguel Carlos Rojas"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Gmail / Correo Electrónico *
                          </label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="tu.correo@gmail.com"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                          />
                          <p className="text-[11px] text-gray-500 mt-1">
                            Te enviaremos el comprobante digital criptográfico directamente a tu Gmail.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Volver al Carro</span>
                        </button>
                        <button
                          type="submit"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                        >
                          <span>Continuar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* SUB-PASO 2: Agregar Dirección con Google Maps & GPS */}
                  {deliverySubStep === 2 && (
                    <form onSubmit={handleContinueToDeliveryType} className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                              2. Agregar Dirección
                            </h3>
                          </div>
                          {addressSaved && (
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Guardada
                            </span>
                          )}
                        </div>

                        {/* Departamento */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Departamento *
                          </label>
                          <select
                            required
                            value={departamento}
                            onChange={(e) => handleDeptChange(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                          >
                            <option value="">Selecciona una opción</option>
                            {Object.keys(PERU_LOCATIONS).map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>

                        {/* Provincia */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Provincia *
                          </label>
                          <select
                            required
                            value={provincia}
                            onChange={(e) => handleProvChange(e.target.value)}
                            disabled={!departamento}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white disabled:opacity-50"
                          >
                            <option value="">Selecciona una opción</option>
                            {availableProvincias.map((prov) => (
                              <option key={prov} value={prov}>{prov}</option>
                            ))}
                          </select>
                        </div>

                        {/* Distrito */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Distrito *
                          </label>
                          <select
                            required
                            value={distrito}
                            onChange={(e) => setDistrito(e.target.value)}
                            disabled={!provincia}
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white disabled:opacity-50"
                          >
                            <option value="">Selecciona una opción</option>
                            {availableDistritos.map((dist) => (
                              <option key={dist} value={dist}>{dist}</option>
                            ))}
                          </select>
                        </div>

                        {/* Dirección con Permiso GPS integrado en el mismo campo */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                              Dirección *
                            </label>
                            <button
                              type="button"
                              onClick={requestSystemLocation}
                              disabled={gpsLoading}
                              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 transition disabled:opacity-50"
                              title="Solicitar permiso de ubicación y autocompletar con GPS"
                            >
                              {gpsLoading ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>Detectando...</span>
                                </>
                              ) : (
                                <>
                                  <LocateFixed className="w-3 h-3" />
                                  <span>Dar permiso de ubicación (GPS)</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={direccion}
                              onChange={(e) => {
                                setDireccion(e.target.value);
                                setMapSearchInput(e.target.value);
                              }}
                              onBlur={() => {
                                if (direccion.trim()) {
                                  handleMapSearch(direccion);
                                }
                              }}
                              placeholder="Ingresa calle y número / Mz / Lote / Urb"
                              className="w-full pl-3 pr-24 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={requestSystemLocation}
                              disabled={gpsLoading}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm disabled:opacity-50"
                            >
                              {gpsLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Navigation className="w-3.5 h-3.5" />
                              )}
                              <span>GPS</span>
                            </button>
                          </div>

                          {gpsSuccess && (
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Permiso concedido y dirección GPS detectada.
                            </p>
                          )}
                          {gpsError && (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                              {gpsError}
                            </p>
                          )}
                        </div>

                        {/* Mapa de Google Interactivo con Barra de Búsqueda y Permiso GPS (antes de Depto/Interior) */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-500" />
                              Mapa Interactivo de Destino
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={requestSystemLocation}
                                disabled={gpsLoading}
                                className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-0.5 transition disabled:opacity-50"
                              >
                                {gpsLoading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Navigation className="w-3 h-3" />
                                )}
                                <span>Permiso GPS</span>
                              </button>
                              <span className="text-gray-300 dark:text-gray-700">|</span>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  coords ? `${coords.lat},${coords.lng}` : `${mapSearchInput || direccion || 'Lima'}, ${distrito || ''}, ${provincia || ''}, Peru`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 font-medium"
                              >
                                <span>Ver en Google Maps</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          {/* Barra para escribir o buscar en el mapa */}
                          <div className="flex gap-1.5">
                            <div className="relative flex-1">
                              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                value={mapSearchInput}
                                onChange={(e) => setMapSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleMapSearch();
                                  }
                                }}
                                placeholder="Escribe dirección o referencia en el mapa..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none dark:text-white"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleMapSearch()}
                              disabled={mapSearching}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0 disabled:opacity-50"
                            >
                              {mapSearching ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Search className="w-3.5 h-3.5 text-amber-500" />
                              )}
                              <span>Buscar</span>
                            </button>
                          </div>

                          {mapSearchMessage && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                              {mapSearchMessage}
                            </p>
                          )}

                          {/* Contenedor del Mapa de Google */}
                          <div className="w-full h-44 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 relative shadow-inner">
                            <iframe
                              title="Google Maps Destino"
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              scrolling="no"
                              marginHeight={0}
                              marginWidth={0}
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                coords
                                  ? `${coords.lat},${coords.lng}`
                                  : `${mapSearchInput || direccion || 'Lima Perú'}, ${distrito || ''}, ${provincia || ''}, Peru`
                              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-full"
                            />
                          </div>
                        </div>

                        {/* Depto, casa, piso, interior (opcional) */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Depto, casa, piso, interior (opcional)
                          </label>
                          <input
                            type="text"
                            value={deptoInterior}
                            onChange={(e) => setDeptoInterior(e.target.value)}
                            placeholder="Ejemplo: Depto. 101, casa 3"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        {/* Guardar como dirección principal */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="guardarPrincipal"
                            checked={guardarPrincipal}
                            onChange={(e) => setGuardarPrincipal(e.target.checked)}
                            className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                          />
                          <label htmlFor="guardarPrincipal" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            Guardar como dirección principal.
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setDeliverySubStep(1)}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Atrás</span>
                        </button>
                        <button
                          type="submit"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                        >
                          <span>Continuar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* SUB-PASO 3: Elige un tipo de entrega */}
                  {deliverySubStep === 3 && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 space-y-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-500" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                            3. Elige un tipo de entrega
                          </h3>
                        </div>

                        <div className="space-y-2.5">
                          {/* Retira tu pedido */}
                          <label
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                              deliveryType === 'retira'
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryType"
                              value="retira"
                              checked={deliveryType === 'retira'}
                              onChange={() => setDeliveryType('retira')}
                              className="mt-1 accent-amber-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Store className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="text-xs font-bold text-gray-900 dark:text-white">Retira tu pedido</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Gratis</span>
                              </div>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                Elige el lugar donde quieres hacer tu retiro
                              </p>
                            </div>
                          </label>

                          {/* Envío Express */}
                          <label
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                              deliveryType === 'express'
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryType"
                              value="express"
                              checked={deliveryType === 'express'}
                              onChange={() => setDeliveryType('express')}
                              className="mt-1 accent-amber-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="text-xs font-bold text-gray-900 dark:text-white">Envío Express</span>
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">S/ 15.00</span>
                              </div>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                Entrega prioritaria en 2 a 3 horas
                              </p>
                            </div>
                          </label>

                          {/* Envío en fecha programada */}
                          <label
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                              deliveryType === 'programada'
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryType"
                              value="programada"
                              checked={deliveryType === 'programada'}
                              onChange={() => setDeliveryType('programada')}
                              className="mt-1 accent-amber-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="text-xs font-bold text-gray-900 dark:text-white">Envío en fecha programada</span>
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">S/ 7.90</span>
                              </div>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                Elige el día y la franja horaria que prefieras
                              </p>
                            </div>
                          </label>

                          {/* Envío en rango de fechas */}
                          <label
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                              deliveryType === 'rango'
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryType"
                              value="rango"
                              checked={deliveryType === 'rango'}
                              onChange={() => setDeliveryType('rango')}
                              className="mt-1 accent-amber-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="text-xs font-bold text-gray-900 dark:text-white">Envío en rango de fechas</span>
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">S/ 7.90</span>
                              </div>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                Llega entre el 16/10 y el 18/10
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Campos específicos por Tipo de Entrega */}
                        {deliveryType === 'retira' && (
                          <div className="p-3.5 bg-white dark:bg-gray-900 rounded-xl border border-amber-500/20 space-y-3">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              Punto de Retiro y Responsable
                            </h4>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Selecciona la tienda o punto de retiro
                              </label>
                              <select
                                value={pickupStore}
                                onChange={(e) => setPickupStore(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:text-white"
                              >
                                <option value="Sede Central - San Isidro, Lima">Sede Central - San Isidro, Lima (Av. Javier Prado Este 4200)</option>
                                <option value="Punto Miraflores - Av. Larco 880">Punto Miraflores - Av. Larco 880, Miraflores</option>
                                <option value="Punto Surco - C.C. Jockey Plaza">Punto Surco - C.C. Jockey Plaza, Santiago de Surco</option>
                                <option value="Punto San Miguel - Av. La Marina 2000">Punto San Miguel - Av. La Marina 2000, San Miguel</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Nombre de quien retira
                                </label>
                                <input
                                  type="text"
                                  value={pickupPersonName}
                                  onChange={(e) => setPickupPersonName(e.target.value)}
                                  placeholder="Titular o Tercero"
                                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  DNI / Carné Ext.
                                </label>
                                <input
                                  type="text"
                                  value={pickupPersonDni}
                                  onChange={(e) => setPickupPersonDni(e.target.value)}
                                  placeholder="Número de documento"
                                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {deliveryType === 'express' && (
                          <div className="p-3.5 bg-white dark:bg-gray-900 rounded-xl border border-amber-500/20 space-y-3">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              Detalles del Envío Express
                            </h4>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Celular / WhatsApp de contacto para el motorizado
                              </label>
                              <input
                                type="tel"
                                value={expressPhone}
                                onChange={(e) => setExpressPhone(e.target.value)}
                                placeholder="+51 987 654 321"
                                className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Instrucciones o Referencia de llegada rápida
                              </label>
                              <input
                                type="text"
                                value={expressInstructions}
                                onChange={(e) => setExpressInstructions(e.target.value)}
                                placeholder="Ej: Tocar timbre 202, dejar en recepción o portón negro"
                                className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:text-white"
                              />
                            </div>
                            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                              <span>Tu paquete será despachado por motorizado express inmediatamente tras la confirmación en Bitcoin.</span>
                            </div>
                          </div>
                        )}

                        {deliveryType === 'programada' && (
                          <div className="p-3.5 bg-white dark:bg-gray-900 rounded-xl border border-amber-500/20 space-y-3">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              Programación de Fecha y Horario
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Fecha deseada
                                </label>
                                <input
                                  type="date"
                                  value={scheduledDate}
                                  onChange={(e) => setScheduledDate(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Franja horaria
                                </label>
                                <select
                                  value={scheduledTimeSlot}
                                  onChange={(e) => setScheduledTimeSlot(e.target.value)}
                                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:text-white"
                                >
                                  <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                                  <option value="Tarde (13:00 - 18:00)">Tarde (13:00 - 18:00)</option>
                                  <option value="Noche (18:00 - 21:00)">Noche (18:00 - 21:00)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {deliveryType === 'rango' && (
                          <div className="p-3.5 bg-white dark:bg-gray-900 rounded-xl border border-amber-500/20 space-y-2">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              Ventana de Entrega Estimada
                            </h4>
                            <p className="text-[11px] text-gray-600 dark:text-gray-300">
                              Tu pedido llegará entre el <strong>16/10</strong> y el <strong>18/10</strong> en horario regular de 8:00 am a 7:00 pm.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setDeliverySubStep(2)}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Atrás</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleGoToPayment}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                        >
                          <span>Continuar al Pago</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* PASO 3: PAGO Y RESUMEN EXACTO DE LA COMPRA               */}
              {/* ======================================================== */}
              {step === 3 && (
                <form onSubmit={handleProcessOrder} className="space-y-4">
                  {/* Bloque: Resumen de la compra */}
                  <div className="bg-gray-50 dark:bg-gray-800/70 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Resumen de la compra
                    </h3>

                    {/* Productos */}
                    <div className="space-y-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center text-sm font-bold text-gray-900 dark:text-white">
                        <span>Productos ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                        <span>
                          S/ {totalOriginalPen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Lista de productos con detalle */}
                      <div className="space-y-3">
                        {cart.map((item) => {
                          const origPen = getItemOriginalPen(item);
                          const currentPen = getItemCurrentPen(item);
                          const hasDiscount = origPen > currentPen;

                          return (
                            <div key={item.product.id} className="flex gap-3 text-xs">
                              {/* Imagen del producto */}
                              <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-center">
                                {item.product.image_url ? (
                                  <img
                                    src={item.product.image_url}
                                    alt={`Product image for ${item.product.name}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                                )}
                              </div>

                              {/* Datos del producto */}
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <p className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                                  {item.product.name}
                                </p>
                                <div className="flex items-baseline gap-2">
                                  <span className="font-bold text-gray-900 dark:text-white">
                                    S/ {currentPen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-[11px] line-through text-gray-400">
                                      S/ {origPen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                  {item.quantity} Un.
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Descuentos (si los hay) */}
                    {totalDiscountsPen > 0 && (
                      <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700 text-xs">
                        <div className="flex justify-between items-center font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          <span>
                            Descuentos ({cart.filter((it) => getItemOriginalPen(it) > getItemCurrentPen(it)).length})
                          </span>
                          <span>
                            - S/ {totalDiscountsPen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        {cart
                          .filter((it) => getItemOriginalPen(it) > getItemCurrentPen(it))
                          .map((it) => {
                            const discountPen = getItemOriginalPen(it) - getItemCurrentPen(it);
                            return (
                              <div key={it.product.id} className="flex justify-between items-start gap-2 text-gray-600 dark:text-gray-300">
                                <span className="truncate">{it.product.name}</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                                  - S/ {discountPen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* Entregas */}
                    <div className="space-y-1.5 pb-3 border-b border-gray-200 dark:border-gray-700 text-xs">
                      <div className="flex justify-between items-center font-bold text-gray-900 dark:text-white text-sm">
                        <span>Entregas (1)</span>
                        <span>
                          {deliveryCostPen === 0 ? 'Gratis' : `S/ ${deliveryCostPen.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 text-xs">
                        <span>1 - {getDeliveryEstimatedDateText()}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {deliveryCostPen === 0 ? 'Gratis' : `S/ ${deliveryCostPen.toFixed(2)}`}
                        </span>
                      </div>
                    </div>

                    {/* Total Final */}
                    <div className="pt-1 flex justify-between items-baseline">
                      <span className="text-base font-bold text-gray-900 dark:text-white">Total:</span>
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                          S/ {grandTotalPen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs font-mono font-bold text-amber-500 mt-0.5">
                          ${grandTotalUsd.toFixed(2)} USD • {grandTotalBtc.toFixed(8)} ₿
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resumen Destino */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 rounded-xl space-y-1 text-xs">
                    <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      Destino de Entrega
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Cliente:</strong> {customerName} ({customerEmail})
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Dirección:</strong> {direccion} {deptoInterior ? `(${deptoInterior})` : ''}, {distrito}, {provincia}, {departamento}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] capitalize">
                      <strong>Método:</strong> {deliveryType} — {getDeliveryEstimatedDateText()}
                    </p>
                  </div>

                  {/* Conexión de Billetera Reown AppKit */}
                  <div className="space-y-2.5 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Billetera Web3 / WalletConnect
                      </label>
                      <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Reown AppKit
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>{effectiveWallet ? `Conectado: ${effectiveWallet.slice(0, 6)}...${effectiveWallet.slice(-4)}` : 'Conectar con WalletConnect'}</span>
                    </button>

                    {effectiveWallet && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">Wallet Pagadora Autorizada</p>
                            <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400 truncate">{effectiveWallet}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded shrink-0">
                          ON-CHAIN
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Nota de Seguridad */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                      <Bitcoin className="w-4 h-4 text-amber-500" />
                      Firma NovaSats.sol y Envío a Gmail
                    </p>
                    <p>
                      Al presionar pagar, se confirmará la transacción on-chain, se reservará tu stock y recibirás tu comprobante voucher con código único y PDF.
                    </p>
                  </div>

                  {/* Botones de acción Paso 3 */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(2);
                        setDeliverySubStep(3);
                      }}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Volver</span>
                    </button>
                    <button
                      type="submit"
                      disabled={processingPayment}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition disabled:opacity-50"
                    >
                      {processingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Procesando en Blockchain...</span>
                        </>
                      ) : (
                        <>
                          <Bitcoin className="w-4 h-4" />
                          <span>Pagar {grandTotalBtc.toFixed(8)} BTC</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Footer de navegación para Paso 1 */}
            {cart.length > 0 && step === 1 && (
              <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 space-y-3">
                <div className="flex justify-between items-baseline font-bold text-gray-900 dark:text-white">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total a Pagar</span>
                  <div className="text-right">
                    <span className="text-lg">${totalUsd.toFixed(2)} USD</span>
                    <p className="text-xs font-mono font-medium text-amber-500">
                      {totalBtc.toFixed(8)} BTC
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                    title="Vaciar carrito"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleGoToDelivery}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-xl shadow-lg shadow-orange-500/25 transition text-sm"
                  >
                    <span>Continuar a Entrega</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voucher Modal on successful purchase */}
      <VoucherModal
        order={completedOrder}
        isOpen={showVoucher}
        onClose={() => setShowVoucher(false)}
        title="¡Compra Completada con Éxito!"
      />
    </>
  );
};
