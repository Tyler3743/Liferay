import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn.tsx';
import { CardDetailDrawer } from './CardDetailDrawer.tsx';
import { initialKanbanData } from '../data/mockKanban.ts';
import type { KanbanBoardData, KanbanCardType } from '../types/kanban.ts';
import { Search } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const [data, setData] = useState<KanbanBoardData>(initialKanbanData);
  const [selectedCard, setSelectedCard] = useState<KanbanCardType | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColIndex = data.columns.findIndex(col => col.id === source.droppableId);
    const destColIndex = data.columns.findIndex(col => col.id === destination.droppableId);
    
    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceCol = data.columns[sourceColIndex];
    const destCol = data.columns[destColIndex];

    const sourceCards = Array.from(sourceCol.cards);
    const destCards = Array.from(destCol.cards);
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCards.splice(destination.index, 0, movedCard);
      
      const newColumns = [...data.columns];
      newColumns[sourceColIndex] = { ...sourceCol, cards: sourceCards };
      
      setData({ ...data, columns: newColumns });
    } else {
      destCards.splice(destination.index, 0, movedCard);
      
      const newColumns = [...data.columns];
      newColumns[sourceColIndex] = { ...sourceCol, cards: sourceCards, count: sourceCards.length };
      newColumns[destColIndex] = { ...destCol, cards: destCards, count: destCards.length };
      
      setData({ ...data, columns: newColumns });
    }
  };

  const handleSaveNote = (cardId: string, noteContent: string) => {
    // Find the card in data and add a new history item
    let updatedCard: KanbanCardType | null = null;
    
    const newColumns = data.columns.map(col => {
      const cardIndex = col.cards.findIndex(c => c.id === cardId);
      if (cardIndex > -1) {
        const targetCard = col.cards[cardIndex];
        const newHistoryItem = {
          id: `h-new-${Date.now()}`,
          date: new Date().toLocaleString('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          }).replace(' ', ' '), // Format: 23/09/2026 16:00
          author: 'Bạn (Người dùng hiện tại)',
          tagText: 'GHI CHÚ',
          tagColor: 'bg-gray-100 text-gray-700',
          dotColor: 'bg-gray-500',
          content: noteContent
        };
        
        updatedCard = {
          ...targetCard,
          history: [newHistoryItem, ...(targetCard.history || [])]
        };
        
        const newCards = [...col.cards];
        newCards[cardIndex] = updatedCard;
        
        return { ...col, cards: newCards };
      }
      return col;
    });

    setData({ ...data, columns: newColumns });
    if (updatedCard) {
      setSelectedCard(updatedCard);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Phễu tuyển sinh Kanban</h1>
      
      <div className="mb-8 max-w-sm relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none shadow-sm"
          placeholder="Nhập Tên, SĐT khách hàng..."
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 h-full">
          {data.columns.map((column) => (
            <KanbanColumn key={column.id} column={column} onCardClick={setSelectedCard} />
          ))}
        </div>
      </DragDropContext>

      <CardDetailDrawer card={selectedCard} onClose={() => setSelectedCard(null)} onSaveNote={handleSaveNote} />
    </div>
  );
};
