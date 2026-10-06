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
            <div className="border border-gray-200 rounded-[20px] p-4 sm:p-5 space-y-3 sm:space-y-4 bg-white max-h-[420px] overflow-y-auto">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => {
                const data = schedule[day];
                return (
                  <div key={day} className="flex items-center gap-3 sm:gap-4 w-full">
                    <label className="flex items-center gap-3 cursor-pointer shrink-0 !mb-0">
                      <input
                        type="checkbox"
                        checked={data.enabled}
                        onChange={(e) => updateSchedule(day, 'enabled', e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-xl sm:text-2xl font-bold text-gray-800 w-10 sm:w-12">{day}</span>
                    </label>

                    <div className={`flex items-center flex-1 gap-2 sm:gap-3 transition-opacity ${data.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                      <div className="relative flex-1">
                        <input
                          type="time"
                          value={data.from}
                          onChange={(e) => updateSchedule(day, 'from', e.target.value)}
                          disabled={!data.enabled}
                          placeholder="-- : -- --"
                          className="w-full h-14 sm:h-16 border-2 border-gray-300 rounded-2xl px-3 sm:px-4 text-center text-xl sm:text-2xl font-mono tracking-widest text-gray-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white disabled:bg-gray-50 appearance-none"
                        />
                      </div>
                      <span className="text-gray-400 text-2xl sm:text-3xl font-light flex-shrink-0 select-none">—</span>
                      <div className="relative flex-1">
                        <input
                          type="time"
                          value={data.to}
                          onChange={(e) => updateSchedule(day, 'to', e.target.value)}
                          disabled={!data.enabled}
                          placeholder="-- : -- --"
                          className="w-full h-14 sm:h-16 border-2 border-gray-300 rounded-2xl px-3 sm:px-4 text-center text-xl sm:text-2xl font-mono tracking-widest text-gray-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white disabled:bg-gray-50 appearance-none"
                        />
                      </div>
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