import React, { useState, useEffect } from 'react';
import type { KanbanCardType } from '../types/kanban.ts';
import { X, UserCheck, BookOpen, DollarSign, Phone, Mail, Calendar, MapPin, Tag, ShieldCheck, Clock } from 'lucide-react';

interface CardDetailDrawerProps {
  card: KanbanCardType | null;
  onClose: () => void;
  onSaveNote: (cardId: string, noteContent: string) => void;
  onSelectClass?: (cardId: string, classInfo: any) => void;
  onCreateDeal?: (cardId: string, dealInfo: any) => void;
  isManager?: boolean;
  onAssignSale?: (cardId: string, saleId: string, saleName: string, note?: string) => void;
  onOpenAssignModal?: (card: KanbanCardType) => void;
  onOpenClassModal?: (card: KanbanCardType) => void;
  onOpenDealModal?: (card: KanbanCardType) => void;
}

export const CardDetailDrawer: React.FC<CardDetailDrawerProps> = ({ 
  card, 
  onClose, 
  onSaveNote, 
  onAssignSale,
  onOpenAssignModal,
  onOpenClassModal,
  onOpenDealModal
}) => {
  const [noteText, setNoteText] = useState('');
  const [selectedSaleId, setSelectedSaleId] = useState('sale01');
  const [assignNote, setAssignNote] = useState('');
  const [isChangingAssign, setIsChangingAssign] = useState(false);

  useEffect(() => {
    setIsChangingAssign(false);
    setAssignNote('');
    if (card?.assignedTo) {
      setSelectedSaleId(card.assignedTo);
    } else {
      setSelectedSaleId('sale01');
    }
  }, [card?.id]);

  if (!card) return null;

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    onSaveNote(card.id, noteText);
    setNoteText('');
  };

  const handleInlineAssign = () => {
    const saleName = selectedSaleId === 'sale01' ? 'Tư Vấn Viên 1' : 'Tư Vấn Viên 2';
    if (onAssignSale) {
      onAssignSale(card.id, selectedSaleId, saleName, assignNote);
    } else if (onOpenAssignModal) {
      onOpenAssignModal(card);
    }
    setIsChangingAssign(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[540px] max-w-[95vw] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0">
        {/* Header */}
        <div className="flex items-start p-6 border-b border-gray-100 bg-white">
          <button 
            type="button"
            onClick={onClose}
            className="mt-1 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors mr-3.5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h2 className="text-xl font-extrabold text-gray-900">{card.name}</h2>
              <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                {card.referenceId}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                card.status === 'Chưa phân công' ? 'bg-indigo-100 text-indigo-800' :
                card.status === 'Mới' ? 'bg-blue-100 text-blue-800' :
                card.status === 'Đang tư vấn' ? 'bg-amber-100 text-amber-800' :
                card.status === 'Chờ cọc' ? 'bg-yellow-100 text-yellow-800' :
                card.status === 'Đã cọc' ? 'bg-orange-100 text-orange-800' :
                card.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {card.status || 'Mới'}
              </span>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Tiếp nhận: {card.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-blue-600">
                <Tag className="w-3.5 h-3.5" />
                <span>{card.courseType || 'Tư vấn đào tạo'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-5">
          {/* 1. THÔNG TIN CÁ NHÂN & LIÊN HỆ */}
          <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-4 text-xs">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Thông tin liên hệ & Tiếp cận</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Số điện thoại:</span>
                  <span className="font-bold text-gray-900 text-sm">{card.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Email liên hệ:</span>
                  <span className="font-medium text-gray-800">{card.email || 'Chưa cung cấp'}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Nguồn đăng ký:</span>
                  <span className="font-semibold text-gray-800">{card.source || 'Website Form'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-gray-500 block text-[11px]">Kênh tiếp nhận:</span>
                  <span className="font-medium text-gray-800">Tự động (Lead CRM)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. NHU CẦU & MỤC TIÊU ĐÀO TẠO */}
          <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl p-4 text-xs">
            <h3 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Khảo sát nhu cầu đầu vào</span>
            </h3>
            <div className="mb-2.5">
              <span className="text-blue-700 font-medium block mb-1">Mục tiêu & Yêu cầu học viên:</span>
              <p className="bg-white p-3 rounded-lg border border-blue-100 text-gray-800 font-medium leading-relaxed">
                {card.requirement || 'Cần tư vấn chi tiết về lộ trình và thời gian học.'}
              </p>
            </div>
            {card.inquiries && card.inquiries.length > 0 && (
              <div className="mt-2 pt-2 border-t border-blue-100">
                <span className="text-blue-800 font-semibold block mb-1 text-[11px]">Các phiếu nhu cầu liên quan ({card.inquiries.length}):</span>
                <div className="space-y-1.5">
                  {card.inquiries.map((iq, idx) => (
                    <div key={idx} className="bg-white/90 p-2 rounded border border-blue-100 text-[11px] flex justify-between items-center">
                      <span className="text-gray-800">📌 <b>{iq.targetProgram || 'Chương trình'}</b>: {iq.targetOutcome || iq.notes || 'Nhu cầu'}</span>
                      <span className="text-blue-600 font-semibold px-2 py-0.5 rounded bg-blue-50">{iq.status || 'Đang xử lý'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. PHÂN CÔNG TƯ VẤN VIÊN (SALE ASSIGNMENT) */}
          <div className="bg-purple-50/90 border border-purple-200 rounded-xl p-4 text-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-700" />
                <span className="font-bold text-purple-900 text-sm">Phân công tư vấn viên</span>
              </div>
              {card.assignedName ? (
                <span className="text-[11px] bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                  Đã phân công
                </span>
              ) : (
                <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                  Chưa phân công
                </span>
              )}
            </div>

            {/* Nếu đã có Sale và không đang mở form đổi */}
            {card.assignedName && !isChangingAssign ? (
              <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-[11px]">Tư vấn viên đang phụ trách:</div>
                    <div className="text-purple-900 font-extrabold text-sm mt-0.5">
                      👤 {card.assignedName}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangingAssign(true)}
                    className="px-3 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg border border-purple-200 transition cursor-pointer"
                  >
                    🔄 Đổi người phân công
                  </button>
                </div>
              </div>
            ) : (
              /* Form chọn Sale trực tiếp */
              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-purple-200 shadow-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Chọn Tư vấn viên tiếp nhận:
                  </label>
                  <select
                    value={selectedSaleId}
                    onChange={(e) => setSelectedSaleId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="sale01">👤 Tư Vấn Viên 1 (sale01@mekosoft.vn)</option>
                    <option value="sale02">👤 Tư Vấn Viên 2 (sale02@mekosoft.vn)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Ghi chú giao việc (nếu có):
                  </label>
                  <input
                    type="text"
                    value={assignNote}
                    onChange={(e) => setAssignNote(e.target.value)}
                    placeholder="VD: Khách hẹn gọi lại buổi sáng, cần hỗ trợ học phí..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {card.assignedName && (
                    <button
                      type="button"
                      onClick={() => setIsChangingAssign(false)}
                      className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold text-xs hover:bg-gray-50 transition cursor-pointer"
                    >
                      Hủy
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleInlineAssign}
                    style={{ backgroundColor: '#7c3aed', color: '#ffffff' }}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition cursor-pointer active:scale-[0.99]"
                  >
                    <UserCheck className="w-4 h-4 text-white" />
                    <span>👤 Phân công cho Sale ngay</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. LỚP HỌC ĐĂNG KÝ */}
          <div className="border border-gray-200 rounded-xl p-4 text-xs bg-white">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-gray-900 text-sm">Lớp học tuyển sinh</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenClassModal && onOpenClassModal(card)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>{card.selectedClass ? 'Đổi lớp khác' : 'Tra cứu & Chọn lớp'}</span>
              </button>
            </div>

            {card.selectedClass ? (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-xs">
                <div className="flex justify-between font-bold text-emerald-900 mb-1.5">
                  <span className="text-sm">{card.selectedClass.name}</span>
                  <span className="text-emerald-700 font-extrabold text-sm">{card.selectedClass.fee}</span>
                </div>
                <div className="text-gray-600 mb-1 flex items-center gap-2">
                  <span>📅 Lịch học: <b>{card.selectedClass.schedule}</b></span>
                  <span>•</span>
                  <span>Mã lớp: <b>{card.selectedClass.code}</b></span>
                </div>
                {card.selectedClass.room && (
                  <div className="text-gray-600">📍 Phòng học: {card.selectedClass.room}</div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-500 text-center">
                <p className="mb-2">Chưa chọn lớp học cho hồ sơ này.</p>
                <button
                  type="button"
                  onClick={() => onOpenClassModal && onOpenClassModal(card)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-xs text-xs flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Mở Bảng Danh Sách Lớp học tuyển sinh</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. GIAO DỊCH DEAL & ĐẶT CỌC */}
          <div className="border border-red-200/80 rounded-xl p-4 text-xs bg-red-50/40">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-red-600" />
                <span className="font-bold text-red-900 text-sm">Giao dịch Deal & Học phí</span>
              </div>
              {card.deal && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                  {card.deal.status}
                </span>
              )}
            </div>

            {card.deal ? (
              <div className="bg-white border border-red-200 rounded-xl p-3.5 shadow-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-500">Giá trị Deal:</span>
                  <span className="text-red-600 font-extrabold text-base">{card.deal.amount}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-[11px]">
                  <span>Trạng thái: <b>{card.deal.status}</b></span>
                  <span>Khóa: {card.deal.className || card.courseType}</span>
                </div>
                {card.deal.code && (
                  <div className="text-[11px] text-gray-400 font-mono mt-1 pt-1 border-t border-gray-100">
                    Mã Deal: {card.deal.code}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Hồ sơ chưa được tạo Deal. Khi tư vấn thành công, tạo Deal để chuyển sang cột <b>Chờ cọc</b>.</p>
                <button
                  type="button"
                  onClick={() => onOpenDealModal && onOpenDealModal(card)}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>💰 Tạo Deal Tuyển Sinh ngay</span>
                </button>
              </div>
            )}
          </div>

          {/* 6. GHI CHÚ TƯƠNG TÁC */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-2">Thêm ghi chú tương tác</h3>
            <textarea 
              className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              rows={3}
              placeholder="Nhập nội dung cuộc gọi hoặc ghi chú mới cho hồ sơ..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button 
                type="button"
                onClick={handleSaveNote}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
          
          {/* Lịch sử tương tác */}
          {card.history && card.history.length > 0 && (
             <div className="pt-4 border-t border-gray-100">
               <h3 className="font-bold text-sm text-gray-900 mb-4">Lịch sử tương tác</h3>
               <div className="relative border-l-2 border-gray-100 ml-2">
                  {card.history.map((item) => (
                    <div key={item.id} className="mb-6 ml-6 relative">
                      <span className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full ${item.dotColor} ring-4 ring-white`}></span>
                      <div className="mb-1 flex items-center text-xs">
                        <span className="font-bold text-gray-900 mr-2">{item.date}</span>
                        <span className="text-gray-400 mr-2">—</span>
                        <span className="text-gray-500">{item.author}</span>
                      </div>
                      <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 ${item.tagColor}`}>
                        {item.tagText}
                      </div>
                      <div className="text-xs text-gray-600 leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          )}
        </div>
      </div>
    </>
  );
};
