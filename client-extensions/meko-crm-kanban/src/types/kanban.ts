export type ColumnId = 'unassigned' | 'new' | 'consulting' | 'pending_deposit' | 'deposited' | 'deposit' | 'completed' | 'cancelled';

export interface HistoryItem {
  id: string;
  date: string;
  author: string;
  tagText: string;
  tagColor: string;
  dotColor: string;
  content: string;
}

export interface InquiryItem {
  id: string;
  targetProgram?: string;
  targetOutcome?: string;
  notes?: string;
  status?: string;
  dateCreated?: string;
}

export interface KanbanCardType {
  id: string;
  name: string;
  phone: string;
  date: string;
  courseType: string;
  tagText?: string;
  tagColor?: string;
  referenceId: string;
  source?: string;
  email?: string;
  requirement?: string;
  status?: string;
  statusColor?: string;
  assignedTo?: string;
  assignedName?: string;
  deal?: {
    id?: string;
    code?: string;
    amount?: string;
    status?: string; // 'Chờ cọc' | 'Đã cọc' | 'Hoàn thành'
    classId?: string;
    className?: string;
  };
  selectedClass?: {
    id: string;
    code: string;
    name: string;
    schedule: string;
    fee: string;
    room?: string;
  };
  inquiries?: InquiryItem[];
  history?: HistoryItem[];
}

export interface KanbanColumnType {
  id: ColumnId;
  title: string;
  color: string;
  count: number;
  cards: KanbanCardType[];
}

export interface KanbanBoardData {
  columns: KanbanColumnType[];
}
