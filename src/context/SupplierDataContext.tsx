import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '../lib/apiClient';
import { useSupplier } from './SupplierContext';
import { Product, Order } from '../types/store';
import { ProductReview, ProductQuestion } from '../lib/qaAndReviewsService';
import { parseProductDescription } from '../lib/productMeta';
import { isFreeShippingProduct } from '../data/productsData';

export interface SoldProductSummary {
  productId: string;
  name: string;
  category: string;
  unitsSold: number;
  revenueUsd: number;
  revenueBtc: number;
  currentStock: number;
}

export interface SupplierDataContextType {
  products: Product[];
  orderItems: any[];
  orders: Order[];
  soldProducts: SoldProductSummary[];
  reviews: ProductReview[];
  questions: ProductQuestion[];
  supplierRating: number;
  supplierReviewsCount: number;
  loading: boolean;
  error: string | null;
  refreshSupplierData: (quiet?: boolean) => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (prod: Product) => void;
  updateProduct: (prod: Product) => void;
  removeProduct: (id: string) => void;
  updateQuestionAnswer: (questionId: string, answer: string, answeredAt: string) => void;
}

const SupplierDataContext = createContext<SupplierDataContextType | undefined>(undefined);

function formatRawSupplierProduct(item: any): Product {
  const { cleanDescription, meta } = parseProductDescription(item.description);
  const imagesList = meta.images && meta.images.length > 0 ? meta.images : (item.image_url ? [item.image_url] : []);
  const rawShippingType = meta.shipping_type || item.shipping_type || 'standard';
  const freeShippingEligible = isFreeShippingProduct({
    ...item,
    ...meta,
    price_usd: item.price_usd,
    shipping_type: rawShippingType,
    free_shipping: meta.free_shipping ?? item.free_shipping
  });

  return {
    ...item,
    description: cleanDescription || item.description,
    images: imagesList,
    discount_percent: meta.discount_percent ?? (item.discount_percent || 0),
    original_price_usd: meta.original_price_usd ?? (item.original_price_usd || item.price_usd),
    free_shipping: freeShippingEligible,
    shipping_type: freeShippingEligible && rawShippingType === 'standard' ? 'free' : rawShippingType,
    rating: meta.rating !== undefined && meta.rating !== null ? Number(meta.rating) : (item.rating !== undefined && item.rating !== null ? Number(item.rating) : 0.0),
    reviews_count: meta.reviews_count ?? (item.reviews_count || 0),
    warranty: meta.warranty ?? (item.warranty || 'Garantía del Proveedor'),
    condition: meta.condition ?? (item.condition || 'Nuevo'),
    subcategory: meta.subcategory || (item as any).subcategory || undefined
  };
}

export const SupplierDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supplier } = useSupplier();

  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedSupplierId, setHasLoadedSupplierId] = useState<string | null>(null);

  // Single Consolidated Fetch for the Entire Supplier Portal
  const fetchSingleSupplierData = useCallback(async (isQuiet = false) => {
    if (!supplier?.id) {
      setProducts([]);
      setOrderItems([]);
      setReviews([]);
      setQuestions([]);
      setLoading(false);
      setHasLoadedSupplierId(null);
      return;
    }

    if (!isQuiet) {
      setLoading(true);
    }
    setError(null);

    try {
      // 1 SINGLE HTTP REQUEST to Backend API for the entire supplier portal
      const res = await apiClient.get<{ success: boolean; data: any; error?: string }>('/api/supplier/data');
      if (!res?.success || !res.data) {
        throw new Error(res?.error || 'Error al obtener datos del proveedor.');
      }
      const data = res.data;

      if (data) {
        // Parse and sort products
        const rawProds = Array.isArray(data.products) ? data.products : [];
        const formattedProds = rawProds
          .map(formatRawSupplierProduct)
          .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        setProducts(formattedProds);

        // Process order items
        const rawItems = Array.isArray(data.order_items) ? data.order_items : [];
        setOrderItems(rawItems);

        // Process reviews
        const rawReviews = Array.isArray(data.product_reviews) ? data.product_reviews : [];
        const sortedReviews = rawReviews.sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        // Map product names onto reviews for friendly display
        const prodNameMap: Record<string, string> = {};
        formattedProds.forEach((p: Product) => {
          prodNameMap[p.id] = p.name;
        });
        const enrichedReviews = sortedReviews.map((r: any) => ({
          ...r,
          product_name: prodNameMap[r.product_id] || r.product_name || 'Producto del Catálogo'
        }));
        setReviews(enrichedReviews);

        // Process questions
        const rawQuestions = Array.isArray(data.product_questions) ? data.product_questions : [];
        const sortedQuestions = rawQuestions.sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const enrichedQuestions = sortedQuestions.map((q: any) => ({
          ...q,
          product_name: prodNameMap[q.product_id] || q.product_name || 'Producto del Catálogo'
        }));
        setQuestions(enrichedQuestions);

        setHasLoadedSupplierId(supplier.id);
      }
    } catch (err: any) {
      console.error('Error fetching consolidated supplier data:', err);
      setError(err?.message || 'Error al cargar datos del proveedor');
    } finally {
      setLoading(false);
    }
  }, [supplier?.id]);

  useEffect(() => {
    if (supplier?.id && hasLoadedSupplierId !== supplier.id) {
      fetchSingleSupplierData(false);
    }
  }, [supplier?.id, hasLoadedSupplierId, fetchSingleSupplierData]);

  // Derived: Orders grouped from orderItems
  const orders = useMemo<Order[]>(() => {
    const orderMap: { [orderId: string]: Order } = {};
    orderItems.forEach((item: any) => {
      if (item.orders) {
        const oId = item.orders.id;
        if (!orderMap[oId]) {
          orderMap[oId] = {
            ...item.orders,
            items: []
          };
        }
        orderMap[oId].items?.push(item);
      }
    });

    return Object.values(orderMap).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [orderItems]);

  // Derived: Aggregated sold products summary
  const soldProducts = useMemo<SoldProductSummary[]>(() => {
    const soldMap: { [id: string]: SoldProductSummary } = {};
    const prodMap = new Map(products.map((p) => [p.id, p]));

    orderItems.forEach((item: any) => {
      const pId = item.product_id || item.product_name;
      if (!soldMap[pId]) {
        const matched = prodMap.get(pId);
        soldMap[pId] = {
          productId: pId,
          name: item.product_name || matched?.name || 'Producto',
          category: matched?.category || 'General',
          unitsSold: 0,
          revenueUsd: 0,
          revenueBtc: 0,
          currentStock: matched?.stock ?? 0
        };
      }
      soldMap[pId].unitsSold += Number(item.quantity || 0);
      soldMap[pId].revenueUsd += Number(item.total_usd || 0);
      soldMap[pId].revenueBtc += Number(item.total_btc || 0);
    });

    return Object.values(soldMap).sort((a, b) => b.unitsSold - a.unitsSold);
  }, [orderItems, products]);

  // Derived: Rating and reviews count
  const { supplierRating, supplierReviewsCount } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { supplierRating: 0.0, supplierReviewsCount: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return {
      supplierRating: Number((sum / reviews.length).toFixed(1)),
      supplierReviewsCount: reviews.length
    };
  }, [reviews]);

  // Optimistic state helpers
  const addProduct = useCallback((prod: Product) => {
    setProducts((prev) => [formatRawSupplierProduct(prod), ...prev]);
  }, []);

  const updateProduct = useCallback((prod: Product) => {
    const formatted = formatRawSupplierProduct(prod);
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? formatted : p)));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateQuestionAnswer = useCallback((questionId: string, answer: string, answeredAt: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, answer, answered_at: answeredAt } : q))
    );
  }, []);

  const value = useMemo(
    () => ({
      products,
      orderItems,
      orders,
      soldProducts,
      reviews,
      questions,
      supplierRating,
      supplierReviewsCount,
      loading,
      error,
      refreshSupplierData: fetchSingleSupplierData,
      setProducts,
      addProduct,
      updateProduct,
      removeProduct,
      updateQuestionAnswer
    }),
    [
      products,
      orderItems,
      orders,
      soldProducts,
      reviews,
      questions,
      supplierRating,
      supplierReviewsCount,
      loading,
      error,
      fetchSingleSupplierData,
      addProduct,
      updateProduct,
      removeProduct,
      updateQuestionAnswer
    ]
  );

  return <SupplierDataContext.Provider value={value}>{children}</SupplierDataContext.Provider>;
};

export const useSupplierData = () => {
  const context = useContext(SupplierDataContext);
  if (!context) {
    throw new Error('useSupplierData must be used within a SupplierDataProvider');
  }
  return context;
};
