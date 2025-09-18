/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import InvoiceForm from './InvoiceForm';

type Item = { name: string; qty: number; price: number; origin?: string; hsCode?: string };

export default function App() {
  const [data, setData] = useState<{ seller?: any; items?: Item[] } | null>(null);

  useEffect(() => {
    // Попытка 1: query param
    const q = new URLSearchParams(location.search).get('data');
    if (q) {
      try {
        setData(JSON.parse(decodeURIComponent(q)));
        return;
      } catch (e) {
        console.warn('Failed to parse query param:', e);
      }
    }

    // Попытка 2: chrome.storage (если открыт как extension page)
    if ((window as any).chrome?.storage?.local) {
      (window as any).chrome.storage.local.get('invoiceData', (res: any) => {
        if (res?.invoiceData) setData(res.invoiceData);
      });
    } else {
      // fallback: пустой шаблон
      setData({
        items: [{ name: 'Sample product', qty: 1, price: 10.0, origin: 'China' }],
        seller: { company: '', address: '', phone: '', email: '' },
      });
    }
  }, []);

  return (
    <div className="app">
      <h1>Invoice Builder — Create</h1>
      {data ? <InvoiceForm initial={data} /> : <div>Loading...</div>}
    </div>
  );
}
