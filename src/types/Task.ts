export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
  priority: 'low' | 'medium' | 'high';
  date: Date;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
  notes?: string;
}

export type ViewType = 'today' | 'calendar' | 'all';