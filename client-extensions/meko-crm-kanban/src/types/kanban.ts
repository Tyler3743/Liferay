export type ColumnId = 'new' | 'consulting' | 'deposit' | 'completed' | 'cancelled';

export interface HistoryItem {
  id: string;
  date: string;
  author: string;
  tagText: string;
  tagColor: string;
  dotColor: string;
  content: string;
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
  requirement?: string;
  status?: string;
  statusColor?: string;
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
