export const SaveToPdfButton = ({ onClick }: { onClick: () => void }) => (
  <div style={{ marginBottom: 20, textAlign: 'center' }}>
    <button
      onClick={onClick}
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
);
