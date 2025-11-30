import React, { useState } from "react";
import { TaskContext } from "./useTaskContext";
import type { TaskContextType } from "./TaskContextTypes";

import { addDays, addMonths } from "date-fns";

import type { Task, Filters, TaskCategory } from "../types/task";
import { parseDateString, formatISODate, getTaskDurationInDays } from "../utils/date";

const today = new Date();

const defaultFilters: Filters = {
  categories: ["todo", "inProgress", "review", "completed"],
  timeWindow: null,
  search: "",
};

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState<"start" | "end" | null>(null);
  const [resizingTaskId, setResizingTaskId] = useState<string | null>(null);

  const createTask = (start: Date, end: Date, name: string, category: TaskCategory) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      category,
      start: formatISODate(start),
      end: formatISODate(end),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const editTask = (task: Task, name: string, category: TaskCategory) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, name, category } : t))
    );
  };

  const moveTask = (taskId: string, targetDate: Date) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const duration = getTaskDurationInDays(task.start, task.end);
        const newEnd = addDays(targetDate, duration - 1);
        return {
          ...task,
          start: formatISODate(targetDate),
          end: formatISODate(newEnd),
        };
      })
    );
  };

  const startResize = (taskId: string, edge: "start" | "end") => {
    setIsResizing(true);
    setResizeEdge(edge);
    setResizingTaskId(taskId);
  };

  const hoverResize = (date: Date) => {
    if (!isResizing || !resizeEdge || !resizingTaskId) return;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== resizingTaskId) return task;

        const start = parseDateString(task.start);
        const end = parseDateString(task.end);

        if (resizeEdge === "start") {
          return { ...task, start: formatISODate(date <= end ? date : end) };
        } else {
          return { ...task, end: formatISODate(date >= start ? date : start) };
        }
      })
    );
  };

  const endResize = () => {
    setIsResizing(false);
    setResizeEdge(null);
    setResizingTaskId(null);
  };

  const value: TaskContextType = {
    tasks,
    filters,
    currentMonth,
    createTask,
    editTask,
    moveTask,
    startResize,
    hoverResize,
    endResize,
    setFilters,
    goPrevMonth: () => setCurrentMonth((prev) => addMonths(prev, -1)),
    goNextMonth: () => setCurrentMonth((prev) => addMonths(prev, 1)),
    isResizing,
    resizeEdge,
    resizingTaskId,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
