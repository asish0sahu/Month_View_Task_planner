

import React, { useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useTaskContext } from "../../context/useTaskContext";
import { CalendarGrid } from "./CalenderGrid";
import { FiltersPanel } from "./FilterPanel";
import { TaskModal } from "./TaskModal";
import type { Task, TaskCategory } from "../../types/task";
import { parseDateString, clampDateRange, formatISODate } from "../../utils/date";

export const MonthTaskPlanner: React.FC = () => {
  const {
    tasks,
    filters,
    currentMonth,
    setFilters,
    goPrevMonth,
    goNextMonth,

    // task operations
    createTask,
    editTask,
    moveTask,

    // resizing
    startResize,
    hoverResize,
    endResize,
    isResizing,
    resizeEdge,
    resizingTaskId,
  } = useTaskContext();

  // For new-task selection dragging (start → end)
  const [selectionRange, setSelectionRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ------------------------------
  // Create selection → open modal
  // ------------------------------
  const handleRangeSelected = (start: Date, end: Date) => {
    setSelectionRange({ start, end });
    setEditingTask(null);
    setModalOpen(true);
  };

  // ------------------------------
  // Save modal (create or edit)
  // ------------------------------
  const handleSaveModal = (payload: { name: string; category: TaskCategory }) => {
    if (editingTask) {
      // Edit existing
      editTask(editingTask, payload.name, payload.category);
    } else if (selectionRange) {
      // Create new
      createTask(selectionRange.start, selectionRange.end, payload.name, payload.category);
    }

    setModalOpen(false);
    setSelectionRange(null);
    setEditingTask(null);
  };

  // ------------------------------
  // Open modal when editing
  // ------------------------------
  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // ------------------------------
  // Handle drag-move on task bars
  // ------------------------------
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overData = over.data.current as { type?: string; date?: string } | null;
    if (!overData || overData.type !== "day" || !overData.date) return;

    const taskId = active.id as string;
    const targetDate = parseDateString(overData.date);

    moveTask(taskId, targetDate);
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto p-4 bg-slate-50 min-h-screen"
      onMouseUp={endResize}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Month View Task Planner</h1>
          <p className="text-sm text-gray-600">
            Drag across days to create tasks. Drag tasks to move. Stretch edges to resize.
          </p>
        </div>

        {/* Month Nav */}
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-sm rounded-md border bg-white hover:bg-gray-100"
            onClick={goPrevMonth}
          >
            ‹
          </button>
          <span className="font-semibold text-sm">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            className="px-2 py-1 text-sm rounded-md border bg-white hover:bg-gray-100"
            onClick={goNextMonth}
          >
            ›
          </button>
        </div>
      </div>

      {/* Filters */}
      <FiltersPanel filters={filters} onChange={setFilters} />

      {/* Calendar Grid + Drag Context */}
      <DndContext onDragEnd={handleDragEnd}>
        <CalendarGrid
          monthDate={currentMonth}
          tasks={tasks}
          onRangeSelected={handleRangeSelected}
          onTaskEdit={handleTaskEdit}
          onResizeStart={startResize}
          onResizeHover={hoverResize}
          isResizing={isResizing}
          resizeEdge={resizeEdge}
          resizingTaskId={resizingTaskId}
        />
      </DndContext>

      {/* Modal */}
      <TaskModal
        isOpen={modalOpen}
        initialTask={editingTask ?? undefined}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
          setSelectionRange(null);
        }}
        onSave={handleSaveModal}
      />
    </div>
  );
};
