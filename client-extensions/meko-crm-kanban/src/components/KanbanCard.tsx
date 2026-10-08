import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { KanbanCardType } from '../types/kanban.ts';
import { Phone, Calendar, UserCheck, BookOpen, DollarSign } from 'lucide-react';

interface KanbanCardProps {
  card: KanbanCardType;
  index: number;
  onClick: (card: KanbanCardType) => void;
  onAssignClick?: (card: KanbanCardType) => void;
  onSelectClassClick?: (card: KanbanCardType) => void;
  onDealClick?: (card: KanbanCardType) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  index,
  onClick,
  onAssignClick,
  onSelectClassClick,
  onDealClick
}) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(card)}
          className={`bg-white p-3.5 mb-3 rounded-xl shadow-xs border border-gray-150 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md transition-all ${snapshot.isDragging ? 'shadow-xl border-blue-400 ring-2 ring-blue-300 z-50 rotate-1' : ''
            }`}
          style={{ ...provided.draggableProps.style }}
        >
          {/* Header thẻ: Tên + Mã hồ sơ + Badge trạng thái */}
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-extrabold text-gray-900 text-sm hover:text-blue-600 transition-colors line-clamp-1">
              {card.name}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                {card.referenceId}
              </span>
              {card.status && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${card.status === 'Chưa phân công' ? 'bg-indigo-100 text-indigo-800' :
                  card.status === 'Mới' ? 'bg-blue-100 text-blue-800' :
                    card.status === 'Đang tư vấn' ? 'bg-amber-100 text-amber-800' :
                      card.status === 'Chờ cọc' ? 'bg-yellow-100 text-yellow-800' :
                        card.status === 'Đã cọc' ? 'bg-orange-100 text-orange-800' :
                          card.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-gray-100 text-gray-700'
                  }`}>
                  {card.status}
                </span>
              )}
            </div>
          </div>

          {/* SĐT & Ngày */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1 font-semibold text-gray-700">
              <Phone className="w-3 h-3 text-gray-400" />
              <span>{card.phone}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Calendar className="w-3 h-3 text-gray-300" />
              <span>{card.date}</span>
            </span>
          </div>

          {/* Khóa học quan tâm */}
          {card.courseType && (
            <div className="text-xs font-bold text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md w-max max-w-full truncate">
              📚 {card.courseType}
            </div>
          )}

          {/* Nhu cầu tư vấn đầu vào */}
          {card.requirement && (
            <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-2 text-xs text-gray-700">
              <span className="font-bold text-blue-700 text-[11px] block mb-0.5">Nhu cầu:</span>
              <p className="line-clamp-2 leading-tight text-gray-600">{card.requirement}</p>
            </div>
          )}

          {/* Badge phân công Sale */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {card.assignedName ? (
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-purple-600" />
                <span>Sale: {card.assignedName}</span>
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                ⚠️ Chưa phân công
              </span>
            )}
          </div>

          {/* Lớp học đã chọn */}
          {card.selectedClass && (
            <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-1 rounded-md flex items-center justify-between">
              <span className="truncate">🏫 Lớp: {card.selectedClass.name}</span>
              <span className="font-bold shrink-0 ml-1">{card.selectedClass.fee}</span>
            </div>
          )}

          {/* Deal info */}
          {card.deal && (
            <div className={`text-xs font-bold px-2 py-1 rounded-md flex items-center justify-between ${card.deal.status === 'Đã cọc'
              ? 'bg-orange-100 text-orange-800 border border-orange-200'
              : card.deal.status === 'Hoàn thành'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
              <span>💰 Deal: {card.deal.amount}</span>
              <span className="text-[10px] uppercase tracking-wider">{card.deal.status}</span>
            </div>
          )}

          {/* Tag text cũ (giữ tương thích) */}
          {card.tagText && !card.assignedName && !card.deal && (
            <div className={`text-xs font-semibold px-2 py-1 rounded w-max mt-1 ${card.tagColor}`}>
              {card.tagText}
            </div>
          )}

          {/* HÀNG NÚT HÀNH ĐỘNG ĐỒNG BỘ TRÊN MỌI THẺ */}
          <div className="mt-1 pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5">
            {!card.assignedTo ? (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAssignClick) onAssignClick(card);
                  else onClick(card);
                }}
                className="bg-brand-primary flex-1 py-1.5 px-2 hover:opacity-90 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition cursor-pointer text-white"
              >
                <UserCheck className="w-3.5 h-3.5 text-white" />
                <span>Phân công</span>
              </button>
            ) : !card.selectedClass ? (
              <button
                type="button"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectClassClick) onSelectClassClick(card);
                  else onClick(card);
                }}
                className="flex-1 py-1.5 px-2 hover:opacity-90 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-white" />
                <span>Chọn lớp</span>
              </button>
            ) : !card.deal ? (
              <button
                type="button"
                style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDealClick) onDealClick(card);
                  else onClick(card);
                }}
                className="flex-1 py-1.5 px-2 hover:opacity-90 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-white" />
                <span>Tạo Deal</span>
              </button>
            ) : (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDealClick) onDealClick(card);
                  else onClick(card);
                }}
                className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                <span>Xem Deal</span>
              </button>
            )}

            {/* Nút Xem chi tiết */}
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClick(card);
              }}
              className="py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0"
            >
              Chi tiết
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};
