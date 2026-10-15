import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Supplier } from '../types/store';
import { apiClient } from '../lib/apiClient';
import { getSupplierSession, setSupplierSession, clearSupplierSession } from '../lib/cookieSession';

interface SupplierContextType {
  supplier: Supplier | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<Supplier> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSupplier: () => Promise<void>;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(() => getSupplierSession());
  const [loading, setLoading] = useState(false);

  // Sync memory supplier state to cookie session for instant page refreshes
  useEffect(() => {
    if (supplier) {
      setSupplierSession(supplier);
    } else {
      clearSupplierSession();
    }
  }, [supplier]);

  // Verify JWT session with backend on initial load and keep in sync
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const res = await apiClient.get<{ authenticated: boolean; supplier: Supplier | null }>('/api/auth/me');
        if (isMounted) {
          if (res?.authenticated && res.supplier) {
            setSupplier(res.supplier);
          } else {
            setSupplier(null);
          }
        }
      } catch {
        // If offline or network slow, keep current optimistic session
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const res = await apiClient.post<{ success: boolean; supplier?: Supplier; error?: string }>('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      setLoading(false);

      if (res?.success && res.supplier) {
        setSupplier(res.supplier);
        return { success: true };
      }

      return { success: false, error: res?.error || 'Credenciales inválidas.' };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Error al iniciar sesión con el backend.' };
    }
  };

  const register = async (data: Partial<Supplier> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const res = await apiClient.post<{ success: boolean; supplier?: Supplier; error?: string }>('/api/auth/register', data);

      setLoading(false);

      if (res?.success && res.supplier) {
        setSupplier(res.supplier);
        return { success: true };
      }

      return { success: false, error: res?.error || 'Error al registrar proveedor.' };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Error al registrarse con el backend.' };
    }
  };

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout', {});
    } catch {
      // ignore network errors on logout
    } finally {
      setSupplier(null);
      clearSupplierSession();
    }
  }, []);

  const refreshSupplier = async () => {
    try {
      const res = await apiClient.get<{ authenticated: boolean; supplier: Supplier | null }>('/api/auth/me');
      if (res?.authenticated && res.supplier) {
        setSupplier(res.supplier);
      }
    } catch {
      // ignore
    }
  };

  return (
    <SupplierContext.Provider
      value={{
        supplier,
        loading,
        login,
        register,
        logout,
        refreshSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplier must be used within a SupplierProvider');
  }
  return context;
};
