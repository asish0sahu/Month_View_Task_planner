import { createContext, useContext } from "react";
import type { TaskContextType } from "./TaskContextTypes";

export const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("TaskContext missing — wrap inside <TaskProvider>");
  return ctx;
};
