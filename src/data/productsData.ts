import { Product } from '../types/store';
import { apiClient } from '../lib/apiClient';
import { parseProductDescription } from '../lib/productMeta';

export const BTC_PRICE_USD = 65000;

/**
 * Universal helper to determine if a product has free shipping.
 * Matches if free_shipping is true, shipping_type is 'free'/'gratis',
 * price_usd >= 100, or description indicates free shipping.
 */
export function isFreeShippingProduct(item: any): boolean {
  if (!item) return false;
  if (item.free_shipping === true || item.free_shipping === 'true') return true;
  const sType = String(item.shipping_type || '').toLowerCase().trim();
  if (sType === 'free' || sType === 'gratis') return true;
  if (Number(item.price_usd) >= 100) return true;
  const desc = String(item.description || '').toLowerCase();
  if (desc.includes('envio gratis') || desc.includes('envío gratis') || desc.includes('free shipping')) return true;
  return false;
}

/**
 * Helper to normalize and format a raw Supabase product record with metadata.
 */
export function formatStoreProduct(item: any): Product {
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

// In-memory cache for catalog/store products to avoid repeating queries on navigation
let productsCache: { data: Product[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export function invalidateProductsCache() {
  productsCache = null;
  apiClient.clearCache('/api/products');
}

/**
 * Fetch all active real products via secure Backend API with smart client SWR cache.
 */
export async function fetchAllStoreProducts(forceRefresh = false): Promise<Product[]> {
  const now = Date.now();
  if (!forceRefresh && productsCache && (now - productsCache.timestamp < CACHE_TTL_MS)) {
    return productsCache.data;
  }

  try {
    const res = await apiClient.get<{ success: boolean; products: any[] }>('/api/products');
    if (res?.products) {
      const formatted = res.products.map(formatStoreProduct);
      productsCache = { data: formatted, timestamp: now };
      return formatted;
    }
    return productsCache?.data || [];
  } catch (e) {
    console.error('Error fetching real products from Backend API:', e);
    return productsCache?.data || [];
  }
}

/**
 * Fetch a specific product by its ID or SKU via Backend API.
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;

  // First check in-memory cache if available
  if (productsCache?.data) {
    const cached = productsCache.data.find((p) => p.id === id || p.sku === id);
    if (cached) return cached;
  }

  try {
    const res = await apiClient.get<{ success: boolean; product: any }>(`/api/products/${encodeURIComponent(id)}`);
    if (res?.product) {
      return formatStoreProduct(res.product);
    }
  } catch (e) {
    console.error('Error fetching product by ID from Backend API:', e);
  }

  return null;
}

export interface ProductDetailFullResult {
  product: Product | null;
  questions: any[];
  reviews: any[];
}

/**
 * Fetches product, supplier info, questions, and reviews in 1 single Backend API request.
 */
export async function fetchProductDetailFull(id: string): Promise<ProductDetailFullResult> {
  if (!id) return { product: null, questions: [], reviews: [] };

  try {
    const res = await apiClient.get<{
      success: boolean;
      product: any;
      questions?: any[];
      reviews?: any[];
    }>(`/api/products/${encodeURIComponent(id)}`);

    if (res?.product) {
      return {
        product: formatStoreProduct(res.product),
        questions: res.questions || [],
        reviews: res.reviews || []
      };
    }
  } catch (err) {
    console.error('Error in fetchProductDetailFull from Backend API:', err);
  }

  return { product: null, questions: [], reviews: [] };
}
