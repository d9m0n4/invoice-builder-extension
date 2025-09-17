import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoiceForm({ initial }: any) {
  const printRef = useRef<HTMLDivElement | null>(null);

  const handleSavePdf = async () => {
    if (!printRef.current) return;
    const el = printRef.current;
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = (pdf as any).getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('commercial-invoice.pdf');
  };

  const total = (initial.items || []).reduce((s: number, it: any) => s + it.qty * it.price, 0);
  const weight = (initial.items || []).reduce(
    (s: number, it: any) => s + (it.weight || 0.3) * it.qty,
    0,
  );

  return (
    <div style={{ padding: 20 }}>
      {/* Кнопка для генерации PDF */}
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <button
          onClick={handleSavePdf}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}>
          Save as PDF
        </button>
      </div>

      {/* Контейнер для печати */}
      <div
        ref={printRef}
        style={{
          padding: 20,
          background: '#fff',
          color: '#000',
          border: '1px solid #ddd',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>COMMERCIAL INVOICE</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <strong>Invoice No:</strong> {initial.invoiceNumber || 'DP-US-2025-001'}
            <br />
            <strong>Date:</strong> {initial.date || new Date().toLocaleDateString()}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ width: '48%' }}>
            <strong>SHIPPER / SELLER:</strong>
            <div style={{ marginTop: '5px', padding: '10px', border: '1px solid #eee' }}>
              <div>{initial.seller?.companyName || 'Seller Company'}</div>
              <div>{initial.seller?.address || 'Seller Address'}</div>
              <div>Phone: {initial.seller?.phone || 'Seller Phone'}</div>
              <div>Email: {initial.seller?.email || 'seller@example.com'}</div>
            </div>
          </div>

          <div style={{ width: '48%' }}>
            <strong>CONSIGNEE / BUYER:</strong>
            <div style={{ marginTop: '5px', padding: '10px', border: '1px solid #eee' }}>
              <div>{initial.buyer?.name || 'Buyer Name'}</div>
              <div>{initial.buyer?.address || 'Buyer Address in USA'}</div>
              <div>Phone: {initial.buyer?.phone || 'Buyer Phone'}</div>
            </div>
          </div>
        </div>

        <hr />

        <div style={{ marginBottom: '20px' }}>
          <strong>DESCRIPTION OF GOODS:</strong>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>#</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Qty</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Unit Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Origin</th>
              </tr>
            </thead>
            <tbody>
              {(initial.items || []).map((it: any, i: number) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{i + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {it.name || 'Product Name'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{it.qty || 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    ${(it.price || 0).toFixed(2)}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    ${((it.qty || 1) * (it.price || 0)).toFixed(2)}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {it.origin || 'China'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div>
            <strong>Country of Origin:</strong> {initial.items?.[0]?.origin || 'China'}
          </div>
          <div>
            <strong>HS Code:</strong> {initial.items?.[0]?.hsCode || 'N/A'}
          </div>
          <div>
            <strong>Weight:</strong> {weight.toFixed(2)} kg ({(weight * 2.20462).toFixed(2)} lbs)
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong>REASON FOR EXPORT:</strong> ☒ Sale
        </div>

        <div style={{ marginTop: '40px' }}>
          <div>
            <strong>DECLARATION:</strong>
          </div>
          <div style={{ marginTop: '10px' }}>
            I, {initial.seller?.name || 'Authorized Person'}, authorized agent of{' '}
            {initial.seller?.companyName || 'Company Name'}, certify that this invoice is true and
            correct.
          </div>
          <div style={{ marginTop: '40px' }}>Signature: ___________________</div>
          <div style={{ marginTop: '10px' }}>
            Title: {initial.seller?.title || 'Authorized Representative'}
          </div>
          <div style={{ marginTop: '10px' }}>
            Date: {initial.date || new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
