import type { TableItem } from '../types/invoiceTable';

export const ItemsTable = ({ items }: { items: TableItem[] }) => {
  const total = items.reduce((sum, it) => sum + it.qty * (it.price?.value || 0), 0);

  const weight = items.reduce((sum, it) => sum + (it.weight || 0.3) * it.qty, 0);

  const currency = items.find((it) => it.price?.currency)?.price?.currency || '';

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <strong>DESCRIPTION OF GOODS:</strong>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th>#</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Origin</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{it.name}</td>
                <td>{it.qty}</td>

                <td>{it.price?.raw ?? '—'}</td>

                <td>
                  {it.price ? `${(it.qty * it.price.value).toFixed(2)} ${it.price.currency}` : '—'}
                </td>

                <td>{it.origin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'right', marginBottom: 20 }}>
        <strong>
          Total: {total.toFixed(2)} {currency}
        </strong>
      </div>

      <div>
        <div>
          <strong>Country of Origin:</strong> {items[0]?.origin || 'China'}
        </div>
        <div>
          <strong>HS Code:</strong> {items[0]?.hsCode || 'N/A'}
        </div>
        <div>
          <strong>Weight:</strong> {weight.toFixed(2)} kg ({(weight * 2.20462).toFixed(2)} lbs)
        </div>
      </div>
    </>
  );
};
