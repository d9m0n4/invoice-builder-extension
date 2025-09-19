interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea';
  placeholder?: string;
  minWidth?: string;
}

export const EditableField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  minWidth,
}: EditableFieldProps) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', minHeight: '28px' }}>
    {label && (
      <span style={{ whiteSpace: 'nowrap', marginRight: '5px', lineHeight: '28px' }}>{label}:</span>
    )}
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '8px',
          borderRadius: '4px',
          minHeight: '60px',
          width: '100%',
          minWidth: minWidth,
          resize: 'vertical',
        }}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '2px 5px',
          borderRadius: '3px',
          minWidth: minWidth || '120px',
          flex: 1,
          height: '28px',
        }}
      />
    )}
  </div>
);
