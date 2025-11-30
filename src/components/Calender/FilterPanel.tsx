import React from 'react';
import type { Filters, TaskCategory, TimeWindow } from '../../types/task';

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  todo: 'To Do',
  inProgress: 'In Progress',
  review: 'Review',
  completed: 'Completed',
};

const TIME_OPTIONS: { label: string; value: TimeWindow }[] = [
  { label: 'All time', value: null },
  { label: 'Tasks within 1 week', value: 7 },
  { label: 'Tasks within 2 weeks', value: 14 },
  { label: 'Tasks within 3 weeks', value: 21 },
];

interface FiltersPanelProps {
  filters: Filters;
  onChange: (next: Filters) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, onChange }) => {
  const toggleCategory = (cat: TaskCategory) => {
    const exists = filters.categories.includes(cat);
    const categories = exists
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];

    onChange({ ...filters, categories });
  };

  const setTimeWindow = (tw: TimeWindow) => {
    onChange({ ...filters, timeWindow: tw });
  };

  const setSearch = (search: string) => {
    onChange({ ...filters, search });
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 mb-4 flex flex-col gap-3">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Search by task name
        </label>
        <input
          className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Type to search..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category filters */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1">
          Category filters
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((cat) => (
            <label key={cat} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span>{CATEGORY_LABELS[cat]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time window */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1">
          Time-based filters
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          {TIME_OPTIONS.map((opt) => (
            <label
              key={opt.label}
              className="inline-flex items-center gap-1 cursor-pointer"
            >
              <input
                type="radio"
                name="timeWindow"
                checked={filters.timeWindow === opt.value}
                onChange={() => setTimeWindow(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};