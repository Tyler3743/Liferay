import React, { useState } from 'react';
import type { KanbanCardType } from '../types/kanban.ts';
import { X } from 'lucide-react';

interface CardDetailDrawerProps {
  card: KanbanCardType | null;
  onClose: () => void;
  onSaveNote: (cardId: string, noteContent: string) => void;
}

export const CardDetailDrawer: React.FC<CardDetailDrawerProps> = ({ card, onClose, onSaveNote }) => {
  const [noteText, setNoteText] = useState('');

  if (!card) return null;

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    onSaveNote(card.id, noteText);
    setNoteText('');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-[500px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0">
        {/* Header */}
        <div className="flex items-start p-6 border-b border-gray-100">
          <button 
            onClick={onClose}
            className="mt-1 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors mr-4"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{card.name}</h2>
              {card.status && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${card.statusColor}`}>
                  {card.status}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span>Mã HS: {card.referenceId}</span>
              <span>•</span>
              <span>{card.courseType || 'Chưa rõ nhu cầu'}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* Summary Box */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-8 text-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-500 mr-2">SĐT:</span>
                <span className="font-bold text-gray-900">{card.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 mr-2">Nguồn:</span>
                <span className="font-bold text-gray-900">{card.source || 'Chưa cập nhật'}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Nhu cầu đầu vào:</span>
              <span className="text-gray-800 leading-relaxed">{card.requirement || 'Chưa có thông tin nhu cầu đầu vào.'}</span>
            </div>
          </div>

          {/* Add Note Section */}
          <div className="mb-8">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Thêm ghi chú tương tác</h3>
            <textarea 
              className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              rows={3}
              placeholder="Nhập nội dung cuộc gọi hoặc ghi chú mới..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>

          {/* History Timeline */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-gray-900">Lịch sử tương tác & Trạng thái</h3>
              <button 
                onClick={handleSaveNote}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Lưu ghi chú
              </button>
            </div>

            <div className="relative border-l-2 border-gray-100 ml-2 mt-6">
              {card.history && card.history.length > 0 ? (
                card.history.map((item) => (
                  <div key={item.id} className="mb-8 ml-6 relative">
                    <span className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full ${item.dotColor} ring-4 ring-white`}></span>
                    
                    <div className="mb-1 flex items-center text-xs">
                      <span className="font-bold text-gray-900 mr-2">{item.date}</span>
                      <span className="text-gray-400 mr-2">—</span>
                      <span className="text-gray-500">{item.author}</span>
                    </div>
                    
                    <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 ${item.tagColor}`}>
                      {item.tagText}
                    </div>
                    
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="ml-6 text-sm text-gray-500 py-4">Chưa có lịch sử tương tác.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
