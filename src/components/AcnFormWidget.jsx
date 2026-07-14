import { useState, useRef, useEffect } from 'react';

export default function AcnFormWidget({ payload, onSubmit }) {
  const { title, subtitle, fields = [], cta_label = 'Submit', cta_value_prefix = '' } = payload;
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    setTimeout(() => firstRef.current?.focus(), 100);
  }, []);

  const validate = () => {
    const newErrors = {};
    const currentValues = { ...values, ...valuesRef.current };
    fields.forEach((f) => {
      const val = (currentValues[f.field_id] || '').trim();
      if (f.required && !val) {
        newErrors[f.field_id] = f.validation?.error_message || 'This field is required.';
        return;
      }
      if (f.validation?.pattern && val) {
        const re = new RegExp(f.validation.pattern);
        if (!re.test(val)) newErrors[f.field_id] = f.validation.error_message || 'Invalid input.';
      }
      if (f.validation?.min_length && val.length < f.validation.min_length) {
        newErrors[f.field_id] = f.validation.error_message || 'Too short.';
      }
    });
    return newErrors;
  };

  const valuesRef = useRef({});

  const handleSubmit = () => {
    // Read from ref (always current) not state (may be stale)
    const currentValues = { ...values, ...valuesRef.current };
    console.log('[ACN] Form submit — values:', currentValues, 'fields:', fields.map(f => f.field_id));
    
    const errs = {};
    fields.forEach((f) => {
      const val = (currentValues[f.field_id] || '').trim();
      if (f.required && !val) {
        errs[f.field_id] = f.validation?.error_message || 'This field is required.';
        return;
      }
      if (f.validation?.pattern && val) {
        const re = new RegExp(f.validation.pattern);
        if (!re.test(val)) errs[f.field_id] = f.validation.error_message || 'Invalid input.';
      }
      if (f.validation?.min_length && val.length < f.validation.min_length) {
        errs[f.field_id] = f.validation.error_message || 'Too short.';
      }
    });
    
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);

    const parts = fields.map((f) => currentValues[f.field_id] || '');
    console.log('[ACN] Form parts:', parts);
    const value = cta_value_prefix
      ? `${cta_value_prefix}:${parts.join('&')}`
      : parts.join(' ');

    const isSensitive = fields.some((f) => f.type === 'tel' || f.type === 'password');
    const displayText = isSensitive ? '••••' : (parts.join(' '));

    console.log('[ACN] gecxSend value:', value);
    onSubmit(value, displayText);
  };

  return (
    <div className="acn-form-widget">
      {title && <div className="acn-form-title">{title}</div>}
      {subtitle && <div className="acn-form-subtitle">{subtitle}</div>}
      <div className="acn-form-fields">
        {fields.map((f, i) => (
          <div key={f.field_id} className="acn-form-field">
            <label className="acn-form-label">
              {f.label}{f.required && <span className="acn-form-req"> *</span>}
            </label>
            <input
              ref={i === 0 ? firstRef : null}
              className={`acn-form-input-el${errors[f.field_id] ? ' error' : ''}`}
              type={f.type === 'tel' ? 'password' : (f.type || 'text')}
              inputMode={f.type === 'tel' ? 'numeric' : undefined}
              placeholder={f.placeholder || ''}
              value={values[f.field_id] || ''}
              disabled={submitted}
              onChange={(e) => {
                const val = e.target.value;
                valuesRef.current = { ...valuesRef.current, [f.field_id]: val };
                setValues((prev) => ({ ...prev, [f.field_id]: val }));
                if (errors[f.field_id]) setErrors((prev) => ({ ...prev, [f.field_id]: '' }));
              }}
              onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
            />
            {f.hint && !errors[f.field_id] && (
              <span className="acn-form-hint">{f.hint}</span>
            )}
            {errors[f.field_id] && (
              <span className="acn-form-error">{errors[f.field_id]}</span>
            )}
          </div>
        ))}
      </div>
      <button
        className={`acn-form-cta${submitted ? ' submitted' : ''}`}
        onClick={handleSubmit}
        disabled={submitted}
      >
        {submitted ? '✓ Submitted' : cta_label}
      </button>
    </div>
  );
}
