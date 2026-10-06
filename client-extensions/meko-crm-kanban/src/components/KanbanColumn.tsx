import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard.tsx';
import type { KanbanColumnType, KanbanCardType } from '../types/kanban.ts';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCardClick: (card: KanbanCardType) => void;
  onAssignClick?: (card: KanbanCardType) => void;
  onSelectClassClick?: (card: KanbanCardType) => void;
  onDealClick?: (card: KanbanCardType) => void;
}

const columnColorStyles: Record<string, { bar: string; badge: string; hex: string }> = {
  unassigned: { bar: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-800', hex: '#6366f1' },
  new: { bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800', hex: '#3b82f6' },
  consulting: { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800', hex: '#f59e0b' },
  pending_deposit: { bar: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800', hex: '#eab308' },
  deposited: { bar: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800', hex: '#f97316' },
  completed: { bar: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-800', hex: '#059669' }
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onCardClick,
  onAssignClick,
  onSelectClassClick,
  onDealClick
}) => {
  const colorInfo = columnColorStyles[column.id] || { bar: 'bg-blue-500', badge: 'bg-gray-100 text-gray-700', hex: '#3b82f6' };

  return (
    <div className="flex flex-col w-[280px] shrink-0">
      {/* Top Color Line - guaranteed via inline style and class */}
      <div
        className={`h-1.5 w-full ${colorInfo.bar} rounded-t-md mb-2`}
        style={{ backgroundColor: colorInfo.hex }}
      ></div>

      {/* Main Column Body: Fixed spacious height min-h-[640px] */}
      <div className="bg-slate-50/80 rounded-b-md p-3 pb-6 min-h-[640px] border border-gray-100 flex flex-col">
        {/* Column Header */}
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-gray-800 text-sm">{column.title}</h3>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${colorInfo.badge}`}
          >
            {column.count}
          </span>
        </div>

        {/* Droppable Area: Always maintains full height flex-1 */}
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 min-h-[520px] transition-colors flex flex-col ${snapshot.isDraggingOver ? 'bg-slate-100/90 rounded-lg' : ''
                }`}
            >
              {column.cards.map((card, index) => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  index={index}
                  onClick={onCardClick}
                  onAssignClick={onAssignClick}
                  onSelectClassClick={onSelectClassClick}
                  onDealClick={onDealClick}
                />
              ))}

              {/* Khi trống: Giữ nguyên khung đầy đặn toàn bộ chiều cao cột */}
              {column.cards.length === 0 && (
                <div className="flex-1 min-h-[480px] border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-xs text-gray-400 gap-1.5">
                  <span className="text-gray-300 text-lg">📭</span>
                  <span>Chưa có hồ sơ</span>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
