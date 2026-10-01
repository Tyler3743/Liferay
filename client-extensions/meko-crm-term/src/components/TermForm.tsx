import React, { useState } from 'react';
import { createTerm } from '../services/TermService.ts';

interface TermFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const TermForm: React.FC<TermFormProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        startDate: '',
        endDate: '',
        type: 'Quarterly'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createTerm(formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Lỗi khi tạo học kỳ:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Tạo học kỳ mới</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">Tên học kỳ <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required 
                                placeholder="VD: Quý 1 - 2027 (Mùa Xuân)" 
                                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 outline-none transition-colors" 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Mã học kỳ <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required 
                                    placeholder="VD: HK-27Q1" 
                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 outline-none transition-colors" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Loại học kỳ</label>
                                <select 
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 outline-none transition-colors"
                                >
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Semester">Semester</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Ngày bắt đầu <span className="text-red-500">*</span></label>
                                <input 
                                    type="date" 
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required 
                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 outline-none transition-colors" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Ngày kết thúc <span className="text-red-500">*</span></label>
                                <input 
                                    type="date" 
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required 
                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 outline-none transition-colors" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={isSubmitting} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors shadow-sm shadow-red-200 disabled:opacity-50">
                            {isSubmitting ? 'Đang tạo...' : 'Tạo học kỳ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TermForm;
