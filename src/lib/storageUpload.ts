import { supabase } from './supabaseClient';

// El nombre del bucket se obtiene estrictamente de las variables de entorno (.env) sin valores por defecto
export const BUCKET_NAME: string = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;

export function getBucketName(): string {
  if (!BUCKET_NAME) {
    throw new Error('Variable de entorno VITE_SUPABASE_STORAGE_BUCKET no configurada en el archivo .env');
  }
  return BUCKET_NAME;
}

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

/**
 * Procesa la imagen con máxima reducción de peso y la sube al bucket de Supabase.
 * Devuelve la URL pública permanente en la nube.
 */
export async function uploadProductImageToStorage(file: File): Promise<string> {
  if (!file) {
    throw new Error('No se seleccionó ningún archivo de imagen');
  }

  const bucket = getBucketName();

  // 1. Compresión ultra-reducida silenciosa
  const compressedBlob = await compressImageFile(file);

  // 2. Nombre limpio y único
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 24);

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const filePath = `products/${timestamp}_${randomSuffix}_${cleanBaseName}.webp`;

  // 3. Subir archivo a Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, compressedBlob, {
      cacheControl: '31536000',
      upsert: true,
      contentType: 'image/webp'
    });

  if (error) {
    console.error('Error al subir imagen a Supabase Storage:', error);
    throw new Error(`Error en el almacenamiento en la nube: ${error.message}`);
  }

  // 4. Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * Elimina una imagen directamente del Bucket Público en Supabase Storage
 * para liberar almacenamiento en la nube cuando el proveedor la descarta.
 * 
 * @param imageUrl URL pública completa de la imagen almacenada
 * @returns true si se eliminó de Supabase Storage, false si no pertenecía al bucket
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  if (!imageUrl || typeof imageUrl !== 'string') return false;

  const bucket = getBucketName();
  const prefix = `/storage/v1/object/public/${bucket}/`;
  const index = imageUrl.indexOf(prefix);
  if (index === -1) {
    return false;
  }

  const filePath = imageUrl.substring(index + prefix.length);
  if (!filePath) return false;

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error('Error eliminando archivo de Supabase Storage:', error);
    throw new Error(`Error eliminando archivo de la nube: ${error.message}`);
  }

  return true;
}
