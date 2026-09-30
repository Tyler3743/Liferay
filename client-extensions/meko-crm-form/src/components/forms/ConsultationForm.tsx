import React, { useState } from 'react';
import { LeadRequest, type ILeadData } from '../../models/LeadRequest';
import { FormService } from '../../services/FormService';
import { Modal } from '../common/Modal';

export const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState<ILeadData>({
    leadName: '', leadEmail: '', leadPhone: '', courseId: '',
    expectedResult: '', leadBirthday: '', freeTime: '', leadNote: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, icon: '', title: '', desc: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.leadName.trim()) newErrors.leadName = 'Họ tên không được để trống';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadEmail)) newErrors.leadEmail = 'Email không hợp lệ';
    if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.leadPhone)) newErrors.leadPhone = 'Số điện thoại không hợp lệ';
    if (!formData.courseId) newErrors.courseId = 'Vui lòng chọn khóa học';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Khởi tạo đối tượng OOP
    const requestObject = new LeadRequest(formData);

    // Gọi Service
    const response = await FormService.submitLead(requestObject);

    setIsLoading(false);
    if (response.success) {
      setModalState({ isOpen: true, icon: '✅', title: 'Thành Công!', desc: response.message });
      // Reset form sau khi gửi
      setFormData({ leadName: '', leadEmail: '', leadPhone: '', courseId: '', expectedResult: '', leadBirthday: '', freeTime: '', leadNote: '' });
    } else {
      setModalState({ 
        isOpen: true, 
        icon: '⚠️', 
        title: 'Đăng ký thất bại!', 
        desc: response.message || 'Số điện thoại hoặc Email này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại!' 
      });
    }
  };

  return (
    <>
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-6">Form đăng ký khóa học</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">Họ và tên <span className="text-brand-primary">*</span></label>
            <input type="text" name="leadName" value={formData.leadName} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary" placeholder="Nhập họ tên" />
            {errors.leadName && <span className="text-brand-primary text-xs mt-1 block">{errors.leadName}</span>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">Email <span className="text-brand-primary">*</span></label>
            <input type="email" name="leadEmail" value={formData.leadEmail} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary" placeholder="Nhập email" />
            {errors.leadEmail && <span className="text-brand-primary text-xs mt-1 block">{errors.leadEmail}</span>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">Số điện thoại <span className="text-brand-primary">*</span></label>
            <input type="tel" name="leadPhone" value={formData.leadPhone} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary" placeholder="Nhập số điện thoại" />
            {errors.leadPhone && <span className="text-brand-primary text-xs mt-1 block">{errors.leadPhone}</span>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">Môn học <span className="text-brand-primary">*</span></label>
            <select name="courseId" value={formData.courseId} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary">
              <option value="">Chọn môn học</option>
              <option value="C01">Khóa học Liferay Cơ bản</option>
              <option value="C02">Khóa học ReactJS Nâng cao</option>
            </select>
            {errors.courseId && <span className="text-brand-primary text-xs mt-1 block">{errors.courseId}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-900 block mb-1">Ngày sinh</label>
              <input type="date" name="leadBirthday" value={formData.leadBirthday} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-900 block mb-1">Khung giờ rảnh</label>
              <input type="text" name="freeTime" value={formData.freeTime} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary" placeholder="VD: Tối T7, CN" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">Kết quả mong muốn</label>
            <textarea name="expectedResult" value={formData.expectedResult} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full resize-none outline-none focus:border-brand-primary" placeholder="Nhập kết quả mong muốn đạt được..." rows={1}></textarea>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">Ghi chú thêm</label>
            <textarea name="leadNote" value={formData.leadNote} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full resize-none outline-none focus:border-brand-primary" placeholder="Nhập các ghi chú khác (nếu có)..." rows={1}></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-lg text-center transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-btn-primary hover:bg-btn-hover'}`}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </button>
        </form>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        icon={modalState.icon}
        title={modalState.title}
        description={modalState.desc}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </>
  );
};
