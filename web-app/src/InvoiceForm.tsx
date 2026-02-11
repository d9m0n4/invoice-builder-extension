/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { SaveToPdfButton } from './components/SaveToPDFButton';
import { EditableField } from './components/EditableField';
import { InfoSection } from './components/InfoSection';
import { ItemsTable } from './components/ItemsTable';
import { useInvoiceStore } from './store';

export default function InvoiceForm({ initial }: any) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const {
    invoiceNumber,
    date,
    seller,
    buyer,
    items,
    declaration,
    setField,
    setNestedField,
    initializeForm,
  } = useInvoiceStore();

  useEffect(() => {
    if (initial) initializeForm(initial);
  }, [initial, initializeForm]);

  const handleSavePdf = () => {
    if (!printRef.current) return;
    const el = printRef.current;

    const opt = {
      margin: 5, // мм
      filename: 'commercial-invoice.pdf',
      image: { type: '', quality: 1 },
      html2canvas: { scale: 2, logging: true, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: 'tr, .no-break' },
    } as any;

    html2pdf().set(opt).from(el).save();
  };

  return (
    <div style={{ padding: 20 }}>
      <SaveToPdfButton onClick={handleSavePdf} />

      <div
        ref={printRef}
        style={{
          padding: 20,
          background: '#fff',
          color: '#000',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>COMMERCIAL INVOICE</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <EditableField
              label="Invoice No"
              value={invoiceNumber}
              onChange={(v) => setField('invoiceNumber', v)}
            />
            <EditableField label="Date" value={date} onChange={(v) => setField('date', v)} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <InfoSection
            title="SHIPPER / SELLER"
            fields={[
              {
                key: 'companyName',
                label: 'Company Name',
                value: seller.companyName,
                onChange: (v) => setNestedField('seller', 'companyName', v),
              },
              {
                key: 'address',
                label: 'Address',
                value: seller.address,
                onChange: (v) => setNestedField('seller', 'address', v),
              },
              {
                key: 'phone',
                label: 'Phone',
                value: seller.phone,
                onChange: (v) => setNestedField('seller', 'phone', v),
              },
              {
                key: 'email',
                label: 'Email',
                value: seller.email,
                onChange: (v) => setNestedField('seller', 'email', v),
              },
            ]}
          />
          <InfoSection
            title="CONSIGNEE / BUYER"
            fields={[
              {
                key: 'name',
                label: 'Name',
                value: buyer.name,
                onChange: (v) => setNestedField('buyer', 'name', v),
              },
              {
                key: 'address',
                label: 'Address',
                value: buyer.address,
                onChange: (v) => setNestedField('buyer', 'address', v),
              },
              {
                key: 'phone',
                label: 'Phone',
                value: buyer.phone,
                onChange: (v) => setNestedField('buyer', 'phone', v),
              },
            ]}
          />
        </div>

        <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

        <ItemsTable items={items} />

        <div style={{ marginBottom: '20px' }}>
          <strong>REASON FOR EXPORT:</strong> ☒ Sale
        </div>

        <div style={{ marginTop: '40px' }}>
          <div>
            <strong>DECLARATION:</strong>
          </div>
          <EditableField
            label=""
            value={declaration}
            onChange={(v) => setField('declaration', v)}
            type="textarea"
          />
          <div style={{ marginTop: '40px' }}>Signature: ___________________</div>
          <EditableField
            label="Title"
            value={seller.title}
            onChange={(v) => setNestedField('seller', 'title', v)}
            minWidth="150px"
          />
          <EditableField
            label="Date"
            value={date}
            onChange={(v) => setField('date', v)}
            minWidth="100px"
          />
        </div>
      </div>
    </div>
  );
}
