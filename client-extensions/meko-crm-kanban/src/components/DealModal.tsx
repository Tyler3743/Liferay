import React, { useState, useEffect } from 'react';
import { X, DollarSign, BookOpen, CheckCircle } from 'lucide-react';
import type { KanbanCardType } from '../types/kanban.ts';

interface DealModalProps {
  card: KanbanCardType | null;
  onClose: () => void;
  onConfirm: (cardId: string, dealInfo: any) => void;
  onOpenClassModal?: (card: KanbanCardType) => void;
}

export const DealModal: React.FC<DealModalProps> = ({
  card,
  onClose,
  onConfirm,
  onOpenClassModal
}) => {
  const [dealAmount, setDealAmount] = useState('');
  const [dealNote, setDealNote] = useState('');

  useEffect(() => {
    if (card) {
      if (card.deal?.amount) {
        setDealAmount(card.deal.amount);
      } else if (card.selectedClass?.fee) {
        setDealAmount(card.selectedClass.fee);
      } else {
        setDealAmount('5.000.000 đ');
      }
      setDealNote('');
    }
  }, [card]);

  if (!card) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealAmount.trim()) {
      alert('Vui lòng nhập giá trị Deal!');
      return;
    }

    const dealInfo = {
      id: `DEAL-${Date.now()}`,
      code: `D-${card.id}`,
      amount: dealAmount.trim(),
      status: 'Chờ cọc',
      className: card.selectedClass?.name || card.courseType || 'Khóa học',
      classId: card.selectedClass?.id,
      note: dealNote.trim(),
      createdAt: new Date().toLocaleString('vi-VN')
    };

    onConfirm(card.id, dealInfo);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Tạo Deal Tuyển Sinh</h3>
              <p className="text-xs text-red-100">Chuyển hồ sơ sang giai đoạn Chờ cọc</p>
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Thông tin hồ sơ */}
          <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5 text-xs text-gray-700">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-red-900 text-sm">{card.name}</span>
              <span className="font-mono text-gray-500">{card.referenceId}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span>📞 {card.phone}</span>
              <span>📚 {card.courseType}</span>
            </div>
          </div>

          {/* Lớp học đã chọn */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Lớp học đăng ký:
            </label>
            {card.selectedClass ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-900">{card.selectedClass.name} ({card.selectedClass.code})</div>
                  <div className="text-gray-500 mt-0.5">📅 {card.selectedClass.schedule} | 📍 {card.selectedClass.room || 'Phòng học'}</div>
                  <div className="text-emerald-700 font-bold mt-0.5">Học phí: {card.selectedClass.fee}</div>
                </div>
                {onOpenClassModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenClassModal(card);
                    }}
                    className="px-2.5 py-1 text-[11px] bg-white border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-100 font-semibold transition"
                  >
                    Đổi lớp
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-900">Chưa gắn lớp học cụ thể</div>
                  <div className="text-amber-700 text-[11px]">Nên chọn lớp học để chốt học phí chính xác</div>
                </div>
                {onOpenClassModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenClassModal(card);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-xs flex items-center gap-1 transition shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Chọn lớp</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Giá trị Deal / Học phí */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Giá trị Deal / Học phí thỏa thuận: <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text"
                value={dealAmount}
                onChange={(e) => setDealAmount(e.target.value)}
                placeholder="VD: 5.500.000 đ"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                required
              />
            </div>
          </div>

          {/* Ghi chú Deal */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Ghi chú chốt Deal & Cam kết của khách:
            </label>
            <textarea
              rows={2}
              value={dealNote}
              onChange={(e) => setDealNote(e.target.value)}
              placeholder="VD: Khách hẹn đặt cọc 1.000.000 đ trước ngày 15, phần còn lại nộp vào buổi học đầu tiên..."
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Xác nhận Tạo Deal (Chuyển Chờ cọc)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
