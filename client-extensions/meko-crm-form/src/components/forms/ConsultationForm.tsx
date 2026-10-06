import React, { useState } from 'react';
import { LeadRequest, type ILeadData } from '../../models/LeadRequest';
import { FormService } from '../../services/FormService';
import { Modal } from '../common/Modal';
import { BaseInput } from '../common/BaseInput';
import { BaseSelect } from '../common/BaseSelect';
import { BaseTextarea } from '../common/BaseTextarea';
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

  // Thêm state cho "Khung giờ rảnh"
  type ScheduleState = Record<string, { enabled: boolean; from: string; to: string }>;
  const initialSchedule: ScheduleState = {
    'T2': { enabled: false, from: '', to: '' },
    'T3': { enabled: false, from: '', to: '' },
    'T4': { enabled: false, from: '', to: '' },
    'T5': { enabled: false, from: '', to: '' },
    'T6': { enabled: false, from: '', to: '' },
    'T7': { enabled: false, from: '', to: '' },
    'CN': { enabled: false, from: '', to: '' }
  };
  const [schedule, setSchedule] = useState<ScheduleState>(initialSchedule);

  const updateSchedule = (day: string, field: 'enabled' | 'from' | 'to', value: boolean | string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

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

    // Gộp dữ liệu ngày giờ
    const activeSchedules = Object.entries(schedule)
      .filter(([_, data]) => data.enabled)
      .map(([day, data]) => {
        if (data.from || data.to) return `${day} (${data.from || '?'} - ${data.to || '?'})`;
        return day;
      });
    const finalFreeTime = activeSchedules.join(', ');

    const requestObject = new LeadRequest({
      ...formData,
      freeTime: finalFreeTime
    });
    const response = await FormService.submitLead(requestObject);
    setIsLoading(false);

    if (response.success) {
      setModalState({ isOpen: true, icon: '✅', title: config.modalMessages.successTitle, desc: response.message });
      setFormData({ leadName: '', leadEmail: '', leadPhone: '', courseId: '', expectedResult: '', leadBirthday: '', freeTime: '', leadNote: '' });
      setSchedule(initialSchedule);
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

          {/* Select Component */}
          <BaseSelect
            label={config.labels.courseId}
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            options={config.courseOptions}
            placeholder={config.placeholders.courseId}
            error={errors.courseId}
            required
          />

          <div>
            <BaseInput type="date" label={config.labels.leadBirthday} name="leadBirthday" value={formData.leadBirthday} onChange={handleChange} />
          </div>

          {/* Chọn khung giờ rảnh */}
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1">{config.labels.freeTime}</label>
            <div className="border border-gray-300 rounded-md p-4 space-y-3 bg-white max-h-60 overflow-y-auto">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => {
                const data = schedule[day];
                return (
                  <div key={day} className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer w-16 shrink-0">
                      <input
                        type="checkbox"
                        checked={data.enabled}
                        onChange={(e) => updateSchedule(day, 'enabled', e.target.checked)}
                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-sm text-gray-700 font-medium">{day}</span>
                    </label>

                    <div className={`flex items-center justify-end space-x-2 flex-1 transition-opacity ${data.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                      <input
                        type="time"
                        value={data.from}
                        onChange={(e) => updateSchedule(day, 'from', e.target.value)}
                        disabled={!data.enabled}
                        className="border border-gray-300 rounded-md p-1.5 text-sm outline-none focus:border-brand-primary bg-white disabled:bg-gray-100"
                      />
                      <span className="text-gray-500 text-sm">—</span>
                      <input
                        type="time"
                        value={data.to}
                        onChange={(e) => updateSchedule(day, 'to', e.target.value)}
                        disabled={!data.enabled}
                        className="border border-gray-300 rounded-md p-1.5 text-sm outline-none focus:border-brand-primary bg-white disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <BaseTextarea
            label={config.labels.expectedResult}
            name="expectedResult"
            value={formData.expectedResult}
            onChange={handleChange}
            placeholder={config.placeholders.expectedResult}
            rows={1}
          />
          <BaseTextarea
            label={config.labels.leadNote}
            name="leadNote"
            value={formData.leadNote}
            onChange={handleChange}
            placeholder={config.placeholders.leadNote}
            rows={1}
          />

          <button type="submit" disabled={isLoading} className={`w-full text-white font-bold py-3 rounded-lg text-center transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-btn-primary hover:bg-btn-hover'}`}>
            {isLoading ? config.buttonTexts.loading : config.buttonTexts.submit}
          </button>
        </form>
      </div>

      <Modal isOpen={modalState.isOpen} icon={modalState.icon} title={modalState.title} description={modalState.desc} onClose={() => setModalState({ ...modalState, isOpen: false })} />
    </>
  );
};