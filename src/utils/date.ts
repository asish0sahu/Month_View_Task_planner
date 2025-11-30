
import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const formatISODate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const parseDateString = (iso: string): Date => parseISO(iso);

export const buildMonthMatrix = (monthDate: Date): CalendarDay[] => {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });

  const days: CalendarDay[] = [];
  let current = start;

  while (current <= end) {
    days.push({
      date: current,
      isCurrentMonth: isSameMonth(current, monthDate),
      isToday: isToday(current),
    });
    current = addDays(current, 1);
  }

  return days;
};

export const getTaskDurationInDays = (startIso: string, endIso: string): number => {
  const start = parseISO(startIso);
  const end = parseISO(endIso);
  return differenceInCalendarDays(end, start) + 1;
};

export const clampDateRange = (start: Date, end: Date) => {
  return start <= end ? { start, end } : { start: end, end: start };
};
