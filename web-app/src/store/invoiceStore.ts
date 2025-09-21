/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface Seller {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  name: string;
  title: string;
}

interface Buyer {
  name: string;
  address: string;
  phone: string;
}

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
  origin: string;
  weight?: number;
  hsCode?: string;
}

interface InvoiceFormState {
  invoiceNumber: string;
  date: string;
  seller: Seller;
  buyer: Buyer;
  items: InvoiceItem[];
  declaration: string;

  setField: (field: string, value: any) => void;
  setNestedField: (parent: 'seller' | 'buyer', field: string, value: any) => void;
  initializeForm: (initialData: Partial<InvoiceFormState>) => void;
}

const initialSeller: Seller = {
  companyName: 'Seller Company',
  address: 'Seller Address',
  phone: 'Seller Phone',
  email: 'seller@example.com',
  name: 'Authorized Person',
  title: 'Authorized Representative',
};

const initialBuyer: Buyer = {
  name: 'Buyer Name',
  address: 'Buyer Address in USA',
  phone: 'Buyer Phone',
};

export const useInvoiceStore = create<InvoiceFormState>((set) => ({
  invoiceNumber: 'DP-US-2025-001',
  date: new Date().toLocaleDateString(),
  seller: { ...initialSeller },
  buyer: { ...initialBuyer },
  items: [],
  declaration: `I, ${initialSeller.name}, authorized agent of ${initialSeller.companyName}, certify that this invoice is true and correct.`,

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),

  setNestedField: (parent, field, value) =>
    set((state) => ({
      ...state,
      [parent]: {
        ...state[parent],
        [field]: value,
      },
    })),

  initializeForm: (initialData) =>
    set((state) => {
      const newSeller = initialData.seller
        ? { ...initialSeller, ...initialData.seller }
        : initialSeller;
      const newBuyer = initialData.buyer ? { ...initialBuyer, ...initialData.buyer } : initialBuyer;

      return {
        ...state,
        ...initialData,
        seller: newSeller,
        buyer: newBuyer,
        declaration:
          initialData.declaration ||
          `I, ${newSeller.name}, authorized agent of ${newSeller.companyName}, certify that this invoice is true and correct.`,
      };
    }),
}));
