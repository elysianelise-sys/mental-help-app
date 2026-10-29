import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { read, write } from '../data/storage';

export type Purchase = {
  id: string;
  days: number;
  original: number;
  price: number;
  discount: number;
  purchasedAt: string;
};

type PurchaseContextValue = {
  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id' | 'purchasedAt'>) => boolean;
};

const STORAGE_KEY = 'mh.purchases.v1';
const PurchaseContext = createContext<PurchaseContextValue | null>(null);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>(() => read(STORAGE_KEY, []));

  const addPurchase = useCallback<PurchaseContextValue['addPurchase']>(
    (purchase) => {
      const next = [
        ...purchases,
        {
          ...purchase,
          id: globalThis.crypto?.randomUUID?.() ?? `purchase-${Date.now()}`,
          purchasedAt: new Date().toISOString(),
        },
      ];
      if (!write(STORAGE_KEY, next)) return false;
      setPurchases(next);
      return true;
    },
    [purchases],
  );

  const value = useMemo(() => ({ purchases, addPurchase }), [purchases, addPurchase]);
  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchases() {
  const value = useContext(PurchaseContext);
  if (!value) throw new Error('usePurchases must be used within PurchaseProvider');
  return value;
}
