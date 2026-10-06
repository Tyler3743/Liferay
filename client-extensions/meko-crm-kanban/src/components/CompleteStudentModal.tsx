import React, { useState, useEffect } from 'react';
import { X, GraduationCap, CheckCircle2, User, Phone, Mail, BookOpen } from 'lucide-react';
import type { KanbanCardType } from '../types/kanban.ts';

interface CompleteStudentModalProps {
  card: KanbanCardType | null;
  onClose: () => void;
  onConfirm: (card: KanbanCardType, studentData: any) => void;
}

export const CompleteStudentModal: React.FC<CompleteStudentModalProps> = ({
  card,
  onClose,
  onConfirm
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (card) {
      setStudentName(card.name || '');
      setStudentPhone(card.phone || '');
      setStudentEmail(card.email || '');
      setStudentCode(`HV-${card.id}`);
      setNotes('Hoàn thành tuyển sinh - Đã thu học phí đầy đủ');
    }
  }, [card]);

  if (!card) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) {
      alert('Vui lòng điền đủ Họ tên và SĐT học viên!');
      return;
    }

    const studentData = {
      studentCode: studentCode.trim(),
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      studentEmail: studentEmail.trim(),
      studentStatus: 1, // Đang học
      notes: notes.trim(),
      classId: card.selectedClass?.id,
      className: card.selectedClass?.name || card.courseType,
      fee: card.deal?.amount || card.selectedClass?.fee || '0 đ'
    };

    onConfirm(card, studentData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      style={{ zIndex: 9999999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-150 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 flex items-center justify-between text-white"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Xác nhận Hoàn thành Tuyển sinh</h3>
              <p className="text-xs text-emerald-100">Tự động tạo hồ sơ Học viên chính thức</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Thông tin lớp & Học phí */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>{card.selectedClass?.name || card.courseType || 'Khóa học tuyển sinh'}</span>
              </div>
              <div className="text-gray-600 mt-1">
                Lịch: {card.selectedClass?.schedule || 'Theo kế hoạch'} | Mã lớp: {card.selectedClass?.code || 'N/A'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-gray-500">Học phí / Deal:</div>
              <div className="text-emerald-700 font-extrabold text-sm">
                {card.deal?.amount || card.selectedClass?.fee || 'Đã thanh toán'}
              </div>
            </div>
          </div>

          {/* Họ tên học viên */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Họ và tên Học viên: <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* SĐT & Mã học viên */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Số điện thoại: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Mã Học viên:</label>
              <input 
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-gray-700 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Email học viên:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="hocvien@gmail.com"
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Ghi chú tốt nghiệp hồ sơ:</label>
            <input 
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition cursor-pointer"
            >
              Hủy bỏ (Giữ nguyên vị trí)
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#059669', color: '#ffffff' }}
              className="px-5 py-2 hover:bg-emerald-700 rounded-xl font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>🎓 Xác nhận Tạo Học viên & Hoàn tất</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
