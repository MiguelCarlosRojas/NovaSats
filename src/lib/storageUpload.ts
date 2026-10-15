import { apiClient } from './apiClient';

/**
 * Renderiza la imagen en canvas con escalado y calidad WebP ultra-reducida
 */
function renderToWebpBlob(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(null);
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Compresión ultra-reducida client-side:
 * Reduce al mínimo absoluto el peso del archivo (promedio 3KB a 9KB)
 * mediante escalado geométrico y codificación WebP ultra-optimizada.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 520,
  maxHeight = 520,
  quality = 0.48
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Escalar al tamaño óptimo para la tienda
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Pasada 1 de ultra-compresión
      let blob = await renderToWebpBlob(img, width, height, quality);

      // Pasada 2 adicional de ultra-reducción si supera los 15KB
      if (blob && blob.size > 15 * 1024) {
        const ultraMax = 440;
        let uWidth = width;
        let uHeight = height;
        if (uWidth > ultraMax || uHeight > ultraMax) {
          const uRatio = Math.min(ultraMax / uWidth, ultraMax / uHeight);
          uWidth = Math.round(uWidth * uRatio);
          uHeight = Math.round(uHeight * uRatio);
        }
        const pass2 = await renderToWebpBlob(img, uWidth, uHeight, 0.38);
        if (pass2 && pass2.size < blob.size) {
          blob = pass2;
        }
      }

      if (!blob) {
        resolve(file);
        return;
      }

      resolve(blob.size < file.size ? blob : file);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo procesar la imagen: ' + err));
    };

    img.src = objectUrl;
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Procesa la imagen con máxima reducción de peso y la sube mediante el Backend seguro.
 * Devuelve la URL pública permanente en la nube.
 */
export async function uploadProductImageToStorage(file: File): Promise<string> {
  if (!file) {
    throw new Error('No se seleccionó ningún archivo de imagen');
  }

  // 1. Compresión ultra-reducida silenciosa en cliente (reduce a 3-9KB para internet lento)
  const compressedBlob = await compressImageFile(file);
  const base64Data = await blobToBase64(compressedBlob);

  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 24);

  // 2. Subida segura a través del Backend API
  const res = await apiClient.post<{ success: boolean; url: string; error?: string }>(
    '/api/supplier/storage/upload',
    {
      base64Data,
      fileName: `${cleanBaseName}.webp`,
      contentType: 'image/webp',
    }
  );

  if (res?.url) {
    return res.url;
  }

  throw new Error(res?.error || 'Error en el servidor al subir la imagen');
}

/**
 * Elimina una imagen a través del Backend seguro para proteger las credenciales.
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  if (!imageUrl || typeof imageUrl !== 'string') return false;

  try {
    const res = await apiClient.post<{ success: boolean; error?: string }>(
      '/api/supplier/storage/delete',
      { imageUrl }
    );
    return Boolean(res?.success);
  } catch (err) {
    console.error('Error al solicitar eliminación de imagen en Backend API:', err);
    return false;
  }
}
