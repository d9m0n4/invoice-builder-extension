/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    if (initial) {
      initializeForm(initial);
    }
  }, [initial, initializeForm]);

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
          border: '1px solid #ddd',
        }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>COMMERCIAL INVOICE</h2>

        {/* Invoice Number and Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <EditableField
              label="Invoice No"
              value={invoiceNumber}
              onChange={(value) => setField('invoiceNumber', value)}
            />
            <EditableField
              label="Date"
              value={date}
              onChange={(value) => setField('date', value)}
            />
          </div>
        </div>

        {/* Seller and Buyer Sections */}
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
            onChange={(value) => setField('declaration', value)}
            type="textarea"
          />

          <div style={{ marginTop: '40px' }}>Signature: ___________________</div>

          <EditableField
            label="Title"
            value={seller.title}
            onChange={(value) => setNestedField('seller', 'title', value)}
            minWidth="150px"
          />

          <EditableField
            label="Date"
            value={date}
            onChange={(value) => setField('date', value)}
            minWidth="100px"
          />
        </div>
      </div>
    </div>
  );
}
