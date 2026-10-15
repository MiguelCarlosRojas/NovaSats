import { apiClient } from './apiClient';

export interface ProductQuestion {
  id: string;
  product_id: string;
  supplier_id?: string;
  product_name?: string;
  user_name: string;
  user_email?: string;
  question: string;
  answer?: string | null;
  answered_at?: string | null;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  supplier_id?: string;
  product_name?: string;
  user_name: string;
  user_email?: string;
  user_wallet?: string;
  rating: number; // 1 - 5
  comment: string;
  voucher_code?: string;
  verified_purchase?: boolean;
  created_at: string;
}

// -------------------------------------------------------------
// QUESTIONS (Q&A) - SECURE BACKEND API (ZERO LOCAL STORAGE)
// -------------------------------------------------------------

export async function fetchProductQuestions(productId: string): Promise<ProductQuestion[]> {
  try {
    const res = await apiClient.get<{ success: boolean; questions: ProductQuestion[] }>(
      `/api/qa?productId=${encodeURIComponent(productId)}`
    );
    return res?.questions || [];
  } catch (err) {
    console.error('Error al consultar preguntas en Backend API:', err);
    return [];
  }
}

export async function submitProductQuestion(payload: {
  productId: string;
  supplierId?: string;
  productName: string;
  userName: string;
  userEmail?: string;
  question: string;
}): Promise<ProductQuestion> {
  const res = await apiClient.post<{ success: boolean; question: ProductQuestion; error?: string }>(
    '/api/qa',
    payload
  );

  if (res?.question) {
    return res.question;
  }
  throw new Error(res?.error || 'No se pudo guardar la pregunta en el servidor.');
}

export async function fetchSupplierQuestions(_supplierId?: string): Promise<ProductQuestion[]> {
  try {
    const res = await apiClient.get<{ success: boolean; questions: ProductQuestion[] }>(
      '/api/supplier/questions'
    );
    return res?.questions || [];
  } catch (err) {
    console.error('Error al obtener preguntas del proveedor en Backend API:', err);
    return [];
  }
}

export async function answerProductQuestion(
  questionId: string,
  answerText: string
): Promise<boolean> {
  const res = await apiClient.post<{ success: boolean; error?: string }>(
    `/api/supplier/questions/${encodeURIComponent(questionId)}/answer`,
    { answer: answerText }
  );

  if (res?.success) {
    return true;
  }
  throw new Error(res?.error || 'No se pudo registrar la respuesta en el servidor.');
}

// -------------------------------------------------------------
// REVIEWS & RATINGS (OPINIONES) - SECURE BACKEND API (ZERO LOCAL STORAGE)
// -------------------------------------------------------------

export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const res = await apiClient.get<{ success: boolean; reviews: ProductReview[] }>(
      `/api/reviews?productId=${encodeURIComponent(productId)}`
    );
    return res?.reviews || [];
  } catch (err) {
    console.error('Error al consultar opiniones en Backend API:', err);
    return [];
  }
}

export async function submitProductReview(payload: {
  productId: string;
  supplierId?: string;
  userName: string;
  userEmail?: string;
  userWallet?: string;
  rating: number;
  comment: string;
  voucherCode?: string;
  verifiedPurchase?: boolean;
}): Promise<ProductReview> {
  const res = await apiClient.post<{ success: boolean; review: ProductReview; error?: string }>(
    '/api/reviews',
    payload
  );

  if (res?.review) {
    return res.review;
  }
  throw new Error(res?.error || 'No se pudo guardar la calificación en el servidor.');
}

export async function recalculateProductRating(_productId: string) {
  // Server automatically recalculates product rating upon review insertion in /api/reviews
}

export async function fetchSupplierReviews(_supplierId?: string): Promise<ProductReview[]> {
  try {
    const res = await apiClient.get<{ success: boolean; reviews: ProductReview[] }>(
      '/api/supplier/reviews'
    );
    return res?.reviews || [];
  } catch (err) {
    console.error('Error al consultar opiniones del proveedor en Backend API:', err);
    return [];
  }
}
