
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';
import type { Task } from '../../types/task';
import { getTaskDurationInDays } from '../../utils/date';

const CATEGORY_COLORS: Record<string, string> = {
  todo: 'bg-blue-100 border-blue-400 text-blue-800',
  inProgress: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  review: 'bg-purple-100 border-purple-400 text-purple-800',
  completed: 'bg-green-100 border-green-400 text-green-800',
};

interface TaskBarProps {
  task: Task;
  isStart: boolean;
  isEnd: boolean;
  onOpenEdit: (task: Task) => void;
  onResizeStart: (taskId: string, edge: 'start' | 'end') => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  isStart,
  isEnd,
  onOpenEdit,
  onResizeStart,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: 'task' },
  });

  const style: React.CSSProperties = {};
  if (transform) {
    style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    style.zIndex = 10;
  }

  const duration = getTaskDurationInDays(task.start, task.end);

  return (
    <div
      ref={isStart ? setNodeRef : undefined}
      style={isStart ? style : undefined}
      className={clsx(
        'relative flex items-center rounded-md border px-1 py-0.5 text-[11px] mb-1 select-none cursor-pointer',
        CATEGORY_COLORS[task.category] ?? 'bg-slate-100 border-slate-400 text-slate-800',
        isDragging && 'opacity-70 shadow-lg'
      )}
      onDoubleClick={() => onOpenEdit(task)}
      {...(isStart ? listeners : {})}
      {...(isStart ? attributes : {})}
    >
      {/* Left resize handle */}
      {isStart && (
        <div
          className="w-1 h-3 bg-black/30 rounded-sm mr-1 cursor-ew-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(task.id, 'start');
          }}
        />
      )}

      <span className="truncate">
        {task.name}
        {isStart && duration > 1 && (
          <span className="ml-1 text-[10px] opacity-80">
            ({duration}d)
          </span>
        )}
      </span>

      {/* Right resize handle */}
      {isEnd && (
        <div
          className="ml-auto w-1 h-3 bg-black/30 rounded-sm cursor-ew-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(task.id, 'end');
          }}
        />
      )}
    </div>
  );
};
