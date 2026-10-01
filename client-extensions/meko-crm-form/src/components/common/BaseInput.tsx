import React from 'react';

// Định nghĩa Props kết hợp với các thuộc tính mặc định của thẻ input HTML
interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const BaseInput: React.FC<BaseInputProps> = ({ label, error, required, ...props }) => {
    return (
        <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">
                {label} {required && <span className="text-brand-primary">*</span>}
            </label>
            <input
                className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary"
                {...props}
            />
            {error && <span className="text-brand-primary text-xs mt-1 block">{error}</span>}
        </div>
    );
};