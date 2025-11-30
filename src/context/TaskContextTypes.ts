import type { Task, Filters, TaskCategory } from "../types/task";

export interface TaskContextType {
  tasks: Task[];
  filters: Filters;
  currentMonth: Date;

  createTask: (start: Date, end: Date, name: string, category: TaskCategory) => void;
  editTask: (task: Task, name: string, category: TaskCategory) => void;
  moveTask: (taskId: string, targetDate: Date) => void;

  startResize: (taskId: string, edge: "start" | "end") => void;
  hoverResize: (date: Date) => void;
  endResize: () => void;

  setFilters: (f: Filters) => void;
  goPrevMonth: () => void;
  goNextMonth: () => void;

  isResizing: boolean;
  resizeEdge: "start" | "end" | null;
  resizingTaskId: string | null;
}

