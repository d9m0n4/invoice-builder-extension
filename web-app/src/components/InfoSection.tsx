import { EditableField } from './EditableField';

interface InfoSectionProps {
  title: string;
  fields: Array<{
    key: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text';
  }>;
}

export const InfoSection = ({ title, fields }: InfoSectionProps) => (
  <div style={{ width: '48%' }}>
    <strong>{title}:</strong>
    <div style={{ marginTop: '5px', padding: '10px', border: '1px solid #eee' }}>
      {fields.map((field) => (
        <EditableField
          key={field.key}
          label={field.label}
          value={field.value}
          onChange={field.onChange}
          type={field.type}
        />
      ))}
    </div>
  </div>
);
