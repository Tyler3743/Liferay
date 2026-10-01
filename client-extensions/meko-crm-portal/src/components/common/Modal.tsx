import React from 'react';

interface ModalProps {
  isOpen: boolean;
  icon?: string;
  title: string;
  description: string;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, icon = '✅', title, description, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full text-center">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 text-sm">{description}</p>
            <button
                onClick={onClose}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 w-full transition-colors"
            >
                Đóng
            </button>
        </div>
    </div>
  );
};
