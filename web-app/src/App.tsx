/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import InvoiceForm from './InvoiceForm';

interface InvoiceData {
  items: Array<{
    name: string;
    qty: number;
    price: number;
    origin: string;
    weightKg?: number;
    weightLbs?: number;
  }>;
  siteType: string;
  url: string;
  timestamp: string;
  seller?: any;
}

export default function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDataFromURL = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        const source = urlParams.get('source');

        if (dataParam && source === 'chrome-extension') {
          const decodedData = decodeURIComponent(dataParam);
          const parsedData: InvoiceData = JSON.parse(decodedData);
          setInvoiceData(parsedData);
          console.log('Data loaded from URL:', parsedData);
        }
      } catch (error) {
        console.error('Error parsing data from URL:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDataFromURL();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!invoiceData) {
    return (
      <div style={{ color: '#000' }}>
        <h2>No invoice data received</h2>
        <p>Please go to AliExpress/eBay/Amazon cart page and click "Build Invoice" button</p>
      </div>
    );
  }

  return <InvoiceForm initial={invoiceData} />;
}
