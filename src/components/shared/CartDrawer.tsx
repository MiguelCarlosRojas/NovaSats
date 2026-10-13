import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWallet } from '../../context/WalletContext';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { supabase } from '../../lib/supabaseClient';
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
  Store
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

  // Tipo de entrega seleccionado
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('express');

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

  // Validación de Paso 1 -> Paso 2
  const handleGoToDelivery = () => {
    setErrorMessage('');
    if (cart.length === 0) {
      setErrorMessage('Tu carrito está vacío.');
      return;
    }
    setStep(2);
  };

  // Validación de guardado de dirección en Paso 2
  const handleSaveAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!customerEmail.trim()) {
      setErrorMessage('Por favor ingresa tu correo electrónico / Gmail.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!departamento || !provincia || !distrito) {
      setErrorMessage('Por favor selecciona Departamento, Provincia y Distrito.');
      return;
    }
    if (!direccion.trim()) {
      setErrorMessage('Por favor ingresa la calle, número, Mz o Lote de la dirección.');
      return;
    }

    setAddressSaved(true);
  };

  // Validación de Paso 2 -> Paso 3
  const handleGoToPayment = () => {
    setErrorMessage('');
    if (!customerEmail.trim()) {
      setErrorMessage('Por favor ingresa tu correo Gmail.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Por favor ingresa tu nombre.');
      return;
    }
    if (!direccion.trim() || !departamento) {
      setErrorMessage('Por favor completa los datos de tu dirección antes de continuar al pago.');
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
      const payResult = await sendBtcPayment(totalBtc, recipientWallet);
      if (!payResult.success) {
        throw new Error(payResult.error || 'Error al procesar la transferencia en blockchain');
      }

      const txHash = payResult.txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      const voucherCode = `VOUCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;

      // 2. Firma criptográfica con el contrato inteligente NovaSats.sol
      const signResult = await signPurchaseWithNovaSats(
        payerWalletAddress,
        orderNumber,
        voucherCode,
        totalBtc,
        totalUsd
      );

      const fullDeliveryAddress = `${direccion}${deptoInterior ? `, ${deptoInterior}` : ''}, ${distrito}, ${provincia}, ${departamento} (Tipo: ${deliveryType})`;

      // 3. Insertar orden en Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: orderNumber,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_wallet: payerWalletAddress,
            delivery_address: fullDeliveryAddress,
            payment_tx_hash: txHash,
            payment_currency: 'BTC',
            total_usd: totalUsd,
            total_btc: totalBtc,
            status: 'completed',
            voucher_code: voucherCode,
            signature_novasats: signResult.signature,
            contract_address: NOVASATS_CONTRACT_ADDRESS,
          },
        ])
        .select()
        .single();

      if (orderError) {
        // En caso que la columna delivery_address no exista en la tabla remota, intentar sin ella
        const fallbackRes = await supabase
          .from('orders')
          .insert([
            {
              order_number: orderNumber,
              customer_name: customerName,
              customer_email: customerEmail,
              customer_wallet: payerWalletAddress,
              payment_tx_hash: txHash,
              payment_currency: 'BTC',
              total_usd: totalUsd,
              total_btc: totalBtc,
              status: 'completed',
              voucher_code: voucherCode,
              signature_novasats: signResult.signature,
              contract_address: NOVASATS_CONTRACT_ADDRESS,
            },
          ])
          .select()
          .single();

        if (fallbackRes.error) {
          throw new Error(`Error registrando la orden: ${fallbackRes.error.message}`);
        }
      }

      const activeOrderData = orderData || { id: orderNumber };

      // 4. Insertar ítems de la orden
      const orderItems = cart.map((item) => ({
        order_id: activeOrderData.id,
        product_id: item.product.id,
        supplier_id: item.product.supplier_id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price_usd: item.product.price_usd,
        unit_price_btc: item.product.price_btc,
        total_usd: Number(item.product.price_usd) * item.quantity,
        total_btc: Number(item.product.price_btc) * item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) {
        console.warn('Warning inserting order items:', itemsError);
      }

      // 5. Actualizar stock en Supabase
      for (const item of cart) {
        const remainingStock = Math.max(0, item.product.stock - item.quantity);
        await supabase
          .from('products')
          .update({ stock: remainingStock, updated_at: new Date().toISOString() })
          .eq('id', item.product.id);
      }

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
              <div className="flex items-center justify-between mb-3">
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

              {/* Indicador de 3 Pasos (Solo visible a partir del Paso 2 por solicitud) */}
              {step > 1 && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-black/20 font-bold">1</span>
                    <span>Carro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                      step === 2
                        ? 'bg-amber-500 text-black shadow-sm font-bold'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                    <>
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
                        <span className="text-base">💡</span>
                        <span>Usa las teclas <strong>↑ Arriba</strong> y <strong>↓ Abajo</strong> en el selector de cantidad para ajustar productos rápidamente.</span>
                      </div>

                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/70 rounded-2xl border border-gray-200 dark:border-gray-700/80 hover:border-amber-500/40 transition group"
                          >
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold mt-0.5">
                                  ${Number(item.product.price_usd).toFixed(2)} USD
                                </p>
                                <p className="text-[10px] text-gray-500 font-mono">
                                  {Number(item.product.price_btc).toFixed(8)} ₿ c/u
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                                {/* Selector de cantidad con soporte para flechas arriba/abajo */}
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm focus-within:ring-2 focus-within:ring-amber-500">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
                                    title="Disminuir (↓ flecha abajo)"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max={item.product.stock}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 1;
                                      updateQuantity(item.product.id, Math.min(item.product.stock, Math.max(1, val)));
                                    }}
                                    onKeyDown={(e) => handleKeyDownQuantity(e, item.product.id, item.quantity, item.product.stock)}
                                    className="w-12 text-center text-xs font-bold text-gray-900 dark:text-white bg-transparent focus:outline-none appearance-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                                    title="Presiona flecha Arriba/Abajo para cambiar cantidad"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.product.stock}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition"
                                    title="Aumentar (↑ flecha arriba)"
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
                    </>
                  )}
                </>
              )}

              {/* ======================================================== */}
              {/* PASO 2: ENTREGA (Gmail, Dirección y Tipo de Entrega)    */}
              {/* ======================================================== */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Gmail & Datos básicos */}
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      1. Contacto & Comprobante
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Nombre Completo
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
                        Gmail / Correo Electrónico
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

                  {/* Sección: Agregar Dirección */}
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
                        Departamento
                      </label>
                      <select
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
                        Provincia
                      </label>
                      <select
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
                        Distrito
                      </label>
                      <select
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

                    {/* Dirección */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Ingresa calle y número / Mz / Lote / Urb"
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
                      />
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

                    <button
                      type="button"
                      onClick={() => handleSaveAddress()}
                      className="w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-xs font-bold rounded-xl transition"
                    >
                      {addressSaved ? 'Dirección confirmada ✓' : 'Continuar con esta dirección'}
                    </button>
                  </div>

                  {/* Sección: Elige un tipo de entrega */}
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 space-y-3">
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
                          <div className="flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Retira tu pedido</span>
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
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Envío Express</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            Ingresa tu dirección para conocer disponibilidad
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
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Envío en fecha programada</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            Ingresa tu dirección para conocer disponibilidad
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
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Envío en rango de fechas</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                            Ingresa tu dirección para conocer disponibilidad
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* PASO 3: PAGO CON WALLET Y BITCOIN                        */}
              {/* ======================================================== */}
              {step === 3 && (
                <form onSubmit={handleProcessOrder} className="space-y-4">
                  {/* Resumen de Pago */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-800 dark:text-amber-400 font-medium block">Total a Pagar</span>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">${totalUsd.toFixed(2)} USD</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-amber-600 dark:text-amber-400 block font-medium">Equivalente BTC</span>
                      <p className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">
                        {totalBtc.toFixed(8)} ₿
                      </p>
                    </div>
                  </div>

                  {/* Resumen de Entrega */}
                  <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 rounded-xl space-y-1 text-xs">
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
                      <strong>Método:</strong> {deliveryType}
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
                      onClick={() => setStep(2)}
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
                          <span>Pagar {totalBtc.toFixed(8)} BTC</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Footer de navegación para Paso 1 y Paso 2 */}
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

            {cart.length > 0 && step === 2 && (
              <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Carro</span>
                </button>
                <button
                  type="button"
                  onClick={handleGoToPayment}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition"
                >
                  <span>Continuar al Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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
