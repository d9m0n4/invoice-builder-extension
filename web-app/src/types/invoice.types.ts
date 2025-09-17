export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  weight: number; // в кг
  hsCode?: string;
  countryOfOrigin: string;
  productUrl?: string;
}

export interface CompanyInfo {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  taxId?: string;
}

export interface InvoiceData {
  // Мета информация
  invoiceNumber: string;
  date: string;

  // Участники
  shipper: CompanyInfo;
  consignee: CompanyInfo;

  // Товары
  items: InvoiceItem[];

  // Дополнительные данные
  currency: string;
  totalValue: number;
  totalWeight: number;
  reasonForExport: 'Sale' | 'Gift' | 'Sample' | 'Return' | 'Other';
  specialInstructions?: string;

  // Декларация
  declarationName: string;
  declarationTitle: string;
  declarationDate: string;
}

export interface ParsedProductData {
  platform: string;
  productName: string;
  price: number;
  currency: string;
  quantity: number;
  weight?: number;
  specifications?: Record<string, string>;
  images?: string[];
  productUrl: string;
  countryOfOrigin?: string;
}

export interface ParserConfig {
  platform: string;
  selectors: {
    productName: string[];
    price: string[];
    currency: string[];
    quantity: string[];
    weight: string[];
    specifications: string[];
    countryOfOrigin: string[];
  };
  transformations: {
    cleanProductName: (name: string) => string;
    parsePrice: (price: string) => number;
    parseWeight: (weight: string) => number;
  };
}
