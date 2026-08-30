import type { FieldDefinition } from '../adminConfig'
import styles from '../AdminApp.module.scss'

interface FormFieldProps {
  field: FieldDefinition
  value: string | number | undefined
  disabled?: boolean
  onChange: (value: string) => void
}

export function FormField({ field, value, disabled = false, onChange }: FormFieldProps) {
  const id = `field-${field.key}`
  const common = {
    id,
    value: value ?? '',
    disabled,
    required: field.required,
    placeholder: field.placeholder,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(event.target.value),
  }

  return (
    <label className={`${styles.formField} ${field.span === 2 ? styles.formFieldWide : ''}`} htmlFor={id}>
      <span>{field.label}{field.required && <em>*</em>}</span>
      {field.kind === 'textarea' ? (
        <textarea {...common} rows={5} />
      ) : field.kind === 'select' ? (
        <select {...common}>
          {(field.options || []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : (
        <input {...common} type={field.kind === 'number' ? 'number' : field.kind === 'url' ? 'url' : 'text'} />
      )}
      {field.help && <small>{field.help}</small>}
    </label>
  )
}
