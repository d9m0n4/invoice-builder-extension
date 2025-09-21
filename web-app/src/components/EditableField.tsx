import { useState, useRef, useEffect } from 'react';

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
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    setIsEditing(false);
    if (divRef.current) {
      onChange(divRef.current.textContent || '');
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (divRef.current && divRef.current.textContent !== value) {
      divRef.current.textContent = value;
    }
  }, [value]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '5px',
      }}>
      {label && (
        <span
          style={{
            whiteSpace: 'nowrap',
            marginRight: '5px',
          }}>
          {label}:
        </span>
      )}

      <div
        ref={divRef}
        contentEditable
        onBlur={handleBlur}
        onFocus={handleFocus}
        suppressContentEditableWarning={true}
        style={{
          padding: '4px 8px',
          borderRadius: '3px',
          minWidth: minWidth || '120px',
          flex: 1,
          border: isEditing ? '1px solid #007bff' : '1px solid transparent',
          minHeight: type === 'textarea' ? '60px' : '28px',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          outline: 'none',
          backgroundColor: isEditing ? '#fff' : 'transparent',
          cursor: 'text',
          ...(type === 'textarea' && {
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }),
        }}
        {...(placeholder && !value && { 'data-placeholder': placeholder })}
      />

      {/* CSS для placeholder */}
      <style>
        {`
          [data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #999;
            font-style: italic;
          }
        `}
      </style>
    </div>
  );
};
