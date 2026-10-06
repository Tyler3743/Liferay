import React from 'react';

interface BaseTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const BaseTextarea: React.FC<BaseTextareaProps> = ({ label, error, required, ...props }) => {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-900 block mb-1">
        {label} {required && <span className="text-brand-primary">*</span>}
      </label>
      <textarea
        className="border border-gray-300 rounded-md p-2 w-full resize-none outline-none focus:border-brand-primary"
        {...props}
      />
      {error && <span className="text-brand-primary text-xs mt-1 block">{error}</span>}
    </div>
  );
};
