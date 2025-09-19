interface ItemsTableProps {
  items: Array<{
    name: string;
    qty: number;
    price: number;
    origin: string;
    weight?: number;
    hsCode?: string;
  }>;
}

export const ItemsTable = ({ items }: ItemsTableProps) => {
  const total = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const weight = items.reduce((sum, it) => sum + (it.weight || 0.3) * it.qty, 0);

  return (
    <>
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
            {items.map((it, i) => (
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
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{it.origin || 'China'}</td>
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
