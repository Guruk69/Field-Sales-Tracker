 
import React, { useMemo } from 'react';
import { Task, Shop, TaskStatus } from '../types';
import { isToday, isOverdue } from '../utils';

interface DashboardViewProps {
  tasks: Task[];
  shops: Shop[];
  onTaskStatusChange: (id: string, status: TaskStatus) => void;
  onShopSelect: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ tasks, shops, onTaskStatusChange, onShopSelect }) => {
  const groupedTasks = useMemo(() => {
    const relevant = tasks.filter(t =>  
      (isToday(t.dueDate) || isOverdue(t.dueDate, t.status)) && 
      t.status !== TaskStatus.COMPLETED
    );

    const groups: Record<string, { shop: Shop, tasks: Task[] }> = {};
    relevant.forEach(task => {
      if (!groups[task.shopId]) {
        const shop = shops.find(s => s.id === task.shopId);
        if (shop) groups[task.shopId] = { shop, tasks: [] };
      }
      if (groups[task.shopId]) {
        groups[task.shopId].tasks.push(task);
      }
    });
    return Object.values(groups).sort((a, b) => a.shop.name.localeCompare(b.shop.name));
  }, [tasks, shops]);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-black tracking-tight">Today's Agenda</h2>
        <p className="text-black opacity-60 mt-1">Pending tasks and missed follow-ups.</p>
      </header>

      {groupedTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="bg-green-100 text-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-black">Clear Schedule</h3>
          <p className="text-black opacity-50 mt-2">No tasks due today or overdue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedTasks.map(group => (
            <div key={group.shop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => onShopSelect(group.shop.id)}
                className="w-full text-left bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex justify-between items-center group"
              >
                <div>
                  <h4 className="font-bold text-black group-hover:text-blue-600 transition-colors">{group.shop.name}</h4>
                  <p className="text-[10px] text-black opacity-60 font-mono uppercase tracking-widest">{group.shop.location}</p>
                </div>
                <svg className="w-4 h-4 text-black opacity-30 group-hover:opacity-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="divide-y divide-gray-50">
                {group.tasks.map(task => {
                  const overdue = isOverdue(task.dueDate, task.status);
                  return (
                    <div key={task.id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50/30 transition-colors text-black">
                      <div className="pt-1">
                        <input 
                          type="checkbox" 
                          checked={task.status === TaskStatus.COMPLETED}
                          onChange={(e) => onTaskStatusChange(task.id, e.target.checked ? TaskStatus.COMPLETED : TaskStatus.PENDING)}
                          className="w-5 h-5 rounded-md border-gray-300 text-black focus:ring-black cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${overdue ? 'text-black' : 'text-black'}`}>
                            {task.type}
                          </span>
                          {overdue && (
                            <span className="bg-red-50 text-black text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tight border border-red-100">Overdue</span>
                          )}
                        </div>
                        <p className="text-xs text-black opacity-60 mt-0.5 font-medium">Due: {task.dueDate}</p>
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
