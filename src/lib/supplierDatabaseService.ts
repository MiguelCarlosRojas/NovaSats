import { apiClient } from './apiClient';

// ============================================================================
// 1. REGISTRO DE INFORMACIÓN FISCAL Y CUMPLIMIENTO (KYC PROVEEDORES)
// ============================================================================
export interface SupplierKycFiscal {
  id?: string;
  supplier_id: string;
  legal_name: string; // Razón Social / Nombre Legal Registrado
  tax_id: string; // RUC / Tax ID / NIF
  country: string; // País o Jurisdicción Legal
  business_address: string; // Domicilio Fiscal Registrado
  legal_representative_name: string; // Representante Legal
  legal_representative_id_doc: string; // DNI / Cédula / Pasaporte
  tax_resolution: string; // Resolución o Autorización SUNAT
  official_receipt_type: string; // Tipo de Comprobante Oficial
  fiscal_email: string; // Correo de Notificaciones Fiscales / Facturación
  fiscal_phone: string; // Teléfono Fiscal Oficial
  is_verified: boolean; // Estado de Verificación Oficial
  verified_at?: string | null;
  verification_hash?: string | null;
  terms_accepted: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_KYC_FISCAL: Omit<SupplierKycFiscal, 'supplier_id'> = {
  legal_name: '',
  tax_id: '',
  country: '',
  business_address: '',
  legal_representative_name: '',
  legal_representative_id_doc: '',
  tax_resolution: '',
  official_receipt_type: '',
  fiscal_email: '',
  fiscal_phone: '',
  is_verified: false,
  verified_at: null,
  verification_hash: null,
  terms_accepted: false,
};

export async function fetchSupplierKycFiscal(supplierId: string): Promise<SupplierKycFiscal> {
  try {
    const res = await apiClient.get<{ success: boolean; kyc: SupplierKycFiscal | null }>('/api/supplier/kyc');
    if (res?.kyc) {
      return res.kyc;
    }
    return { ...DEFAULT_KYC_FISCAL, supplier_id: supplierId };
  } catch (err) {
    console.error('Error fetching KYC fiscal data from Backend API:', err);
    return { ...DEFAULT_KYC_FISCAL, supplier_id: supplierId };
  }
}

export async function saveSupplierKycFiscal(
  _supplierId: string,
  payload: Partial<SupplierKycFiscal>
): Promise<{ success: boolean; data?: SupplierKycFiscal; error?: string }> {
  try {
    const res = await apiClient.post<{ success: boolean; kyc: SupplierKycFiscal; error?: string }>(
      '/api/supplier/kyc',
      payload
    );

    if (res?.success && res.kyc) {
      return { success: true, data: res.kyc };
    }
    return { success: false, error: res?.error || 'Error al guardar datos fiscales' };
  } catch (err: any) {
    console.error('Unexpected error saving KYC fiscal data:', err);
    return { success: false, error: err.message || 'Error de conexión con el backend' };
  }
}

// ============================================================================
// 2. DATOS COMERCIALES DE LA EMPRESA / MARCA (PÚBLICOS Y DE TIENDA)
// ============================================================================
export interface SupplierCommercialProfile {
  id?: string;
  supplier_id: string;
  brand_name: string; // Nombre Comercial de la Marca
  commercial_activity: string; // Giro Comercial / Actividad Económica
  website_url: string; // Sitio Web Oficial o Tienda Online
  support_email: string; // Correo de Soporte al Cliente
  customer_phone: string; // Teléfono Comercial
  whatsapp_number: string; // WhatsApp de Contacto Directo
  commercial_address: string; // Dirección Comercial / Tienda o Almacén
  social_twitter?: string; // Redes Sociales
  social_telegram?: string;
  social_discord?: string;
  commercial_description: string; // Descripción Comercial de la Marca
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_COMMERCIAL_PROFILE: Omit<SupplierCommercialProfile, 'supplier_id'> = {
  brand_name: '',
  commercial_activity: '',
  website_url: '',
  support_email: '',
  customer_phone: '',
  whatsapp_number: '',
  commercial_address: '',
  social_twitter: '',
  social_telegram: '',
  social_discord: '',
  commercial_description: '',
};

export async function fetchSupplierCommercialProfile(supplierId: string): Promise<SupplierCommercialProfile> {
  try {
    const res = await apiClient.get<{ success: boolean; profile: SupplierCommercialProfile | null }>(
      '/api/supplier/commercial-profile'
    );

    if (res?.profile) {
      return res.profile;
    }

    return {
      ...DEFAULT_COMMERCIAL_PROFILE,
      supplier_id: supplierId,
    };
  } catch (err) {
    console.error('Error fetching commercial profile from Backend API:', err);
    return { ...DEFAULT_COMMERCIAL_PROFILE, supplier_id: supplierId };
  }
}

export async function saveSupplierCommercialProfile(
  _supplierId: string,
  payload: Partial<SupplierCommercialProfile>
): Promise<{ success: boolean; data?: SupplierCommercialProfile; error?: string }> {
  try {
    const res = await apiClient.post<{ success: boolean; profile: SupplierCommercialProfile; error?: string }>(
      '/api/supplier/commercial-profile',
      payload
    );

    if (res?.success && res.profile) {
      return { success: true, data: res.profile };
    }
    return { success: false, error: res?.error || 'Error al guardar perfil comercial' };
  } catch (err: any) {
    console.error('Unexpected error saving commercial profile in Backend API:', err);
    return { success: false, error: err.message || 'Error de conexión con el backend' };
  }
}

// ============================================================================
// 3. BILLETERAS DE RECAUDACIÓN (SUBTABLA supplier_wallets)
// ============================================================================
export interface SupplierWalletRecord {
  id: string;
  supplier_id: string;
  address?: string;
  wallet_address?: string;
  label: string;
  network: string;
  is_primary: boolean;
  added_at: string;
  created_at?: string;
}

export async function fetchSupplierWallets(_supplierId?: string): Promise<SupplierWalletRecord[]> {
  try {
    const res = await apiClient.get<{ success: boolean; wallets: any[] }>('/api/supplier/wallets');
    if (res?.wallets) {
      return res.wallets.map((w: any) => ({
        ...w,
        address: w.address || w.wallet_address || '',
      }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching supplier wallets from Backend API:', err);
    return [];
  }
}

export async function saveSupplierWallets(
  supplierId: string,
  wallets: Array<{ id?: string; address: string; label: string; network: string; isPrimary: boolean; addedAt?: string }>
): Promise<{ success: boolean; data?: SupplierWalletRecord[]; error?: string }> {
  try {
    const formatted = wallets.map((w) => ({
      wallet_address: w.address,
      label: w.label,
      network: w.network,
      is_primary: Boolean(w.isPrimary),
      added_at: w.addedAt || new Date().toISOString(),
    }));

    const res = await apiClient.post<{ success: boolean; error?: string }>('/api/supplier/wallets', formatted);
    if (res?.success) {
      return {
        success: true,
        data: wallets.map((w, idx) => ({
          id: w.id || `wallet-${idx}`,
          supplier_id: supplierId,
          address: w.address,
          label: w.label,
          network: w.network,
          is_primary: Boolean(w.isPrimary),
          added_at: w.addedAt || new Date().toISOString(),
        })),
      };
    }
    return { success: false, error: res?.error || 'Error al guardar billeteras' };
  } catch (err: any) {
    console.error('Unexpected error saving supplier wallets:', err);
    return { success: false, error: err.message || 'Error al guardar billeteras' };
  }
}

// ============================================================================
// 4. CONFIGURACIÓN DE FORMATOS DE VOUCHER (supplier_voucher_configs)
// ============================================================================
export interface SupplierVoucherConfigRecord {
  id?: string;
  supplier_id: string;
  allow_80mm: boolean;
  allow_digital: boolean;
  default_format: '80mm' | 'digital';
  created_at?: string;
  updated_at?: string;
}

export async function fetchSupplierVoucherConfig(supplierId: string): Promise<SupplierVoucherConfigRecord> {
  try {
    const res = await apiClient.get<{ success: boolean; config: SupplierVoucherConfigRecord | null }>(
      '/api/supplier/voucher-config'
    );

    if (res?.config) {
      return res.config;
    }

    return {
      supplier_id: supplierId,
      allow_80mm: true,
      allow_digital: true,
      default_format: '80mm',
    };
  } catch {
    return {
      supplier_id: supplierId,
      allow_80mm: true,
      allow_digital: true,
      default_format: '80mm',
    };
  }
}

export async function saveSupplierVoucherConfig(
  _supplierId: string,
  config: { allow80mm: boolean; allowDigital: boolean; defaultFormat?: '80mm' | 'digital' }
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await apiClient.post<{ success: boolean; error?: string }>(
      '/api/supplier/voucher-config',
      {
        allow_80mm: config.allow80mm,
        allow_digital: config.allowDigital,
        default_format: config.defaultFormat || '80mm',
      }
    );

    if (res?.success) {
      return { success: true };
    }
    return { success: false, error: res?.error || 'Error al actualizar configuración de voucher.' };
  } catch (err: any) {
    console.error('Unexpected error saving voucher config in Backend API:', err);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// 5. CAMBIO DE CONTRASEÑA EN EL SERVIDOR (/api/auth/change-password)
// ============================================================================
export async function changeSupplierPassword(
  _supplierId: string,
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (newPass.length < 8) {
      return { success: false, error: 'La nueva contraseña debe tener un mínimo de 8 caracteres.' };
    }

    const res = await apiClient.post<{ success: boolean; message?: string; error?: string }>(
      '/api/auth/change-password',
      {
        currentPassword: currentPass,
        newPassword: newPass,
      }
    );

    if (res?.success) {
      return { success: true };
    }
    return { success: false, error: res?.error || 'Error al actualizar la contraseña.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error inesperado al cambiar contraseña.' };
  }
}

// ============================================================================
// 6. NOTIFICACIONES LEÍDAS (/api/supplier/notifications)
// ============================================================================
export async function fetchSupplierReadNotificationIds(_supplierId?: string): Promise<string[]> {
  try {
    const res = await apiClient.get<{ success: boolean; readIds: string[] }>('/api/supplier/notifications');
    return res?.readIds || [];
  } catch {
    return [];
  }
}

export async function markSupplierNotificationAsReadInDb(_supplierId: string, notificationId: string): Promise<void> {
  try {
    await apiClient.post('/api/supplier/notifications', [notificationId]);
  } catch {}
}

export async function markAllSupplierNotificationsAsReadInDb(_supplierId: string, notificationIds: string[]): Promise<void> {
  try {
    await apiClient.post('/api/supplier/notifications', notificationIds);
  } catch {}
}
