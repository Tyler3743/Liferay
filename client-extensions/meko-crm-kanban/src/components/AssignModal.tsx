import React, { useState, useEffect } from 'react';
import type { KanbanCardType } from '../types/kanban.ts';
import { X, UserCheck } from 'lucide-react';

interface AssignModalProps {
  card: KanbanCardType | null;
  onClose: () => void;
  onConfirm: (cardId: string, saleId: string, saleName: string, note: string) => void;
}

export const AssignModal: React.FC<AssignModalProps> = ({ card, onClose, onConfirm }) => {
  const [assigneeId, setAssigneeId] = useState('sale01');
  const [assignNoteText, setAssignNoteText] = useState('');

  useEffect(() => {
    if (card) {
      setAssigneeId(card.assignedTo || 'sale01');
      setAssignNoteText('');
    }
  }, [card]);

  if (!card) return null;

  const handleConfirm = () => {
    const saleName = assigneeId === 'sale01' ? 'Tư Vấn Viên 1' : 'Tư Vấn Viên';
    onConfirm(card.id, assigneeId, saleName, assignNoteText);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
          <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            <span>Phân công hồ sơ tư vấn</span>
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 bg-purple-50/70 p-3 rounded-lg border border-purple-100">
          <span className="text-xs text-gray-500 block mb-0.5">Khách hàng:</span>
          <div className="font-bold text-sm text-gray-900">{card.name} ({card.phone})</div>
          <div className="text-xs text-purple-700 mt-1 font-medium">Nhu cầu: {card.courseType}</div>
          {card.requirement && (
            <div className="text-[11px] text-gray-600 mt-1 italic">"{card.requirement}"</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Chọn tư vấn viên (Sale phụ trách):
          </label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="sale01">Tư Vấn Viên 1 (sale01@mekosoft.vn)</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Ghi chú phân công / Giao việc:
          </label>
          <textarea
            value={assignNoteText}
            onChange={(e) => setAssignNoteText(e.target.value)}
            rows={3}
            placeholder="Nhập ghi chú cho tư vấn viên (ví dụ: Khách hẹn gọi lại buổi sáng, cần hỗ trợ học phí...)"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Xác nhận phân công</span>
          </button>
        </div>
      </div>
    </div>
  );
};
