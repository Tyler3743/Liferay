import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface BaseSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  placeholder?: string;
  error?: string;
}

export const BaseSelect: React.FC<BaseSelectProps> = ({ label, options, placeholder, error, required, ...props }) => {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-900 block mb-1">
        {label} {required && <span className="text-brand-primary">*</span>}
      </label>
      <select
        className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary bg-white"
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-brand-primary text-xs mt-1 block">{error}</span>}
    </div>
  );
};
