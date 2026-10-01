import React, { useState } from 'react';
import { LeadRequest, type ILeadData } from '../../models/LeadRequest';
import { FormService } from '../../services/FormService';
import { Modal } from '../common/Modal';
import { BaseInput } from '../common/BaseInput';
import { type ConsultationFormConfig, defaultFormConfig } from './ConsultationFormConfig';

// Lấy config mặc định nếu không có props truyền vào (giúp App.tsx không bị lỗi)
interface Props {
  config?: ConsultationFormConfig;
}

export const ConsultationForm: React.FC<Props> = ({ config = defaultFormConfig }) => {
  const [formData, setFormData] = useState<ILeadData>({
    leadName: '', leadEmail: '', leadPhone: '', courseId: '', expectedResult: '', leadBirthday: '', freeTime: '', leadNote: ''
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
    if (!formData.leadName.trim()) newErrors.leadName = config.validationMessages.leadNameRequired;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadEmail)) newErrors.leadEmail = config.validationMessages.leadEmailInvalid;
    if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(formData.leadPhone)) newErrors.leadPhone = config.validationMessages.leadPhoneInvalid;
    if (!formData.courseId) newErrors.courseId = config.validationMessages.courseIdRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const requestObject = new LeadRequest(formData);
    const response = await FormService.submitLead(requestObject);
    setIsLoading(false);

    if (response.success) {
      setModalState({ isOpen: true, icon: '✅', title: config.modalMessages.successTitle, desc: response.message });
      setFormData({ leadName: '', leadEmail: '', leadPhone: '', courseId: '', expectedResult: '', leadBirthday: '', freeTime: '', leadNote: '' });
    } else {
      setModalState({
        isOpen: true,
        icon: '⚠️',
        title: config.modalMessages.errorTitle,
        desc: response.message || config.modalMessages.defaultErrorDesc
      });
    }
  };

  return (
    <>
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-6">{config.title}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tái sử dụng BaseInput, code cực kỳ sạch sẽ */}
          <BaseInput label={config.labels.leadName} name="leadName" value={formData.leadName} onChange={handleChange} placeholder={config.placeholders.leadName} error={errors.leadName} required />
          <BaseInput type="email" label={config.labels.leadEmail} name="leadEmail" value={formData.leadEmail} onChange={handleChange} placeholder={config.placeholders.leadEmail} error={errors.leadEmail} required />
          <BaseInput type="tel" label={config.labels.leadPhone} name="leadPhone" value={formData.leadPhone} onChange={handleChange} placeholder={config.placeholders.leadPhone} error={errors.leadPhone} required />

          {/* Select Component (Cũng hết hardcode option) */}
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">{config.labels.courseId} <span className="text-brand-primary">*</span></label>
            <select name="courseId" value={formData.courseId} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-brand-primary">
              <option value="">{config.placeholders.courseId}</option>
              {config.courseOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.courseId && <span className="text-brand-primary text-xs mt-1 block">{errors.courseId}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <BaseInput type="date" label={config.labels.leadBirthday} name="leadBirthday" value={formData.leadBirthday} onChange={handleChange} />
            <BaseInput label={config.labels.freeTime} name="freeTime" value={formData.freeTime} onChange={handleChange} placeholder={config.placeholders.freeTime} />
          </div>

          {/* Textarea */}
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">{config.labels.expectedResult}</label>
            <textarea name="expectedResult" value={formData.expectedResult} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full resize-none outline-none focus:border-brand-primary" placeholder={config.placeholders.expectedResult} rows={1}></textarea>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">{config.labels.leadNote}</label>
            <textarea name="leadNote" value={formData.leadNote} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full resize-none outline-none focus:border-brand-primary" placeholder={config.placeholders.leadNote} rows={1}></textarea>
          </div>

          <button type="submit" disabled={isLoading} className={`w-full text-white font-bold py-3 rounded-lg text-center transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-btn-primary hover:bg-btn-hover'}`}>
            {isLoading ? config.buttonTexts.loading : config.buttonTexts.submit}
          </button>
        </form>
      </div>

      <Modal isOpen={modalState.isOpen} icon={modalState.icon} title={modalState.title} description={modalState.desc} onClose={() => setModalState({ ...modalState, isOpen: false })} />
    </>
  );
};