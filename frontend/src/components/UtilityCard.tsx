import { useState } from 'react';

interface Field {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea';
}

interface UtilityCardProps {
  title: string;
  description: string;
  onSubmit: (input: string, fields?: Record<string, string>) => Promise<string>;
  inputLabel?: string;
  resultLabel?: string;
  placeholder?: string;
  fields?: Field[];
}

const UtilityCard = ({
  title,
  description,
  onSubmit,
  inputLabel = 'Input',
  resultLabel = 'Result',
  placeholder = 'Enter text here...',
  fields
}: UtilityCardProps) => {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Normalize single field into the fields array logic
  const normalizedFields: Field[] = fields || [
    { id: 'main', label: inputLabel, placeholder, type: 'textarea' }
  ];

  const handleFieldChange = (id: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const missingFields = normalizedFields.filter(f => !fieldValues[f.id]?.trim());
    if (missingFields.length > 0) {
      setError(`Please fill: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const output = await onSubmit(fieldValues.main || '', fieldValues);
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {normalizedFields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={`${title}-${field.id}`}
                className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1"
              >
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={`${title}-${field.id}`}
                  value={fieldValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium resize-none"
                  rows={3}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  id={`${title}-${field.id}`}
                  type="text"
                  value={fieldValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-bold text-sm flex items-center justify-center space-x-2 shadow-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <span>Run {title}</span>
          )}
        </button>

        {error && (
          <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100 font-medium animate-in fade-in slide-in-from-top-1" role="alert">
            {error}
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-top-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{resultLabel}</label>
            <div className="bg-gray-900 text-blue-400 p-3 rounded-xl break-all font-mono text-[10px] leading-relaxed shadow-inner border border-gray-800 max-h-64 overflow-y-auto">
              {result}
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default UtilityCard;
