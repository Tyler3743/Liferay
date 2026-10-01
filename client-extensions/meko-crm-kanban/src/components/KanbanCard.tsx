import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { KanbanCardType } from '../types/kanban.ts';

interface KanbanCardProps {
  card: KanbanCardType;
  index: number;
  onClick: (card: KanbanCardType) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, index, onClick }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(card)}
          className={`bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:border-blue-200 transition-colors ${
            snapshot.isDragging ? 'shadow-md border-blue-300 ring-1 ring-blue-300 z-50' : ''
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-gray-900 text-sm">{card.name}</h4>
          </div>
          <div className="text-xs text-gray-500">{card.phone}</div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{card.date}</span>
            <span className="text-gray-300">{card.referenceId}</span>
          </div>
          {card.courseType && (
            <div className={`text-xs font-semibold ${
              card.courseType === 'IELTS' || card.courseType === 'TOEIC' 
                ? 'text-blue-500' 
                : 'text-green-600'
            }`}>
              {card.courseType}
            </div>
          )}
          {card.tagText && (
            <div className={`text-xs font-semibold px-2 py-1 rounded w-max mt-1 ${card.tagColor}`}>
              {card.tagText}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
