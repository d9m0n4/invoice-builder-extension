export interface Price {
  value: number;
  currency: string;
  raw: string;
}

export interface TableItem {
  name: string;
  qty: number;
  price: Price | null;
  origin: string;
  weight?: number;
  hsCode?: string;
}
