import React, { useMemo } from 'react';
import { Task, Shop, TaskStatus } from '../types';
import { isToday, isOverdue } from '../utils';

interface DashboardViewProps {
  tasks: Task[];
  shops: Shop[];
  onTaskStatusChange: (id: string, status: TaskStatus) => void;
  onShopSelect: (id: string) => void;
  onOpenCreateTask: () => void;
}

/* ✅ SORT HELPER (Dashboard-only logic) */
const sortTasksByDueDate = (tasks: Task[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);

    const overdueA = dateA < today;
    const overdueB = dateB < today;

    // 1️⃣ Overdue first
    if (overdueA && !overdueB) return -1;
    if (!overdueA && overdueB) return 1;

    // 2️⃣ Then by due date
    return dateA.getTime() - dateB.getTime();
  });
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  shops,
  onTaskStatusChange,
  onShopSelect,
  onOpenCreateTask,
}) => {
  const groupedTasks = useMemo(() => {
    const relevant = tasks.filter(
      (t) => t.status !== TaskStatus.COMPLETED
    );

    const groups: Record<string, { shop: Shop; tasks: Task[] }> = {};

    relevant.forEach((task) => {
      if (!groups[task.shopId]) {
        const shop = shops.find((s) => s.id === task.shopId);
        if (shop) {
          groups[task.shopId] = { shop, tasks: [] };
        }
      }
      groups[task.shopId]?.tasks.push(task);
    });

    // ✅ SORT TASKS INSIDE EACH SHOP
    Object.values(groups).forEach((group) => {
      group.tasks = sortTasksByDueDate(group.tasks);
    });

    // Optional: sort shops alphabetically
    return Object.values(groups).sort((a, b) => {
      const aDate = new Date(a.tasks[0].dueDate).getTime();
      const bDate = new Date(b.tasks[0].dueDate).getTime();
      return aDate - bDate;
    }
    );
  }, [tasks, shops]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-black tracking-tight">
            Today&apos;s Agenda
          </h2>
          <p className="text-black opacity-60 mt-1">
            Pending tasks and missed follow-ups.
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="bg-black !text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800 transition"
        >
          + Create Task
        </button>
      </header>

      {/* EMPTY STATE */}
      {groupedTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Clear Schedule</h3>
          <p className="opacity-50 mt-2">
            No tasks due today or overdue.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTasks.map((group) => (
            <div
              key={group.shop.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* SHOP HEADER */}
              <button
                onClick={() => onShopSelect(group.shop.id)}
                className="w-full text-left bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold">{group.shop.name}</h4>
                  <p className="text-[10px] opacity-60 font-mono uppercase tracking-widest">
                    {group.shop.location}
                  </p>
                </div>
                <span className="opacity-40">›</span>
              </button>

              {/* TASKS */}
              <div className="divide-y divide-gray-50">
                {group.tasks.map((task) => {
                  const overdue = isOverdue(task.dueDate, task.status);

                  return (
                    <div
                      key={task.id}
                      className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={task.status === TaskStatus.COMPLETED}
                        onChange={(e) =>
                          onTaskStatusChange(
                            task.id,
                            e.target.checked
                              ? TaskStatus.COMPLETED
                              : TaskStatus.PENDING
                          )
                        }
                        className="w-5 h-5 mt-1 cursor-pointer"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{task.type}</span>
                          {overdue && (
                            <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase">
                              Overdue
                            </span>
                          )}
                        </div>

                        {task.note && (
                          <p className="text-xs opacity-60 mt-0.5">
                            {task.note}
                          </p>
                        )}

                        <p className="text-xs opacity-60 mt-1">
                          Due: {task.dueDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
