import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult, DragStart } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn.tsx';
import { CardDetailDrawer } from './CardDetailDrawer.tsx';
import { AssignModal } from './AssignModal.tsx';
import { ClassSelectModal } from './ClassSelectModal.tsx';
import { DealModal } from './DealModal.tsx';
import { CompleteStudentModal } from './CompleteStudentModal.tsx';
import type { KanbanBoardData, KanbanCardType, ColumnId } from '../types/kanban.ts';
import { Search, Trash2, CheckCircle2, Kanban, Users, User, ShieldAlert } from 'lucide-react';
import { initialKanbanData } from '../data/mockKanban.ts';

const emptyKanbanData: KanbanBoardData = {
  columns: [
    { id: 'unassigned', title: 'Chưa phân công', color: 'bg-indigo-500', count: 0, cards: [] },
    { id: 'new', title: 'Mới', color: 'bg-blue-500', count: 0, cards: [] },
    { id: 'consulting', title: 'Đang tư vấn', color: 'bg-amber-500', count: 0, cards: [] },
    { id: 'pending_deposit', title: 'Chờ cọc', color: 'bg-yellow-500', count: 0, cards: [] },
    { id: 'deposited', title: 'Đã cọc', color: 'bg-orange-500', count: 0, cards: [] },
    { id: 'completed', title: 'Hoàn thành', color: 'bg-green-600', count: 0, cards: [] }
  ]
};

// Map column to database status number
const columnToStatusNum = (colId: ColumnId): number => {
  switch (colId) {
    case 'unassigned': return 1;
    case 'new': return 2;
    case 'consulting': return 3;
    case 'pending_deposit': return 4;
    case 'deposited': return 5;
    case 'completed': return 6;
    default: return 1;
  }
};

// Map column ID to Inquiry status text
const columnToInquiryStatus = (colId: string): string => {
  switch (colId) {
    case 'unassigned': return 'Chưa phân công';
    case 'new': return 'Đã phân công';
    case 'consulting': return 'Đang tư vấn';
    case 'pending_deposit': return 'Chờ cọc';
    case 'deposited': return 'Đã cọc';
    case 'completed': return 'Hoàn thành';
    case 'trash_cancelled': return 'Đã hủy';
    default: return 'Đang xử lý';
  }
};

export const KanbanBoard: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<'manager' | 'sale'>('manager');
  const [activeView, setActiveView] = useState<'kanban' | 'leads'>('kanban');

  const [data, setData] = useState<KanbanBoardData>(emptyKanbanData);
  const [selectedCard, setSelectedCard] = useState<KanbanCardType | null>(null);
  const [assignModalCard, setAssignModalCard] = useState<KanbanCardType | null>(null);
  const [classModalCard, setClassModalCard] = useState<KanbanCardType | null>(null);
  const [dealModalCard, setDealModalCard] = useState<KanbanCardType | null>(null);
  const [completeStudentCard, setCompleteStudentCard] = useState<{ card: KanbanCardType; sourceColId: ColumnId } | null>(null);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // For mock data mode or local dev
    // Normally fetch from API, but we'll use mock initial data + structure mapping if no API
    const loadData = async () => {
      try {
        const headers: HeadersInit = {
          'Authorization': 'Basic ' + btoa('test@mekosoft.vn:admin')
        };
        const csrf = (window as any).Liferay?.authToken;
        if (csrf) {
          headers['x-csrf-token'] = csrf;
        }

        const [leadsRes, inqRes, clsRes] = await Promise.all([
          fetch('/o/c/leads', { credentials: 'include', headers }).catch(() => null),
          fetch('/o/c/inquiries', { credentials: 'include', headers }).catch(() => null),
          fetch('/o/c/clazzes', { credentials: 'include', headers }).catch(() => null)
        ]);

        if (!leadsRes || !leadsRes.ok) {
          throw new Error('No API');
        }

        const leadsData = await leadsRes.json();
        const inquiriesData = inqRes && inqRes.ok ? await inqRes.json() : { items: [] };
        const clazzesData = clsRes && clsRes.ok ? await clsRes.json() : { items: [] };

        const leads = leadsData.items || [];
        const inquiries = inquiriesData.items || [];
        const clazzes = clazzesData.items || [];
        setAvailableClasses(clazzes);

        const colMap: Record<ColumnId, KanbanCardType[]> = {
          unassigned: [], new: [], consulting: [], pending_deposit: [], deposited: [], completed: [], cancelled: [], deposit: []
        };

        leads.forEach((l: any, idx: number) => {
          const leadInquiries = inquiries.filter((iq: any) =>
            (iq.inquiryNotes && iq.inquiryNotes.includes(l.leadPhone)) ||
            (iq.r_lead_c_leadId && String(iq.r_lead_c_leadId) === String(l.id))
          );
          const primaryInq = leadInquiries[0] || inquiries[idx] || {};

          // Parse persistent tags from leadNotes
          const rawNotes = l.leadNotes || '';
          let assignedTo = '';
          let assignedName = '';
          const assignedMatch = rawNotes.match(/\[ASSIGNED:([^|\]]+)\|?([^\]]*)\]/);
          if (assignedMatch) {
            assignedTo = assignedMatch[1];
            assignedName = assignedMatch[2] || (assignedTo === 'sale01' ? 'Tư Vấn Viên 1' : assignedTo);
          }

          let selectedClass: any = undefined;
          const classMatch = rawNotes.match(/\[CLASS:([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|?([^\]]*)\]/);
          if (classMatch) {
            selectedClass = { id: classMatch[1], code: classMatch[2], name: classMatch[3], fee: classMatch[4], schedule: classMatch[5] || 'Tối 2-4-6' };
          }

          let deal: any = undefined;
          const dealMatch = rawNotes.match(/\[DEAL:([^|\]]+)\|([^|\]]+)\|([^|\]]+)\|?([^\]]*)\]/);
          if (dealMatch) {
            deal = { id: dealMatch[1], amount: dealMatch[2], status: dealMatch[3], className: dealMatch[4] || '' };
          }

          const cleanRequirement = rawNotes.replace(/\[ASSIGNED:[^\]]*\]/g, '').replace(/\[CLASS:[^\]]*\]/g, '').replace(/\[DEAL:[^\]]*\]/g, '').trim() || primaryInq.inquiryTargetOutcome || 'Cần tư vấn chi tiết';

          const cardItem: KanbanCardType = {
            id: String(l.id), name: l.leadName || 'Khách hàng', phone: l.leadPhone || 'Chưa có SĐT', email: l.leadEmail || '',
            date: l.dateCreated ? new Date(l.dateCreated).toLocaleDateString('vi-VN') : 'Hôm nay', courseType: primaryInq.inquiryTargetProgram || 'Khóa học',
            referenceId: `LEAD-${l.id}`, source: l.leadSource || 'Web Form', requirement: cleanRequirement,
            assignedTo, assignedName, selectedClass, deal,
            inquiries: leadInquiries.length > 0 ? leadInquiries.map((iq: any) => ({
              id: String(iq.id), targetProgram: iq.inquiryTargetProgram || 'Khóa học', targetOutcome: iq.inquiryTargetOutcome || 'Tư vấn lộ trình',
              notes: iq.inquiryNotes || '', status: iq.inquiryStatus === 3 ? 'Đã hoàn thành' : 'Đang xử lý', dateCreated: iq.dateCreated ? new Date(iq.dateCreated).toLocaleDateString('vi-VN') : 'Mới tạo'
            })) : [{ id: `INQ-${l.id}`, targetProgram: primaryInq.inquiryTargetProgram || 'Khóa học', targetOutcome: primaryInq.inquiryTargetOutcome || 'Cần tư vấn chi tiết', notes: primaryInq.inquiryNotes || 'Yêu cầu từ Form đăng ký', status: 'Đang xử lý', dateCreated: 'Hôm nay' }]
          };

          const leadStatus = Number(l.leadStatus);
          let statusTitle = 'Chưa phân công'; let statusColor = 'bg-indigo-500';

          if (leadStatus === 2) { statusTitle = 'Mới'; statusColor = 'bg-blue-500'; colMap.new.push({ ...cardItem, status: statusTitle, statusColor }); }
          else if (leadStatus === 3) { statusTitle = 'Đang tư vấn'; statusColor = 'bg-amber-500'; colMap.consulting.push({ ...cardItem, status: statusTitle, statusColor }); }
          else if (leadStatus === 4) { statusTitle = 'Chờ cọc'; statusColor = 'bg-yellow-500'; colMap.pending_deposit.push({ ...cardItem, status: statusTitle, statusColor }); }
          else if (leadStatus === 5) { statusTitle = 'Đã cọc'; statusColor = 'bg-orange-500'; colMap.deposited.push({ ...cardItem, status: statusTitle, statusColor }); }
          else if (leadStatus === 6) { statusTitle = 'Hoàn thành'; statusColor = 'bg-emerald-600'; colMap.completed.push({ ...cardItem, status: statusTitle, statusColor }); }
          else if (assignedTo) { statusTitle = 'Mới'; statusColor = 'bg-blue-500'; colMap.new.push({ ...cardItem, status: statusTitle, statusColor }); }
          else { statusTitle = 'Chưa phân công'; statusColor = 'bg-indigo-500'; colMap.unassigned.push({ ...cardItem, status: statusTitle, statusColor }); }
        });

        setData({
          columns: [
            { id: 'unassigned', title: 'Chưa phân công', color: 'bg-indigo-500', count: colMap.unassigned.length, cards: colMap.unassigned },
            { id: 'new', title: 'Mới', color: 'bg-blue-500', count: colMap.new.length, cards: colMap.new },
            { id: 'consulting', title: 'Đang tư vấn', color: 'bg-amber-500', count: colMap.consulting.length, cards: colMap.consulting },
            { id: 'pending_deposit', title: 'Chờ cọc', color: 'bg-yellow-500', count: colMap.pending_deposit.length, cards: colMap.pending_deposit },
            { id: 'deposited', title: 'Đã cọc', color: 'bg-orange-500', count: colMap.deposited.length, cards: colMap.deposited },
            { id: 'completed', title: 'Hoàn thành', color: 'bg-green-600', count: colMap.completed.length, cards: colMap.completed }
          ]
        });
      } catch (err) {
        // Fallback to mock data
        console.warn('Using mock data', err);
        const md = JSON.parse(JSON.stringify(initialKanbanData));
        const mappedCols = emptyKanbanData.columns.map(empCol => {
          let srcCol = md.columns.find((c: any) => c.id === empCol.id);
          // map deposit to pending_deposit for mock
          if (empCol.id === 'pending_deposit') srcCol = md.columns.find((c: any) => c.id === 'deposit');
          if (srcCol) {
            return { ...empCol, cards: srcCol.cards, count: srcCol.cards.length };
          }
          return empCol;
        });
        setData({ columns: mappedCols });
      }
    };
    loadData();
  }, []);

  const persistLeadToDB = async (leadId: string, statusNum: number, extraMeta: any) => {
    try {
      const headers: HeadersInit = {
        'Authorization': 'Basic ' + btoa('test@mekosoft.vn:admin'),
        'Content-Type': 'application/json'
      };
      const csrf = (window as any).Liferay?.authToken;
      if (csrf) headers['x-csrf-token'] = csrf;

      const rawReq = extraMeta.requirement || '';
      let metaTags = '';
      if (extraMeta.assignedTo) metaTags += `[ASSIGNED:${extraMeta.assignedTo}|${extraMeta.assignedName || 'Tư Vấn Viên 1'}] `;
      if (extraMeta.selectedClass) metaTags += `[CLASS:${extraMeta.selectedClass.id}|${extraMeta.selectedClass.code}|${extraMeta.selectedClass.name}|${extraMeta.selectedClass.fee}|${extraMeta.selectedClass.schedule}] `;
      if (extraMeta.deal) metaTags += `[DEAL:${extraMeta.deal.id}|${extraMeta.deal.amount}|${extraMeta.deal.status}|${extraMeta.deal.className || ''}] `;

      const cleanReq = rawReq.replace(/\[ASSIGNED:[^\]]*\]/g, '').replace(/\[CLASS:[^\]]*\]/g, '').replace(/\[DEAL:[^\]]*\]/g, '').trim();
      const finalNotes = (metaTags + cleanReq).trim();

      await fetch(`/o/c/leads/${leadId}`, { method: 'PATCH', headers, credentials: 'include', body: JSON.stringify({ leadStatus: statusNum, leadNotes: finalNotes }) });
    } catch (err) { console.error('Error persisting lead:', err); }
  };

  const persistAssignmentToDB = async (cardId: string, _saleId: string, saleName: string, note?: string) => {
    try {
      const headers: HeadersInit = { 'Authorization': 'Basic ' + btoa('test@mekosoft.vn:admin'), 'Content-Type': 'application/json' };
      const csrf = (window as any).Liferay?.authToken;
      if (csrf) headers['x-csrf-token'] = csrf;
      await fetch('/o/c/assignments', {
        method: 'POST', headers, credentials: 'include',
        body: JSON.stringify({ assignmentID: `ASN-${cardId}-${Date.now().toString().slice(-4)}`, assignmentAssignedAt: new Date().toISOString(), assignmentStatus: 'Đã phân công', assignmentNote: note ? `[${saleName}] ${note}` : `Phân công cho ${saleName}` })
      });
    } catch (err) { console.error('Error assignment:', err); }
  };

  const persistInquiryStatusToDB = async (inquiries?: any[], statusText?: string) => {
    if (!inquiries || inquiries.length === 0 || !statusText) return;
    try {
      const headers: HeadersInit = { 'Authorization': 'Basic ' + btoa('test@mekosoft.vn:admin'), 'Content-Type': 'application/json' };
      const csrf = (window as any).Liferay?.authToken;
      if (csrf) headers['x-csrf-token'] = csrf;
      for (const inq of inquiries) {
        if (inq.id && !String(inq.id).startsWith('INQ-')) {
          await fetch(`/o/c/inquiries/${inq.id}`, { method: 'PATCH', headers, credentials: 'include', body: JSON.stringify({ inquiryStatus: statusText }) });
        }
      }
    } catch (err) { }
  };


  const handleSelectClass = (cardId: string, classInfo: any) => {
    let targetCard: KanbanCardType | null = null;

    const newColumns = data.columns.map(col => {
      const found = col.cards.find(c => c.id === cardId);
      if (found) {
        targetCard = { ...found, selectedClass: classInfo };
        return {
          ...col,
          cards: col.cards.filter(c => c.id !== cardId),
          count: col.cards.filter(c => c.id !== cardId).length
        };
      }
      return col;
    });

    if (targetCard) {
      const consultingColIndex = newColumns.findIndex(c => c.id === 'consulting');
      if (consultingColIndex > -1) {
        newColumns[consultingColIndex].cards.unshift(targetCard);
        newColumns[consultingColIndex].count = newColumns[consultingColIndex].cards.length;
      }
      setData({ columns: newColumns });
      if (selectedCard && selectedCard.id === cardId) {
        setSelectedCard(targetCard);
      }
      persistLeadToDB(cardId, 3, targetCard);
      persistInquiryStatusToDB((targetCard as KanbanCardType).inquiries, 'Đang tư vấn');
      showToast(`Đã chọn lớp: ${classInfo.name} & chuyển sang Đang tư vấn`);
    }
  };

  const handleAssignSale = (cardId: string, saleId: string, saleName: string, assignNote?: string) => {
    let targetCard: KanbanCardType | null = null;

    const newColumns = data.columns.map(col => {
      const found = col.cards.find(c => c.id === cardId);
      if (found) {
        targetCard = {
          ...found,
          assignedTo: saleId,
          assignedName: saleName,
          status: saleId ? 'Mới' : 'Chưa phân công',
          statusColor: saleId ? 'bg-blue-500' : 'bg-indigo-500'
        };
        if (assignNote && assignNote.trim()) {
          const assignHistoryItem = {
            id: `h-assign-${Date.now()}`,
            date: new Date().toLocaleString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            }),
            author: currentRole === 'manager' ? 'Quản lý' : 'Tư Vấn Viên 1',
            tagText: 'PHÂN CÔNG',
            tagColor: 'bg-indigo-100 text-indigo-700',
            dotColor: 'bg-indigo-500',
            content: `Phân công cho ${saleName}. Ghi chú: ${assignNote}`
          };
          targetCard.history = [assignHistoryItem, ...(targetCard.history || [])];
        }
        return {
          ...col,
          cards: col.cards.filter(c => c.id !== cardId),
          count: col.cards.filter(c => c.id !== cardId).length
        };
      }
      return col;
    });

    if (targetCard) {
      const targetColId = saleId ? 'new' : 'unassigned';
      const colIndex = newColumns.findIndex(c => c.id === targetColId);
      if (colIndex > -1) {
        newColumns[colIndex].cards.unshift(targetCard);
        newColumns[colIndex].count = newColumns[colIndex].cards.length;
      }
      setData({ columns: newColumns });
      setSelectedCard(targetCard);

      const statusNum = saleId ? 2 : 1;
      const assignedCard = targetCard as KanbanCardType;
      persistLeadToDB(cardId, statusNum, assignedCard);
      if (saleId) {
        persistAssignmentToDB(cardId, saleId, saleName, assignNote);
        persistInquiryStatusToDB(assignedCard.inquiries, 'Đã phân công');
      } else {
        persistInquiryStatusToDB(assignedCard.inquiries, 'Chưa phân công');
      }

      showToast(saleId ? `✅ Đã phân công thành công cho ${saleName}! Hồ sơ đã chuyển sang cột MỚI.` : 'Đã đưa về Chưa phân công');
    }
  };

  const handleConfirmCompleteStudent = async (card: KanbanCardType, studentData: any) => {
    try {
      const headers: HeadersInit = {
        'Authorization': 'Basic ' + btoa('test@mekosoft.vn:admin'),
        'Content-Type': 'application/json'
      };
      const csrf = (window as any).Liferay?.authToken;
      if (csrf) headers['x-csrf-token'] = csrf;

      // 1. Tạo Student trong DB Liferay
      await fetch('/o/c/students', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          studentCode: studentData.studentCode,
          studentName: studentData.studentName,
          studentPhone: studentData.studentPhone,
          studentEmail: studentData.studentEmail || '',
          studentStatus: 1
        })
      });

      // 2. Chuyển thẻ sang cột Hoàn thành
      const completedCard: KanbanCardType = {
        ...card,
        status: 'Hoàn thành',
        statusColor: 'bg-emerald-600',
        deal: card.deal ? { ...card.deal, status: 'Hoàn thành' } : {
          id: `DEAL-${Date.now()}`,
          amount: studentData.fee,
          status: 'Hoàn thành',
          className: studentData.className
        }
      };

      const newColumns = data.columns.map(col => {
        if (col.id === 'completed') {
          return {
            ...col,
            cards: [completedCard, ...col.cards.filter(c => c.id !== card.id)],
            count: col.cards.filter(c => c.id !== card.id).length + 1
          };
        }
        return {
          ...col,
          cards: col.cards.filter(c => c.id !== card.id),
          count: col.cards.filter(c => c.id !== card.id).length
        };
      });

      setData({ columns: newColumns });
      if (selectedCard && selectedCard.id === card.id) {
        setSelectedCard(completedCard);
      }

      persistLeadToDB(card.id, 6, completedCard);
      persistInquiryStatusToDB(card.inquiries, 'Hoàn thành');

      showToast(`🎉 Chúc mừng! Đã tạo thành công Học viên "${studentData.studentName}" & hoàn tất hồ sơ!`);
    } catch (err) {
      console.error('Error completing student:', err);
      showToast('Có lỗi xảy ra khi tạo học viên, vui lòng thử lại.');
    }
    setCompleteStudentCard(null);
  };

  const handleCreateDeal = (cardId: string, dealInfo: any) => {
    let targetCard: KanbanCardType | null = null;
    let sourceColId: ColumnId | null = null;

    const newColumns = data.columns.map(col => {
      const found = col.cards.find(c => c.id === cardId);
      if (found) {
        sourceColId = col.id;
        targetCard = { ...found, deal: dealInfo };
        return {
          ...col,
          cards: col.cards.filter(c => c.id !== cardId),
          count: col.cards.filter(c => c.id !== cardId).length
        };
      }
      return col;
    });

    if (targetCard) {
      const destColId = (sourceColId === 'deposited' || sourceColId === 'completed') ? sourceColId : 'pending_deposit';
      const destColIndex = newColumns.findIndex(c => c.id === destColId);
      if (destColIndex > -1) {
        newColumns[destColIndex].cards.unshift(targetCard);
        newColumns[destColIndex].count = newColumns[destColIndex].cards.length;
      }
      setData({ columns: newColumns });
      setSelectedCard(targetCard);

      const targetStatusNum = columnToStatusNum(destColId);
      persistLeadToDB(cardId, targetStatusNum, targetCard);
      persistInquiryStatusToDB((targetCard as KanbanCardType).inquiries, columnToInquiryStatus(destColId));

      showToast(`✅ Đã tạo Deal (${dealInfo.amount}) cho "${(targetCard as KanbanCardType).name}"! Chuyển sang CHỜ CỌC.`);
    }
  };

  const handleSaveNote = (cardId: string, noteContent: string) => {
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
          }),
          author: currentRole === 'manager' ? 'Quản lý' : 'Tư Vấn Viên 1',
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
    showToast('Đã lưu ghi chú');
  };

  const onDragStart = (_start: DragStart) => {
    setIsDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === 'trash_cancelled') {
      const sourceColIndex = data.columns.findIndex(col => col.id === source.droppableId);
      if (sourceColIndex === -1) return;
      const sourceCol = data.columns[sourceColIndex];
      const sourceCards = Array.from(sourceCol.cards);
      const cardIndex = sourceCards.findIndex(c => c.id === result.draggableId);
      if (cardIndex === -1) return;
      const [removedCard] = sourceCards.splice(cardIndex, 1);

      const newColumns = [...data.columns];
      newColumns[sourceColIndex] = { ...sourceCol, cards: sourceCards, count: sourceCards.length };
      setData({ ...data, columns: newColumns });

      persistLeadToDB(removedCard.id, 0, { ...removedCard, requirement: '[HỦY HỒ SƠ] ' + removedCard.requirement });
      persistInquiryStatusToDB(removedCard.inquiries, 'Đã hủy');
      showToast(`Đã HỦY hồ sơ: ${removedCard.name} (${removedCard.referenceId})`);
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const cardId = result.draggableId;
    const sourceColIndex = data.columns.findIndex(col => col.id === source.droppableId);
    const destColIndex = data.columns.findIndex(col => col.id === destination.droppableId);
    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceCol = data.columns[sourceColIndex];
    const destCol = data.columns[destColIndex];
    const sourceCards = Array.from(sourceCol.cards);
    const destCards = Array.from(destCol.cards);

    const cardIndex = sourceCards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    let [movedCard] = sourceCards.splice(cardIndex, 1);

    const destId = destination.droppableId as ColumnId;
    const destStatusNum = columnToStatusNum(destId);

    if (destId === 'completed' && source.droppableId !== 'completed') {
      setCompleteStudentCard({ card: movedCard, sourceColId: source.droppableId as ColumnId });
      return;
    }

    movedCard = {
      ...movedCard,
      status: destCol.title,
      statusColor: destCol.color
    };

    if (destId === 'unassigned') {
      movedCard = { ...movedCard, assignedTo: '', assignedName: '' };
    } else if (!movedCard.assignedTo) {
      movedCard = { ...movedCard, assignedTo: 'sale01', assignedName: 'Tư Vấn Viên 1' };
      persistAssignmentToDB(movedCard.id, 'sale01', 'Tư Vấn Viên 1', 'Tự động phân công khi kéo sang ' + destCol.title);
    }

    if (destId === 'pending_deposit') {
      if (movedCard.deal) {
        movedCard = { ...movedCard, deal: { ...movedCard.deal, status: 'Chờ cọc' } };
      }
    }

    if (destId === 'deposited') {
      if (movedCard.deal) {
        movedCard = { ...movedCard, deal: { ...movedCard.deal, status: 'Đã cọc' } };
      } else {
        movedCard = {
          ...movedCard,
          deal: {
            id: `DEAL-${Date.now()}`,
            amount: movedCard.selectedClass?.fee || '5.000.000 đ',
            status: 'Đã cọc',
            className: movedCard.selectedClass?.name || 'Khóa học'
          }
        };
      }
    }

    persistLeadToDB(movedCard.id, destStatusNum, movedCard);
    persistInquiryStatusToDB(movedCard.inquiries, columnToInquiryStatus(destId));

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

      if (selectedCard && selectedCard.id === movedCard.id) {
        setSelectedCard(movedCard);
      }
      showToast(`✅ Cập nhật thành công: Đã chuyển "${movedCard.name}" sang cột "${destCol.title}"!`);
    }
  };

  const filterCard = (card: KanbanCardType) => {
    if (currentRole === 'sale') {
      if (card.assignedTo && card.assignedTo !== 'sale01') return false;
    }

    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      card.name.toLowerCase().includes(s) ||
      card.phone.toLowerCase().includes(s) ||
      (card.email && card.email.toLowerCase().includes(s)) ||
      (card.requirement && card.requirement.toLowerCase().includes(s)) ||
      (card.courseType && card.courseType.toLowerCase().includes(s))
    );
  };

  const visibleColumns = data.columns.filter(col => {
    if (col.id === 'unassigned') {
      return currentRole === 'manager';
    }
    return true;
  });

  const allLeads = data.columns.flatMap(col =>
    col.cards.map(card => ({
      ...card,
      statusTitle: col.title,
      statusColor: col.color
    }))
  ).filter(filterCard);

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-3 border border-gray-700 pointer-events-none transition-all"
          style={{ zIndex: 99999999 }}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Panel (Toolbar) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {activeView === 'kanban' ? <Kanban className="w-6 h-6 text-blue-600" /> : <Users className="w-6 h-6 text-blue-600" />}
            {activeView === 'kanban' ? 'Phễu tuyển sinh Kanban' : 'Khách hàng tiềm năng'}
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
            {currentRole === 'manager'
              ? <><ShieldAlert className="w-3.5 h-3.5 text-indigo-500" /> 👑 Vai trò Quản lý: Đang xem toàn bộ cột bao gồm Chưa phân công</>
              : <><User className="w-3.5 h-3.5 text-purple-500" /> 👤 Vai trò Sale: Chỉ xem các hồ sơ Mới được phân công & quy trình tư vấn</>}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('kanban')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeView === 'kanban' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setActiveView('leads')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeView === 'leads' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Dạng Bảng
            </button>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-indigo-50 p-1 rounded-lg border border-indigo-100">
            <button
              onClick={() => setCurrentRole('manager')}
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${currentRole === 'manager' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 hover:bg-indigo-100'
                }`}
            >
              <ShieldAlert className="w-4 h-4" /> Quản lý
            </button>
            <button
              onClick={() => setCurrentRole('sale')}
              className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${currentRole === 'sale' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-600 hover:bg-purple-100'
                }`}
            >
              <User className="w-4 h-4" /> Sale
            </button>
          </div>

          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 p-2 outline-none transition-all focus:bg-white"
              placeholder="Nhập Tên, SĐT..."
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeView === 'kanban' ? (
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4 h-full relative">
            {visibleColumns.map((column) => {
              const filteredCards = column.cards.filter(filterCard);
              const colData = {
                ...column,
                cards: filteredCards,
                count: filteredCards.length
              };
              return (
                <KanbanColumn
                  key={column.id}
                  column={colData}
                  onCardClick={(card) => setSelectedCard(card)}
                  onAssignClick={(card) => setAssignModalCard(card)}
                  onSelectClassClick={(card) => setClassModalCard(card)}
                  onDealClick={(card) => setDealModalCard(card)}
                />
              );
            })}
          </div>

          <Droppable droppableId="trash_cancelled">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 transition-all shadow-2xl ${isDragging ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-12 scale-90 pointer-events-none'
                  } ${snapshot.isDraggingOver
                    ? 'bg-red-600 text-white border-white scale-110 ring-4 ring-red-300'
                    : 'bg-red-50 text-red-600 border-red-300'
                  }`}
              >
                <Trash2 className="w-5 h-5 animate-pulse" />
                <span className="font-bold text-sm">
                  {snapshot.isDraggingOver ? 'Thả vào đây để HỦY hồ sơ' : 'Kéo vào đây để HỦY hồ sơ'}
                </span>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        /* VIEW 2: LEADS TABLE */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">Danh sách Khách hàng tiềm năng & Nhu cầu</h2>
            <span className="text-xs bg-white px-3 py-1 rounded-full font-bold text-gray-600 border border-gray-200">
              {allLeads.length} hồ sơ
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-3.5">Mã Lead</th>
                  <th className="px-6 py-3.5">Khách hàng</th>
                  <th className="px-6 py-3.5">Liên hệ</th>
                  <th className="px-6 py-3.5">Nhu cầu tư vấn</th>
                  <th className="px-6 py-3.5">Tư vấn viên</th>
                  <th className="px-6 py-3.5">Trạng thái phễu</th>
                  <th className="px-6 py-3.5">Deal / Lớp</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {allLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      Không tìm thấy hồ sơ nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  allLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedCard(lead)}
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                        {lead.referenceId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{lead.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{lead.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-gray-800">📞 {lead.phone}</div>
                        {lead.email && <div className="text-xs text-gray-500 mt-0.5">✉️ {lead.email}</div>}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-xs text-blue-800 bg-blue-50 border border-blue-100 rounded p-1.5 font-medium line-clamp-1">
                          🎯 {lead.requirement}
                        </div>
                        {lead.inquiries && lead.inquiries.length > 1 && (
                          <span className="text-[11px] text-blue-600 font-semibold block mt-1">
                            +{lead.inquiries.length} nhu cầu đã ghi nhận
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {lead.assignedName ? (
                          <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                            {lead.assignedName}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Chưa phân công</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                          {lead.statusTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {lead.deal ? (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            💰 {lead.deal.amount} ({lead.deal.status})
                          </span>
                        ) : lead.selectedClass ? (
                          <span className="text-xs text-emerald-700 font-medium">
                            {lead.selectedClass.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Chưa có</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCard(lead);
                          }}
                          className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded border border-blue-200 text-xs font-semibold transition"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DRAWERS & MODALS */}
      <CardDetailDrawer
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onSaveNote={handleSaveNote}
        onSelectClass={handleSelectClass}
        onCreateDeal={handleCreateDeal}
        isManager={currentRole === 'manager'}
        onAssignSale={handleAssignSale}
        onOpenAssignModal={(c) => setAssignModalCard(c)}
        onOpenClassModal={(c) => setClassModalCard(c)}
        onOpenDealModal={(c) => setDealModalCard(c)}
      />

      <AssignModal
        card={assignModalCard}
        onClose={() => setAssignModalCard(null)}
        onConfirm={handleAssignSale}
      />

      <ClassSelectModal
        card={classModalCard}
        classes={availableClasses}
        onClose={() => setClassModalCard(null)}
        onSelect={handleSelectClass}
      />

      <DealModal
        card={dealModalCard}
        onClose={() => setDealModalCard(null)}
        onConfirm={handleCreateDeal}
        onOpenClassModal={(c) => setClassModalCard(c)}
      />

      <CompleteStudentModal
        card={completeStudentCard?.card || null}
        onClose={() => setCompleteStudentCard(null)}
        onConfirm={handleConfirmCompleteStudent}
      />
    </div>
  );
};
