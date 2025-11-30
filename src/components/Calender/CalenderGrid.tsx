
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format, isWithinInterval } from 'date-fns';
import type { Task } from '../../types/task';
import {
  buildMonthMatrix,
  clampDateRange,
  formatISODate,
  parseDateString,
} from '../../utils/date';
import { TaskBar } from './Taskbar';

interface CalendarGridProps {
  monthDate: Date;
  tasks: Task[];
  onRangeSelected: (start: Date, end: Date) => void;
  onTaskEdit: (task: Task) => void;
  onResizeStart: (taskId: string, edge: 'start' | 'end') => void;
  isResizing: boolean;
  resizeEdge: 'start' | 'end' | null;
  resizingTaskId: string | null;
  onResizeHover: (date: Date) => void;
}

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasksForDay: Task[];
  onMouseDownDay: (date: Date) => void;
  onMouseEnterDay: (date: Date, buttons: number) => void;
  onMouseUpDay: () => void;
  onTaskEdit: (task: Task) => void;
  onResizeStart: (taskId: string, edge: 'start' | 'end') => void;
  isResizing: boolean;
  resizeEdge: 'start' | 'end' | null;
  resizingTaskId: string | null;
}

const DayCell: React.FC<DayCellProps> = ({
  date,
  isCurrentMonth,
  isToday,
  tasksForDay,
  onMouseDownDay,
  onMouseEnterDay,
  onMouseUpDay,
  onTaskEdit,
  onResizeStart,
  isResizing,
  resizeEdge,
  resizingTaskId,
}) => {
  const dayId = formatISODate(date);
  const { setNodeRef } = useDroppable({
    id: dayId,
    data: { type: 'day', date: dayId },
  });

  return (
    <div
      ref={setNodeRef}
      className={`border border-gray-200 p-1 text-xs align-top min-h-[70px] relative ${
        isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
      } ${isToday ? 'bg-blue-50 border-blue-400' : ''}`}
      onMouseDown={(e) => {
        if (e.button === 0) onMouseDownDay(date);
      }}
      onMouseEnter={(e) => {
        onMouseEnterDay(date, e.buttons);
      }}
      onMouseUp={onMouseUpDay}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold">
          {format(date, 'd')}
        </span>
        {isToday && (
          <span className="text-[9px] px-1 py-[1px] rounded bg-blue-600 text-white">
            Today
          </span>
        )}
      </div>
      <div className="space-y-[2px]">
        {tasksForDay.map((task) => {
          const start = parseDateString(task.start);
          const end = parseDateString(task.end);
          const isStart = start.toDateString() === date.toDateString();
          const isEnd = end.toDateString() === date.toDateString();

          return (
            <TaskBar
              key={`${task.id}-${dayId}`}
              task={task}
              isStart={isStart}
              isEnd={isEnd}
              onOpenEdit={onTaskEdit}
              onResizeStart={onResizeStart}
            />
          );
        })}
      </div>

      {/* Resizing overlay */}
      {isResizing && resizeEdge && resizingTaskId && (
        <div className="pointer-events-none absolute inset-0 border border-dashed border-blue-400"></div>
      )}
    </div>
  );
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthDate,
  tasks,
  onRangeSelected,
  onTaskEdit,
  onResizeStart,
  isResizing,
  resizeEdge,
  resizingTaskId,
  onResizeHover,
}) => {
  const days = buildMonthMatrix(monthDate);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDownDay = (date: Date) => {
    if (isResizing) return;
    setDragStart(date);
    setDragEnd(date);
    setIsSelecting(true);
  };

  const handleMouseEnterDay = (date: Date, buttons: number) => {
    if (isResizing) {
      onResizeHover(date);
      return;
    }
    if (isSelecting && buttons === 1 && dragStart) {
      setDragEnd(date);
    }
  };

  const handleMouseUpDay = () => {
    if (isSelecting && dragStart && dragEnd) {
      const { start, end } = clampDateRange(dragStart, dragEnd);
      onRangeSelected(start, end);
    }
    setIsSelecting(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const selectedRange =
    dragStart && dragEnd ? clampDateRange(dragStart, dragEnd) : null;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Week header */}
      <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200 text-[11px] font-semibold text-gray-600">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="px-1 py-1 text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-xs">
        {days.map(({ date, isCurrentMonth, isToday }) => {
          const dayId = formatISODate(date);
          const tasksForDay = tasks.filter((task) =>
            isWithinInterval(date, {
              start: parseDateString(task.start),
              end: parseDateString(task.end),
            })
          );

          const isSelected =
            selectedRange &&
            isWithinInterval(date, {
              start: selectedRange.start,
              end: selectedRange.end,
            });

          return (
            <div key={dayId} className={isSelected ? 'bg-blue-50' : ''}>
              <DayCell
                date={date}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                tasksForDay={tasksForDay}
                onMouseDownDay={handleMouseDownDay}
                onMouseEnterDay={handleMouseEnterDay}
                onMouseUpDay={handleMouseUpDay}
                onTaskEdit={onTaskEdit}
                onResizeStart={onResizeStart}
                isResizing={isResizing}
                resizeEdge={resizeEdge}
                resizingTaskId={resizingTaskId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
