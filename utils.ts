
import { Task, TaskStatus } from './types';

export const getTodayStr = () => new Date().toISOString().split('T')[0];

export const isToday = (dateString: string) => {
  return dateString === getTodayStr();
};

export const isOverdue = (dateString: string, status: TaskStatus) => {
  if (status === TaskStatus.COMPLETED) return false;
  return dateString < getTodayStr();
};

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getEffectiveTaskStatus = (task: Task): TaskStatus => {
  if (task.status === TaskStatus.COMPLETED) return TaskStatus.COMPLETED;
  if (isOverdue(task.dueDate, task.status)) return TaskStatus.OVERDUE;
  return TaskStatus.PENDING;
};
