import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard.tsx';
import type { KanbanColumnType, KanbanCardType } from '../types/kanban.ts';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onCardClick: (card: KanbanCardType) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, onCardClick }) => {
  return (
    <div className="flex flex-col w-[280px] shrink-0">
      <div className={`h-1 w-full ${column.color} rounded-t-md mb-2`}></div>
      <div className="bg-slate-50/80 rounded-b-md p-3 pb-6 min-h-[500px] border border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-gray-800 text-sm">{column.title}</h3>
          <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {column.count}
          </span>
        </div>

        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 transition-colors ${
                snapshot.isDraggingOver ? 'bg-slate-100 rounded-lg' : ''
              }`}
            >
              {column.cards.map((card, index) => (
                <KanbanCard key={card.id} card={card} index={index} onClick={onCardClick} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
