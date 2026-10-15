import React, { useState, useEffect, useMemo } from 'react';
import { SupplierLayout } from './SupplierLayout';
import { useSupplier } from '../../context/SupplierContext';
import { supabase } from '../../lib/supabaseClient';
import { Product } from '../../types/store';
import { encodeProductDescription, parseProductDescription } from '../../lib/productMeta';
import { CATEGORY_NAMES, getSubcategoriesForCategory } from '../../data/categories';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  RotateCcw,
  Boxes,
  Save,
  X,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Bitcoin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  Star,
  Plus,
  Layers,
  FileText,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Cloud
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { exportLandscapePdfTable } from '../../lib/pdfReportGenerator';
import { uploadProductImageToStorage, deleteImageFromStorage } from '../../lib/storageUpload';

const BTC_PRICE_USD = 65000;

export const SupplierProducts: React.FC = () => {
  const { supplier } = useSupplier();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialFilterTab = (f: string | null): 'all' | 'active' | 'low_stock' | 'archived' => {
    if (!f) return 'active';
    const lower = f.toLowerCase();
    if (lower === 'activos' || lower === 'active' || lower === 'activo') return 'active';
    if (lower === 'bajo_stock' || lower === 'agotados' || lower === 'low_stock') return 'low_stock';
    if (lower === 'archivados' || lower === 'archived' || lower === 'archivado') return 'archived';
    if (lower === 'todos' || lower === 'all') return 'all';
    return 'active';
  };

  const urlFiltro = searchParams.get('filtro') || searchParams.get('filter');
  const urlQ = searchParams.get('q') || searchParams.get('search') || '';
  const urlCategoria = searchParams.get('categoria') || searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlQ);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'low_stock' | 'archived'>(getInitialFilterTab(urlFiltro));
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategoria);

  // Sync URL search params
  const syncUrlParams = (tab: string, qStr: string, catStr: string) => {
    const params: Record<string, string> = {};
    if (tab === 'active') params.filtro = 'activos';
    else if (tab === 'low_stock') params.filtro = 'bajo_stock';
    else if (tab === 'archived') params.filtro = 'archivados';
    else if (tab === 'all') params.filtro = 'todos';

    if (qStr.trim()) params.q = qStr.trim();
    if (catStr && catStr !== 'all' && catStr !== 'Todas') params.categoria = catStr;

    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    const qParam = searchParams.get('q') || searchParams.get('search') || '';
    const filtroParam = searchParams.get('filtro') || searchParams.get('filter');
    const catParam = searchParams.get('categoria') || searchParams.get('category') || 'all';

    if (qParam !== search) setSearch(qParam);
    const mapped = getInitialFilterTab(filtroParam);
    if (mapped !== filterTab) setFilterTab(mapped);
    if (catParam !== selectedCategory) setSelectedCategory(catParam);

    // Ensure URL has ?filtro=activos if empty
    if (!filtroParam) {
      syncUrlParams('active', qParam, catParam);
    }
  }, [searchParams]);

  // Modal State for Add / Update
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalTab, setModalTab] = useState<'general' | 'pricing' | 'gallery' | 'shipping'>('general');

  // Form Fields (Exact match with ProductDetailPage fields)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORY_NAMES[0]);
  const [subcategory, setSubcategory] = useState(getSubcategoriesForCategory(CATEGORY_NAMES[0])[0] || '');
  const [sku, setSku] = useState('');
  const [condition, setCondition] = useState('Nuevo en Caja Sellada');
  const [warranty, setWarranty] = useState('12 Meses con NovaSats.sol');
  
  // Pricing & Stock
  const [priceUsd, setPriceUsd] = useState('');
  const [priceBtc, setPriceBtc] = useState('');
  const [stock, setStock] = useState('10');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [originalPriceUsd, setOriginalPriceUsd] = useState('');

  // Gallery (Images)
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isDraggingMain, setIsDraggingMain] = useState(false);
  const [isDraggingSecondary, setIsDraggingSecondary] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingSecondary, setIsUploadingSecondary] = useState(false);
  const [isDeletingMain, setIsDeletingMain] = useState(false);
  const mainFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const secondaryFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Logistics & Status
  const [shippingType, setShippingType] = useState<'free' | 'express' | 'standard'>('free');
  const [formStatus, setFormStatus] = useState<'active' | 'draft' | 'archived'>('active');

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [initialFormJson, setInitialFormJson] = useState('');

  const availableSubcategories = useMemo(() => {
    return getSubcategoriesForCategory(category);
  }, [category]);

  const currentFormJson = useMemo(() => {
    return JSON.stringify({
      name: name.trim(),
      description: description.trim(),
      category,
      subcategory,
      priceUsd: priceUsd.trim(),
      priceBtc: priceBtc.trim(),
      stock: stock.trim(),
      imageUrl: imageUrl.trim(),
      additionalImages,
      sku: sku.trim(),
      condition,
      warranty: warranty.trim(),
      formStatus,
      discountPercent: discountPercent.trim(),
      originalPriceUsd: originalPriceUsd.trim(),
      shippingType,
    });
  }, [
    name,
    description,
    category,
    subcategory,
    priceUsd,
    priceBtc,
    stock,
    imageUrl,
    additionalImages,
    sku,
    condition,
    warranty,
    formStatus,
    discountPercent,
    originalPriceUsd,
    shippingType,
  ]);

  const isProductFormDirty = editingProduct ? currentFormJson !== initialFormJson : true;

  const handleNextStep = () => {
    setFormError('');
    if (modalTab === 'general') {
      if (!name.trim()) {
        setFormError('Por favor ingresa el título del producto antes de continuar.');
        return;
      }
      setModalTab('pricing');
    } else if (modalTab === 'pricing') {
      if (!priceUsd || parseFloat(priceUsd) <= 0) {
        setFormError('Por favor ingresa un precio USD válido antes de continuar.');
        return;
      }
      if (!stock || parseInt(stock) < 0) {
        setFormError('Por favor ingresa un stock válido antes de continuar.');
        return;
      }
      setModalTab('gallery');
    } else if (modalTab === 'gallery') {
      if (!imageUrl.trim()) {
        setFormError('Por favor ingresa la foto principal de portada antes de continuar.');
        return;
      }
      setModalTab('shipping');
    }
  };

  const handlePrevStep = () => {
    setFormError('');
    if (modalTab === 'shipping') setModalTab('gallery');
    else if (modalTab === 'gallery') setModalTab('pricing');
    else if (modalTab === 'pricing') setModalTab('general');
  };

  const categories = CATEGORY_NAMES;

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchProducts = async () => {
    if (!supplier?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, supplier_id, name, description, category, price_usd, price_btc, stock, image_url, images, status, sku, discount_percent, original_price_usd, free_shipping, shipping_type, rating, reviews_count, warranty, condition, is_featured, created_at')
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const parsed = (data || []).map((p) => {
        const { cleanDescription, meta } = parseProductDescription(p.description);
        return {
          ...p,
          description: cleanDescription || p.description,
          images: meta.images && meta.images.length > 0 ? meta.images : (p.image_url ? [p.image_url] : []),
          discount_percent: meta.discount_percent ?? (p.discount_percent ?? 0),
          original_price_usd: meta.original_price_usd ?? (p.original_price_usd ?? p.price_usd),
          free_shipping: meta.free_shipping ?? (meta.shipping_type === 'free' || p.price_usd >= 100),
          shipping_type: meta.shipping_type ?? (p.shipping_type ?? 'free'),
          rating: meta.rating !== undefined && meta.rating !== null ? Number(meta.rating) : (p.rating !== undefined && p.rating !== null ? Number(p.rating) : 0.0),
          reviews_count: meta.reviews_count ?? (p.reviews_count ?? 0)
        };
      });

      setProducts(parsed);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      showToast('error', 'Error al cargar catálogo de productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supplier?.id) return;
    fetchProducts();

    // Real-time socket subscription to avoid multiple HTTP requests
    const channel = supabase
      .channel(`supplier-products-rt-${supplier.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products', filter: `supplier_id=eq.${supplier.id}` },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supplier?.id]);

  // Open modal for Adding new product
  const handleOpenAddModal = () => {
    const defaultSku = `NEX-${Math.floor(1000 + Math.random() * 9000)}`;
    const defaultCat = 'Tecnología';
    const defaultSubcat = getSubcategoriesForCategory(defaultCat)[0] || '';
    setEditingProduct(null);
    setModalTab('general');
    setName('');
    setDescription('');
    setCategory(defaultCat);
    setSubcategory(defaultSubcat);
    setPriceUsd('');
    setPriceBtc('');
    setStock('0');
    setImageUrl('');
    setAdditionalImages([]);
    setSku(defaultSku);
    setCondition('Nuevo');
    setWarranty('Garantía del Proveedor');
    setFormStatus('active');
    setDiscountPercent('0');
    setOriginalPriceUsd('');
    setShippingType('standard');
    setFormError('');

    setInitialFormJson(
      JSON.stringify({
        name: '',
        description: '',
        category: defaultCat,
        subcategory: defaultSubcat,
        priceUsd: '',
        priceBtc: '',
        stock: '0',
        imageUrl: '',
        additionalImages: [],
        sku: defaultSku,
        condition: 'Nuevo',
        warranty: 'Garantía del Proveedor',
        formStatus: 'active',
        discountPercent: '0',
        originalPriceUsd: '',
        shippingType: 'standard',
      })
    );
    setIsModalOpen(true);
  };

  // Open modal for Updating existing product
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setModalTab('general');
    const { cleanDescription, meta } = parseProductDescription(p.description);
    
    const initialName = p.name || '';
    const initialDesc = cleanDescription || p.description || '';
    const initialCat = p.category && CATEGORY_NAMES.includes(p.category) ? p.category : (p.category || 'Tecnología');
    const initialSubcat = p.subcategory || meta.subcategory || (getSubcategoriesForCategory(initialCat)[0] || '');
    const initialPUsd = String(p.price_usd || '');
    const initialPBtc = String(p.price_btc || '');
    const initialStk = String(p.stock ?? 0);
    const initialImg = p.image_url || '';
    const extraImgs = (meta.images || p.images || []).filter((img: string) => img !== p.image_url);
    const initialSku = p.sku || `NEX-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialCond = meta.condition || 'Nuevo en Caja Sellada';
    const initialWarr = meta.warranty || '12 Meses con NovaSats.sol';
    const initialStat = p.status || 'active';
    const initialDisc = String(meta.discount_percent ?? (p.discount_percent ?? 0));
    const initialOrigP = String(meta.original_price_usd ? meta.original_price_usd : p.price_usd);
    const initialShip = meta.shipping_type || (p.shipping_type || (p.free_shipping ? 'free' : 'standard'));

    setName(initialName);
    setDescription(initialDesc);
    setCategory(initialCat);
    setSubcategory(initialSubcat);
    setPriceUsd(initialPUsd);
    setPriceBtc(initialPBtc);
    setStock(initialStk);
    setImageUrl(initialImg);
    setAdditionalImages(extraImgs);
    setSku(initialSku);
    setCondition(initialCond);
    setWarranty(initialWarr);
    setFormStatus(initialStat);
    setDiscountPercent(initialDisc);
    setOriginalPriceUsd(initialOrigP);
    setShippingType(initialShip);
    setFormError('');

    setInitialFormJson(
      JSON.stringify({
        name: initialName.trim(),
        description: initialDesc.trim(),
        category: initialCat,
        subcategory: initialSubcat,
        priceUsd: initialPUsd.trim(),
        priceBtc: initialPBtc.trim(),
        stock: initialStk.trim(),
        imageUrl: initialImg.trim(),
        additionalImages: extraImgs,
        sku: initialSku.trim(),
        condition: initialCond,
        warranty: initialWarr.trim(),
        formStatus: initialStat,
        discountPercent: initialDisc.trim(),
        originalPriceUsd: initialOrigP.trim(),
        shippingType: initialShip,
      })
    );
    setIsModalOpen(true);
  };

  const handlePriceUsdChange = (val: string) => {
    setPriceUsd(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setPriceBtc((num / BTC_PRICE_USD).toFixed(6));
      if (!originalPriceUsd || parseFloat(originalPriceUsd) <= num) {
        setOriginalPriceUsd(num.toFixed(2));
      }
    } else {
      setPriceBtc('');
    }
  };

  const handleDiscountChange = (val: string) => {
    setDiscountPercent(val);
    const pct = parseFloat(val);
    const currPrice = parseFloat(priceUsd);
    if (!isNaN(pct) && pct > 0 && !isNaN(currPrice) && currPrice > 0) {
      // Calculate original price before discount
      const orig = currPrice / (1 - pct / 100);
      setOriginalPriceUsd(orig.toFixed(2));
    }
  };

  // Manejador de Arrastrar y Soltar para Foto Principal (Subida a la Nube)
  const handleMainDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingMain(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setIsUploadingImage(true);
        const preview = URL.createObjectURL(file);
        setLocalPreviewUrl(preview);
        try {
          const cloudUrl = await uploadProductImageToStorage(file);
          setImageUrl(cloudUrl);
          setLocalPreviewUrl(cloudUrl);
          showToast('success', '¡Foto principal actualizada con éxito!');
        } catch (err: any) {
          console.error('Error subiendo imagen:', err);
          showToast('error', `Error al subir imagen: ${err.message || 'Error desconocido'}`);
        } finally {
          setIsUploadingImage(false);
        }
      } else {
        showToast('error', 'Por favor arrastra un archivo de imagen válido (PNG, JPG, WEBP)');
      }
    }
  };

  const handleMainFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setIsUploadingImage(true);
        const preview = URL.createObjectURL(file);
        setLocalPreviewUrl(preview);
        try {
          const cloudUrl = await uploadProductImageToStorage(file);
          setImageUrl(cloudUrl);
          setLocalPreviewUrl(cloudUrl);
          showToast('success', '¡Foto principal actualizada con éxito!');
        } catch (err: any) {
          console.error('Error subiendo imagen:', err);
          showToast('error', `Error al subir imagen: ${err.message || 'Error desconocido'}`);
        } finally {
          setIsUploadingImage(false);
        }
      } else {
        showToast('error', 'Por favor selecciona un archivo de imagen válido');
      }
    }
  };

  // Manejador para eliminar Foto Principal de Portada (de la nube y del estado)
  const handleDeleteMainImage = async () => {
    if (!imageUrl) return;
    setIsDeletingMain(true);
    try {
      await deleteImageFromStorage(imageUrl);
      setImageUrl('');
      setLocalPreviewUrl(null);
      showToast('success', 'Foto de portada eliminada');
    } catch (err: any) {
      console.error('Error al eliminar imagen de la nube:', err);
      setImageUrl('');
      setLocalPreviewUrl(null);
      showToast('success', 'Foto de portada eliminada');
    } finally {
      setIsDeletingMain(false);
    }
  };

  // Manejador de Arrastrar y Soltar para Fotos Secundarias (Máximo 5 imágenes)
  const handleSecondaryDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingSecondary(false);

    if (additionalImages.length >= 5) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const remainingSlots = 5 - additionalImages.length;
      if (remainingSlots <= 0) return;

      setIsUploadingSecondary(true);
      try {
        const imageFiles = Array.from(e.dataTransfer.files)
          .filter((f) => f.type.startsWith('image/'))
          .slice(0, remainingSlots);

        const urls = await Promise.all(imageFiles.map((f) => uploadProductImageToStorage(f)));
        if (urls.length > 0) {
          setAdditionalImages((prev) => [...prev, ...urls].slice(0, 5));
          showToast('success', `¡${urls.length} foto(s) agregadas a la galería!`);
        }
      } catch (err: any) {
        showToast('error', `Error al subir fotos: ${err.message}`);
      } finally {
        setIsUploadingSecondary(false);
      }
    }
  };

  const handleSecondaryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (additionalImages.length >= 5) return;

    if (e.target.files && e.target.files.length > 0) {
      const remainingSlots = 5 - additionalImages.length;
      if (remainingSlots <= 0) return;

      setIsUploadingSecondary(true);
      try {
        const imageFiles = Array.from(e.target.files)
          .filter((f) => f.type.startsWith('image/'))
          .slice(0, remainingSlots);

        const urls = await Promise.all(imageFiles.map((f) => uploadProductImageToStorage(f)));
        if (urls.length > 0) {
          setAdditionalImages((prev) => [...prev, ...urls].slice(0, 5));
          showToast('success', `¡${urls.length} foto(s) agregadas a la galería!`);
        }
      } catch (err: any) {
        showToast('error', `Error al subir fotos: ${err.message}`);
      } finally {
        setIsUploadingSecondary(false);
        if (secondaryFileInputRef.current) {
          secondaryFileInputRef.current.value = '';
        }
      }
    }
  };

  const handleRemoveAdditionalImage = async (index: number) => {
    const urlToRemove = additionalImages[index];
    try {
      if (urlToRemove) {
        await deleteImageFromStorage(urlToRemove);
      }
    } catch (err: any) {
      console.error('Error al eliminar foto secundaria de la nube:', err);
    }
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save product (Insert or Update with embedded metadata)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;

    if (!name.trim() || !priceUsd || !stock) {
      setFormError('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      const parsedPriceUsd = parseFloat(priceUsd);
      const parsedPriceBtc = parseFloat(priceBtc) || parsedPriceUsd / BTC_PRICE_USD;
      const parsedStock = parseInt(stock) || 0;
      const parsedDiscount = parseInt(discountPercent) || 0;
      const parsedOrigPrice = originalPriceUsd ? parseFloat(originalPriceUsd) : parsedPriceUsd;

      // Gallery array: primary image followed by additional images
      const allGalleryImages = [
        imageUrl.trim(),
        ...additionalImages.filter(Boolean)
      ].filter(Boolean);

      // Real rating and reviews from verified buyer opinions (never fake/hardcoded, starts at 0.0)
      const realRating = editingProduct ? (editingProduct.rating ?? 0.0) : 0.0;
      const realReviewsCount = editingProduct ? (editingProduct.reviews_count ?? 0) : 0;

      // Encode extended metadata into description
      const fullDescription = encodeProductDescription(description, {
        images: allGalleryImages,
        discount_percent: parsedDiscount,
        original_price_usd: parsedOrigPrice,
        shipping_type: shippingType,
        free_shipping: shippingType === 'free',
        rating: realRating,
        reviews_count: realReviewsCount,
        warranty: warranty.trim(),
        condition: condition.trim(),
        subcategory: subcategory.trim()
      });

      // Direct full payload (for migrated DB schema)
      const directPayload: any = {
        supplier_id: supplier.id,
        name: name.trim(),
        description: fullDescription,
        category: category.trim(),
        subcategory: subcategory.trim(),
        price_usd: parsedPriceUsd,
        price_btc: parsedPriceBtc,
        stock: parsedStock,
        image_url: imageUrl.trim() || allGalleryImages[0],
        sku: sku.trim() || `NEX-${Date.now().toString().slice(-5)}`,
        status: formStatus,
        updated_at: new Date().toISOString(),
        images: allGalleryImages,
        discount_percent: parsedDiscount,
        original_price_usd: parsedOrigPrice,
        shipping_type: shippingType,
        free_shipping: shippingType === 'free',
        rating: realRating,
        reviews_count: realReviewsCount,
        warranty: warranty.trim(),
        condition: condition.trim()
      };

      // Fallback payload (for older schema before migration)
      const fallbackPayload: any = {
        supplier_id: supplier.id,
        name: name.trim(),
        description: fullDescription,
        category: category.trim(),
        price_usd: parsedPriceUsd,
        price_btc: parsedPriceBtc,
        stock: parsedStock,
        image_url: imageUrl.trim() || allGalleryImages[0],
        sku: sku.trim() || `NEX-${Date.now().toString().slice(-5)}`,
        status: formStatus,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        const { error: directErr } = await supabase
          .from('products')
          .update(directPayload)
          .eq('id', editingProduct.id);

        if (directErr) {
          const { error: fallbackErr } = await supabase
            .from('products')
            .update(fallbackPayload)
            .eq('id', editingProduct.id);

          if (fallbackErr) throw fallbackErr;
        }
        showToast('success', `Producto "${name}" actualizado con éxito`);
      } else {
        directPayload.created_at = new Date().toISOString();
        fallbackPayload.created_at = directPayload.created_at;

        const { error: directErr } = await supabase
          .from('products')
          .insert([directPayload]);

        if (directErr) {
          const { error: fallbackErr } = await supabase
            .from('products')
            .insert([fallbackPayload]);

          if (fallbackErr) throw fallbackErr;
        }
        showToast('success', `Producto "${name}" publicado en la tienda`);
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setFormError(err.message || 'Error al guardar el producto.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Archive / Deactivate Product
  const handleDeactivateProduct = async (id: string, prodName: string) => {
    if (!window.confirm(`¿Seguro que deseas archivar "${prodName}"? Ocultará el producto de la tienda.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      showToast('success', `"${prodName}" fue archivado.`);
      await fetchProducts();
    } catch (err: any) {
      showToast('error', err.message || 'Error al archivar');
    }
  };

  // Reactivate Product
  const handleReactivateProduct = async (id: string, prodName: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      showToast('success', `"${prodName}" volvió a estar activo.`);
      await fetchProducts();
    } catch (err: any) {
      showToast('error', err.message || 'Error al reactivar');
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      let matchesTab = true;
      if (filterTab === 'active') matchesTab = p.status === 'active';
      else if (filterTab === 'low_stock') matchesTab = p.stock <= 5;
      else if (filterTab === 'archived') matchesTab = p.status === 'archived';

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [products, search, filterTab, selectedCategory]);

  // Pagination: 10 records per page
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterTab, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleTabChange = (newTab: 'all' | 'active' | 'low_stock' | 'archived') => {
    setFilterTab(newTab);
    syncUrlParams(newTab, search, selectedCategory);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    syncUrlParams(filterTab, newSearch, selectedCategory);
  };

  const handleCategoryChange = (newCat: string) => {
    setSelectedCategory(newCat);
    syncUrlParams(filterTab, search, newCat);
  };

  // Summary Metrics
  const activeCount = products.filter((p) => p.status === 'active').length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalInventoryUsd = products.reduce((sum, p) => sum + (p.price_usd || 0) * (p.stock || 0), 0);
  const totalInventoryBtc = totalInventoryUsd / BTC_PRICE_USD;

  // Export to Horizontal Landscape PDF with autoTable
  const handleExportPdf = () => {
    const headers = [
      'SKU',
      'PRODUCTO / ARTÍCULO',
      'CATEGORÍA',
      'ESTADO',
      'STOCK',
      'PRECIO USD',
      'PRECIO BTC',
      'DESCUENTO %',
      'ENVÍO'
    ];

    const rows = filteredProducts.map((p) => {
      const { meta } = parseProductDescription(p.description);
      const isFree = p.free_shipping || meta.shipping_type === 'free' || p.shipping_type === 'free';
      const disc = meta.discount_percent ?? (p.discount_percent || 0);

      return [
        p.sku || 'N/A',
        p.name,
        p.category || 'General',
        p.status === 'active' ? 'ACTIVO' : 'ARCHIVADO',
        p.stock,
        `$${Number(p.price_usd).toFixed(2)}`,
        `${Number(p.price_btc).toFixed(8)} BTC`,
        disc > 0 ? `${disc}%` : '0%',
        isFree ? 'Gratis' : 'Estándar'
      ];
    });

    const footers = [
      [
        'TOTALES',
        `${filteredProducts.length} Productos`,
        '—',
        `${activeCount} Activos`,
        `${totalStockUnits} uds`,
        `$${totalInventoryUsd.toFixed(2)} USD`,
        `${totalInventoryBtc.toFixed(8)} BTC`,
        '—',
        '—'
      ]
    ];

    exportLandscapePdfTable({
      title: 'Catálogo Oficial de Productos & Inventario',
      supplierName: supplier?.company_name || 'NovaSats Partner',
      stats: [
        { label: 'Total Productos', value: `${filteredProducts.length}` },
        { label: 'Productos Activos', value: `${activeCount}` },
        { label: 'Unidades Físicas', value: `${totalStockUnits} uds.` },
        { label: 'Valor Inventario USD', value: `$${totalInventoryUsd.toFixed(2)}` },
      ],
      headers,
      rows,
      footers,
      fileName: `Catalogo_Productos_${new Date().toISOString().slice(0, 10)}.pdf`,
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 26 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 28 },
        3: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
        4: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
        5: { halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129], cellWidth: 24 },
        6: { halign: 'right', textColor: [217, 119, 6], cellWidth: 28 },
        7: { halign: 'center', cellWidth: 22 },
        8: { halign: 'center', cellWidth: 20 },
      }
    });
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = filteredProducts.map((p) => {
      const { meta } = parseProductDescription(p.description);
      return {
        SKU: p.sku || 'N/A',
        Nombre: p.name,
        Categoría: p.category || 'General',
        Estado: p.status === 'active' ? 'ACTIVO' : 'ARCHIVADO',
        Stock: p.stock,
        'Precio USD': Number(p.price_usd).toFixed(2),
        'Precio BTC': Number(p.price_btc).toFixed(8),
        'Descuento %': meta.discount_percent ?? (p.discount_percent || 0),
        Envío: p.free_shipping || meta.shipping_type === 'free' ? 'Gratis' : 'Estándar',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo');
    XLSX.writeFile(workbook, `Catalogo_Productos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <SupplierLayout
      title="Mis Productos & Catálogo"
      subtitle="Gestiona tu inventario con todos los campos sincronizados con la página de producto y la red Bitcoin."
    >
      <div className="space-y-8 w-full max-w-full">
        
        {/* TOAST MESSAGE */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-4 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/95 border-red-500/40 text-red-200'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-xs font-semibold">{toastMessage.text}</span>
          </div>
        )}

        {/* TOP KPI CARDS BAR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#090d18] border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Total Catálogo</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-heading">{products.length}</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">{activeCount} activos</span> en tienda
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#090d18] border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Existencias Físicas</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-heading">{totalStockUnits}</p>
            <p className="text-[11px] text-slate-400 mt-1">Unidades totales listas para despacho</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#090d18] border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Valor Inventario (USD)</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
              ${totalInventoryUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Valor de mercado cotizado</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#090d18] border border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Valor On-Chain (BTC)</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bitcoin className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-2 font-mono">
              {totalInventoryBtc.toFixed(4)} ₿
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">Liquidación directa en wallet</p>
          </div>
        </div>

        {/* TOOLBAR: ACTION BUTTON + FILTERS */}
        <div className="bg-[#0b101e] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título, SKU o categoría..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#060911] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            {/* Top Right: Export & Create Buttons */}
            <div className="flex items-center gap-2">
              
              {/* PDF Icon Button with Tooltip */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={filteredProducts.length === 0}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white flex items-center justify-center shadow-lg shadow-red-600/20 transition active:scale-95"
                  aria-label="Exportar PDF"
                  title="Exportar PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-white/[0.1] text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-30">
                  Exportar PDF
                </div>
              </div>

              {/* Excel Icon Button with Tooltip */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  disabled={filteredProducts.length === 0}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 transition active:scale-95"
                  aria-label="Exportar Excel"
                  title="Exportar Excel"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-white/[0.1] text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-30">
                  Exportar Excel
                </div>
              </div>

              {/* Agregar Producto Button */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Agregar Producto</span>
              </button>

            </div>

          </div>

          {/* Quick Filter Tabs & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/40 border border-white/[0.06] rounded-xl text-xs">
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterTab === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({products.length})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('active')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterTab === 'active'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Activos ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('low_stock')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterTab === 'low_stock'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bajo Stock / 0 ({products.filter((p) => p.stock <= 5).length})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('archived')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterTab === 'archived'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Archivados ({products.filter((p) => p.status === 'archived').length})
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Categoría:</span>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-[#060911] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* PRODUCTS TABLE CONTAINER */}
        <div className="bg-[#090d18] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="overflow-x-auto lateral-scrollbar">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#0c1222] text-slate-400 uppercase tracking-wider font-semibold font-mono text-[11px]">
                    <th className="py-4 px-6">Producto & Detalles</th>
                    <th className="py-4 px-3">SKU & Categoría</th>
                    <th className="py-4 px-3 text-right">Precio USD</th>
                    <th className="py-4 px-3 text-right">Precio BTC</th>
                    <th className="py-4 px-4 text-center">Stock</th>
                    <th className="py-4 px-3 text-center">Envíos</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5 min-w-[240px]">
                          <div className="w-14 h-14 rounded-xl bg-white/[0.05] shrink-0" />
                          <div className="space-y-2 flex-1">
                            <div className="h-3.5 bg-white/[0.06] rounded w-44" />
                            <div className="h-2.5 bg-white/[0.04] rounded w-28" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="space-y-1.5">
                          <div className="h-3 bg-white/[0.06] rounded w-20" />
                          <div className="h-2.5 bg-white/[0.04] rounded w-16" />
                        </div>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="h-4 bg-white/[0.06] rounded w-16 ml-auto" />
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="h-4 bg-white/[0.06] rounded w-20 ml-auto" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 bg-white/[0.06] rounded w-12 mx-auto" />
                      </td>
                      <td className="py-4 px-3">
                        <div className="h-4 bg-white/[0.06] rounded w-16 mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="h-7 bg-white/[0.06] rounded-xl w-20 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 px-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white font-heading">No se encontraron productos</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {search || selectedCategory !== 'all' || filterTab !== 'all'
                  ? 'No hay productos que coincidan con los filtros seleccionados.'
                  : 'Aún no has registrado ningún producto. Empieza publicando tu primer artículo en la tienda.'}
              </p>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar mi Primer Producto</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto lateral-scrollbar">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#0c1222] text-slate-400 uppercase tracking-wider font-semibold font-mono text-[11px]">
                    <th className="py-4 px-6">Producto & Detalles</th>
                    <th className="py-4 px-3">SKU & Categoría</th>
                    <th className="py-4 px-3 text-right">Precio USD</th>
                    <th className="py-4 px-3 text-right">Precio BTC</th>
                    <th className="py-4 px-4 text-center">Stock</th>
                    <th className="py-4 px-3 text-center">Envíos</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] font-medium">
                  {paginatedProducts.map((p) => {
                    const isArchived = p.status === 'archived';
                    const hasDiscount = Boolean(p.discount_percent && p.discount_percent > 0);
                    const isFreeShipping = p.free_shipping || p.shipping_type === 'free';

                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-white/[0.02] transition-colors ${
                          isArchived ? 'opacity-50 bg-black/20' : ''
                        }`}
                      >
                        {/* Producto & Thumbnail */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5 min-w-[240px]">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/50 border border-white/[0.1] shrink-0 group flex items-center justify-center">
                              {p.image_url ? (
                                <img
                                  src={p.image_url}
                                  alt={p.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-slate-500" />
                              )}
                              {p.images && p.images.length > 1 && (
                                <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-[9px] font-mono text-white rounded">
                                  +{p.images.length - 1}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-xs truncate hover:text-amber-400 transition" title={p.name}>
                                {p.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5" title={p.description}>
                                {p.description || 'Sin descripción'}
                              </p>
                              {hasDiscount && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  -{p.discount_percent}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* SKU & Categoría */}
                        <td className="py-4 px-3 min-w-[130px]">
                          <span className="font-mono text-[11px] text-amber-400 font-bold block">
                            {p.sku || 'SIN-SKU'}
                          </span>
                          <span className="text-[10px] text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06] inline-block mt-1 font-medium">
                            {p.category || 'General'}
                          </span>
                          {p.subcategory && (
                            <span className="text-[9px] text-amber-400 block mt-0.5 font-mono">
                              › {p.subcategory}
                            </span>
                          )}
                        </td>

                        {/* Precio USD */}
                        <td className="py-4 px-3 text-right font-mono font-bold text-white min-w-[100px]">
                          ${p.price_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          {p.original_price_usd && p.original_price_usd > p.price_usd && (
                            <span className="block text-[10px] text-slate-500 line-through">
                              ${p.original_price_usd.toFixed(2)}
                            </span>
                          )}
                        </td>

                        {/* Precio BTC */}
                        <td className="py-4 px-3 text-right font-mono font-bold text-amber-400 min-w-[110px]">
                          {p.price_btc ? `${p.price_btc.toFixed(6)} ₿` : `${(p.price_usd / BTC_PRICE_USD).toFixed(6)} ₿`}
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-4 text-center min-w-[100px]">
                          <span
                            className={`inline-block font-mono text-xs font-bold px-2.5 py-1 rounded-lg border ${
                              p.stock > 10
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : p.stock > 0
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                            }`}
                          >
                            {p.stock} {p.stock === 1 ? 'unidad' : 'uds.'}
                          </span>
                        </td>

                        {/* Envíos */}
                        <td className="py-4 px-3 text-center min-w-[100px]">
                          {isFreeShipping ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              <Truck className="w-3 h-3" />
                              Gratis
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.06]">
                              {p.shipping_type === 'express' ? 'Express' : 'Estándar'}
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="py-4 px-6 text-right min-w-[180px]">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* BOTÓN: VER EN TIENDA (Link directo a la página de producto) */}
                            <Link
                              to={`/producto/${p.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition border border-transparent hover:border-amber-500/30"
                              title="Ver producto en la tienda pública"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* BOTÓN: EDITAR PRODUCTO */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition border border-transparent hover:border-amber-500/30"
                              title="Editar información completa del producto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* BOTÓN: ARCHIVAR O REACTIVAR */}
                            {isArchived ? (
                              <button
                                type="button"
                                onClick={() => handleReactivateProduct(p.id, p.name)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-[11px] font-bold transition"
                                title="Volver a activar en la tienda"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Activar</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDeactivateProduct(p.id, p.name)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                                title="Archivar producto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Controles de paginación (10 registros por página) */}
              {filteredProducts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#0a0f1d] border-t border-white/[0.08] text-xs text-slate-400">
                  <div>
                    Mostrando <span className="text-white font-bold">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}</span> - <span className="text-white font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> de <span className="text-white font-bold">{filteredProducts.length}</span> productos (10 por página)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] hover:border-amber-500/50 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Anterior
                    </button>
                    <span className="font-mono text-xs px-2">
                      Página <strong className="text-amber-400">{currentPage}</strong> de {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.1] hover:border-amber-500/50 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* MODAL PROFESIONAL MULTI-PESTAÑA PARA AGREGAR O ACTUALIZAR PRODUCTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#090e1a] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#0c1322]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-heading">
                    {editingProduct ? 'Editar Producto Completo' : 'Publicar Nuevo Producto en Tienda'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {editingProduct ? `ID: ${editingProduct.id}` : 'Sincronizado con Smart Contract y Liquidación Bitcoin'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/[0.06] bg-[#070a13] overflow-x-auto text-xs font-bold scrollbar-none">
              <button
                type="button"
                onClick={() => setModalTab('general')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition shrink-0 ${
                  modalTab === 'general'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Información General</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('pricing')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition shrink-0 ${
                  modalTab === 'pricing'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>2. Precios & Promociones</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('gallery')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition shrink-0 ${
                  modalTab === 'gallery'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>3. Galería de Fotos (Carrusel)</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('shipping')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition shrink-0 ${
                  modalTab === 'shipping'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>4. Logística & Garantía</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto lateral-scrollbar flex-1 space-y-6">
              
              {formError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-6">
                
                {/* TAB 1: INFORMACIÓN GENERAL */}
                {modalTab === 'general' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Título del Producto *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Hardware Wallet Ledger Nano X Black Edition"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Catálogo *
                          </label>
                          <select
                            value={category}
                            onChange={(e) => {
                              const newCat = e.target.value;
                              setCategory(newCat);
                              const subcats = getSubcategoriesForCategory(newCat);
                              setSubcategory(subcats[0] || '');
                            }}
                            className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Categoría *
                          </label>
                          <select
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            {availableSubcategories.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                            {subcategory && !availableSubcategories.includes(subcategory) && (
                              <option value={subcategory}>{subcategory} (Personalizado)</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Código SKU / Referencia
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="NEX-HW-001"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            className="flex-1 bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => setSku(`NEX-${Math.floor(1000 + Math.random() * 9000)}`)}
                            className="px-3 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-slate-300 rounded-xl border border-white/[0.08]"
                          >
                            Generar
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Condición del Producto
                        </label>
                        <select
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                          className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Nuevo en Caja Sellada">Nuevo en Caja Sellada (Original)</option>
                          <option value="Reacondicionado Grado A">Reacondicionado Grado A</option>
                          <option value="Edición Limitada Coleccionable">Edición Limitada Coleccionable</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Garantía Criptográfica
                        </label>
                        <input
                          type="text"
                          placeholder="12 Meses con NovaSats.sol"
                          value={warranty}
                          onChange={(e) => setWarranty(e.target.value)}
                          className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Descripción Completa y Ficha Técnica
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Describe el producto, compatibilidad, protocolos soportados, materiales y precinto de fábrica..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full bg-[#060911] border border-white/[0.1] rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
                        />
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 2: PRECIOS, DESCUENTOS Y STOCK */}
                {modalTab === 'pricing' && (
                  <div className="space-y-6">
                    
                    <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 text-xs text-slate-300 flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold">Conversión Oficial: 1 BTC = ${BTC_PRICE_USD.toLocaleString()} USD</span>
                      <span className="text-[11px] text-slate-400">Contrato Inteligente NovaSats</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Precio USD */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Precio en Dólares ($ USD) *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            placeholder="149.00"
                            value={priceUsd}
                            onChange={(e) => handlePriceUsdChange(e.target.value)}
                            className="w-full bg-[#060911] border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      {/* Precio BTC */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Precio en Bitcoin (₿ BTC)
                        </label>
                        <div className="relative">
                          <Bitcoin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                          <input
                            type="number"
                            step="0.000001"
                            min="0"
                            placeholder="0.002292"
                            value={priceBtc}
                            onChange={(e) => setPriceBtc(e.target.value)}
                            className="w-full bg-[#060911] border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      {/* Stock */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Stock Disponible (Unidades) *
                        </label>
                        <div className="relative">
                          <Boxes className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="number"
                            min="0"
                            required
                            placeholder="15"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="w-full bg-[#060911] border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Promociones & Descuentos */}
                    <div className="p-5 rounded-2xl bg-[#070a14] border border-white/[0.08] space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-400" />
                          <span>Oferta Promocional (% OFF)</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">Visible como etiqueta roja en tienda</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Porcentaje de Descuento (0 - 90%)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="90"
                              placeholder="15"
                              value={discountPercent}
                              onChange={(e) => handleDiscountChange(e.target.value)}
                              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono font-bold">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Precio Original Tachado ($ USD)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Precio tachado anterior"
                            value={originalPriceUsd}
                            onChange={(e) => setOriginalPriceUsd(e.target.value)}
                            className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 3: GALERÍA DE FOTOS (CARRUSEL) */}
                {modalTab === 'gallery' && (
                  <div className="space-y-6">

                    {/* FOTO PRINCIPAL DE PORTADA */}
                    {imageUrl ? (
                      /* Si ya tenemos la portada: NO mostrar zona de arrastre, mostrar vista previa con botón para eliminar de la nube */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Foto Principal de Portada
                          </label>
                          <button
                            type="button"
                            disabled={isDeletingMain}
                            onClick={handleDeleteMainImage}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isDeletingMain ? 'Eliminando...' : 'Eliminar Portada'}</span>
                          </button>
                        </div>

                        <div className="relative rounded-xl overflow-hidden bg-black/60 border-2 border-amber-400 p-1.5 w-48 sm:w-52 group shadow-lg shadow-amber-500/10">
                          <img
                            src={localPreviewUrl || imageUrl}
                            alt="Portada Principal"
                            className="w-full h-36 object-cover rounded-lg"
                          />
                          <span className="absolute top-3 left-3 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black uppercase rounded shadow">
                            Portada Actual
                          </span>
                          <button
                            type="button"
                            disabled={isDeletingMain}
                            onClick={handleDeleteMainImage}
                            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition shadow-lg active:scale-95 disabled:opacity-50"
                            title="Eliminar foto de portada de la nube"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Si NO hay portada: mostrar zona de arrastre y selección para subir una nueva portada */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Foto Principal de Portada *
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Formatos soportados: PNG, JPG, WEBP
                          </span>
                        </div>

                        {/* ZONA DE ARRASTRE Y SOLTADO (DRAG & DROP) */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingMain(true);
                          }}
                          onDragLeave={() => setIsDraggingMain(false)}
                          onDrop={handleMainDrop}
                          onClick={() => mainFileInputRef.current?.click()}
                          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 group ${
                            isDraggingMain
                              ? 'border-amber-400 bg-amber-500/15 scale-[1.01] shadow-xl shadow-amber-500/10'
                              : 'border-white/[0.15] bg-[#070b16] hover:border-amber-500/50 hover:bg-[#0c1224]'
                          }`}
                        >
                          <input
                            type="file"
                            ref={mainFileInputRef}
                            accept="image/*"
                            onChange={handleMainFileSelect}
                            className="hidden"
                          />
                          {isUploadingImage ? (
                            <div className="flex flex-col items-center justify-center space-y-3 py-4">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-amber-400 animate-pulse">
                                  Subiendo imagen...
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Guardando en el almacenamiento del sistema
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                                  isDraggingMain
                                    ? 'bg-amber-500 text-black scale-110'
                                    : 'bg-amber-500/10 text-amber-400 group-hover:scale-105'
                                }`}
                              >
                                <Cloud className="w-6 h-6 stroke-[2.2]" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                                  Haz clic para seleccionar o arrastra y suelta tu imagen aquí
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Esta imagen se mostrará como la foto principal de tu producto
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* LISTA DINÁMICA DE FOTOS SECUNDARIAS PARA EL CARRUSEL */}
                    <div className="p-5 rounded-2xl bg-[#070a14] border border-white/[0.08] space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          <span>Fotos Secundarias para el Carrusel de Detalle</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Los compradores podrán navegar entre estas imágenes en la página del producto.
                        </p>
                      </div>

                      {/* ZONA DE ARRASTRE Y CLIC PARA FOTOS SECUNDARIAS: Si ya hay 5 fotos, no mostrar */}
                      {additionalImages.length < 5 && (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingSecondary(true);
                          }}
                          onDragLeave={() => setIsDraggingSecondary(false)}
                          onDrop={handleSecondaryDrop}
                          onClick={() => secondaryFileInputRef.current?.click()}
                          className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200 group ${
                            isDraggingSecondary
                              ? 'border-amber-400 bg-amber-500/15 scale-[1.01] shadow-xl shadow-amber-500/10'
                              : 'border-white/[0.15] bg-[#070b16] hover:border-amber-500/50 hover:bg-[#0c1224]'
                          }`}
                        >
                          <input
                            type="file"
                            ref={secondaryFileInputRef}
                            accept="image/*"
                            multiple
                            onChange={handleSecondaryFileSelect}
                            className="hidden"
                          />
                          {isUploadingSecondary ? (
                            <div className="flex flex-col items-center justify-center space-y-2 py-2">
                              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                              <span className="text-xs font-bold text-amber-400 animate-pulse">Subiendo fotos a la nube...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-1.5">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform ${
                                  isDraggingSecondary
                                    ? 'bg-amber-500 text-black scale-110'
                                    : 'bg-amber-500/10 text-amber-400 group-hover:scale-105'
                                }`}
                              >
                                <Cloud className="w-5 h-5 stroke-[2.2]" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                                  Haz clic para seleccionar o arrastra fotos secundarias aquí
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Formatos soportados: PNG, JPG, WEBP
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* GALERÍA EN MINIATURA CON PREVIEWS DE FOTOS SECUNDARIAS */}
                      {additionalImages.length > 0 && (
                        <div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {additionalImages.map((imgUrl, idx) => (
                              <div key={idx} className="relative rounded-xl overflow-hidden bg-black/60 border border-white/[0.1] p-1 group">
                                <img
                                  src={imgUrl}
                                  alt={`Secundaria ${idx + 1}`}
                                  className="w-full h-28 object-cover rounded-lg"
                                />
                                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/80 text-white text-[9px] font-mono rounded">
                                  Foto {idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdditionalImage(idx)}
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition shadow"
                                  title="Eliminar foto de la nube"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* TAB 4: LOGÍSTICA & ESTADO */}
                {modalTab === 'shipping' && (
                  <div className="space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Tipo de Envío */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Modalidad de Envío
                        </label>
                        <select
                          value={shippingType}
                          onChange={(e) => setShippingType(e.target.value as any)}
                          className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="free">Envío Gratis a todo el país (24 - 48h)</option>
                          <option value="express">Envío Express Prioritario (24h)</option>
                          <option value="standard">Envío Estándar con Seguimiento (2 - 4 días)</option>
                        </select>
                      </div>

                      {/* Estado en Tienda */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Visibilidad Comercial
                        </label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as any)}
                          className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="active">Activo (Visible en el catálogo público)</option>
                          <option value="archived">Archivado / Privado (Oculto de la tienda)</option>
                        </select>
                      </div>

                      {/* Reputación del Producto (Generada por Compradores Reales) */}
                      <div className="sm:col-span-2 p-4 rounded-2xl bg-[#070a14] border border-white/[0.08] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                              <Star className="w-5 h-5 fill-amber-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Calificación por Compradores Reales</p>
                              <p className="text-[11px] text-slate-400">
                                {editingProduct ? (
                                  <>Promedio actual: <strong className="text-amber-400 font-mono">{editingProduct.rating !== undefined && editingProduct.rating !== null ? Number(editingProduct.rating).toFixed(1) : '0.0'} ★</strong> ({editingProduct.reviews_count || 0} opiniones de clientes)</>
                                ) : (
                                  'Todo producto nuevo inicia con calificación de 0.0 ★ (0 opiniones). Las calificaciones se actualizarán automáticamente cuando los compradores reales califiquen el producto.'
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            On-Chain Verificado
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="p-4 rounded-2xl bg-[#070a14] border border-white/[0.08] flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Este producto quedará registrado bajo tu firma de proveedor (<strong className="text-white font-mono">{supplier?.company_name || 'Proveedor'}</strong>) y admitirá transacciones automáticas con comprobantes inmutables.
                      </p>
                    </div>

                  </div>
                )}

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0c1322] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  Paso: <strong className="text-amber-400 uppercase font-semibold">
                    {modalTab === 'general' ? '1 / 4' : modalTab === 'pricing' ? '2 / 4' : modalTab === 'gallery' ? '3 / 4' : '4 / 4'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {modalTab !== 'general' && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white text-xs font-bold rounded-xl transition active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>
                )}

                {modalTab === 'general' && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-95"
                  >
                    <span>Siguiente: Precios & Promociones</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {modalTab === 'pricing' && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-95"
                  >
                    <span>Siguiente: Galería de Fotos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {modalTab === 'gallery' && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-95"
                  >
                    <span>Siguiente: Logística & Garantía</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {modalTab === 'shipping' && (
                  <button
                    form="productForm"
                    type="submit"
                    disabled={formSubmitting || (editingProduct ? !isProductFormDirty : false)}
                    title={editingProduct && !isProductFormDirty ? 'Modifica algún campo para habilitar la actualización' : ''}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
                  >
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      {formSubmitting
                        ? 'Guardando en Blockchain...'
                        : editingProduct
                        ? 'Actualizar Producto'
                        : 'Publicar Producto'}
                    </span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </SupplierLayout>
  );
};
