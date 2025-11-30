export type TaskCategory = 'todo' | 'inProgress' | 'review' | 'completed';

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  start: string; // ISO yyyy-MM-dd
  end: string;   // ISO yyyy-MM-dd
}

export type TimeWindow = 7 | 14 | 21 | null;

export interface Filters {
  categories: TaskCategory[];
  timeWindow: TimeWindow;
  search: string;
}