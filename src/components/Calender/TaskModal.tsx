
import React, { useEffect, useState } from 'react';
import type { Task, TaskCategory } from '../../types/task';

const CATEGORY_OPTIONS: { value: TaskCategory; label: string }[] = [
  { value: 'todo',       label: 'To Do' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'review',     label: 'Review' },
  { value: 'completed',  label: 'Completed' },
];

interface TaskModalProps {
  isOpen: boolean;
  initialTask?: Partial<Task>;
  onClose: () => void;
  onSave: (payload: { name: string; category: TaskCategory }) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  initialTask,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TaskCategory>('todo');

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialTask?.name ?? '');
      setCategory(initialTask?.category ?? 'todo');
    }
  }, [isOpen, initialTask]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), category });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            {initialTask?.id ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Task name</label>
            <input
              className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
