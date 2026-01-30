
import React, { useState } from 'react';
import { Shop, Task, TaskType, TaskStatus, ShopStatus } from '../types';
import { formatDateTime, getEffectiveTaskStatus } from '../utils';

interface ShopDetailViewProps {
  shop: Shop;
  tasks: Task[];
  onBack: () => void;
  onAddUpdate: (shopId: string, note: string) => void;
  onAddTask: (shopId: string, type: TaskType, dueDate: string, note?: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onUpdateShop: (shopId: string, updates: Partial<Shop>) => void;
  onDeleteShop: (shopId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ShopDetailView: React.FC<ShopDetailViewProps> = ({
  shop, tasks, onBack, onAddUpdate, onAddTask, onUpdateTask, onUpdateShop, onDeleteShop, onDeleteTask
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'tasks' | 'edit'>('history');
  const [newNote, setNewNote] = useState('');
  const [newTaskType, setNewTaskType] = useState<TaskType>(TaskType.VISIT);
  const [newTaskDate, setNewTaskDate] = useState('');
  const [editName, setEditName] = useState(shop.name);
  const [editOwner, setEditOwner] = useState(shop.ownerName || '');
  const [editLocation, setEditLocation] = useState(shop.location);
  const [editStatus, setEditStatus] = useState(shop.status);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskType, setEditTaskType] = useState<TaskType>(TaskType.VISIT);
  const [editTaskDate, setEditTaskDate] = useState('');
  const [taskNote, setTaskNote] = useState<string>("");

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddUpdate(shop.id, newNote.trim());
    setNewNote(e.target.value);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDate) return alert('Select a due date');

    onAddTask(
      shop.id,
      newTaskType,
      newTaskDate,
      taskNote.trim() || undefined // 👈 ADD THIS
    );

    setNewTaskDate('');
    setTaskNote(''); // 👈 clear input
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShop(shop.id, {
      name: editName.trim(),
      ownerName: editOwner.trim() || undefined,
      location: editLocation.trim(),
      status: editStatus
    });
    setActiveSubTab('history');
  };

  const handleDeleteShop = () => {
    // e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to delete this shop? This action cannot be undone.');

    if (!confirmed) return;

    onDeleteShop(shop.id);

  };

  return (
    <div className="space-y-6 pb-12 text-black">
      <button onClick={onBack} className="flex items-center gap-2 text-black font-bold hover:opacity-70 transition-colors group">
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Shops
      </button>

      <header className="bg-white p-7 rounded-3xl border border-gray-100 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-extrabold text-black leading-tight">{shop.name}</h2>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-black bg-white text-black`}>{shop.status}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 mt-4">
              <div className="flex flex-col"><span className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest">Owner</span><span className="text-sm font-bold text-black">{shop.ownerName || 'Unknown'}</span></div>
              <div className="flex flex-col"><span className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest">Location</span><span className="text-sm font-bold text-black">{shop.location}</span></div>
              <div className="flex flex-col"><span className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest">Contact</span><span className="text-sm font-bold text-black font-mono">{shop.phoneNumber}</span></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveSubTab('edit')} className={`p-3 rounded-2xl border transition-all ${activeSubTab === 'edit' ? 'bg-black !text-white border-black' : 'bg-white text-black border-gray-100'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            {/* <button onClick={()=> handleDeleteShop}  className="p-2 opacity-30 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button> */}
          </div>
        </div>
        <div className="flex mt-8 border-b border-gray-50 -mx-7 px-7">
          <button onClick={() => setActiveSubTab('history')} className={`px-5 py-3 text-sm font-bold border-b-4 ${activeSubTab === 'history' ? 'border-black text-black' : 'border-transparent text-black opacity-40'}`}>History</button>
          <button onClick={() => setActiveSubTab('tasks')} className={`px-5 py-3 text-sm font-bold border-b-4 ${activeSubTab === 'tasks' ? 'border-black text-black' : 'border-transparent text-black opacity-40'}`}>Tasks ({tasks.filter(t => t.status !== TaskStatus.COMPLETED).length})</button>
        </div>
      </header>

      {activeSubTab === 'history' && (
        <div className="space-y-6">
          <form onSubmit={handleAddUpdate} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Write visit notes here..." className="w-full rounded-2xl border-gray-100 p-4 bg-white text-black text-sm" />
            <button type="submit" className="bg-black !text-white font-extrabold py-3 rounded-2xl shadow-lg">Save Update</button>
          </form>
          <div className="space-y-4">
            {shop.updates.map((update, idx) => (
              <div key={update.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-[10px] font-bold text-black opacity-40">{formatDateTime(update.timestamp)}</span>
                <p className="text-black text-sm font-bold mt-1">{update.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'tasks' && (
        <div className="space-y-6">
          <form onSubmit={handleAddTask} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select value={newTaskType} onChange={e => setNewTaskType(e.target.value as TaskType)} className="p-3 rounded-xl border-gray-100 bg-white font-bold text-sm">
                {Object.values(TaskType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} className="p-3 rounded-xl border-gray-100 bg-white font-bold text-sm" />
            </div>
            <label htmlFor="Name">
              <input type="text" value={taskNote} onChange={e => setTaskNote(e.target.value)} placeholder="Enter Text" className="mt-1 block w-full rounded-xl border-gray-200 border p-3 shadow-sm focus:border-black focus:ring-black text-black bg-white" />
            </label>
            <button type="submit" className="w-full bg-black !text-white font-extrabold py-3.5 rounded-2xl shadow-lg">Create Task</button>
          </form>
          {tasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
              <input type="checkbox" checked={task.status === TaskStatus.COMPLETED} onChange={(e) => onUpdateTask(task.id, { status: e.target.checked ? TaskStatus.COMPLETED : TaskStatus.PENDING })} className="w-6 h-6 rounded-lg border-gray-300 text-black" />
              <div className="flex-1 flex flex-col">
                <span className="font-extrabold text-sm text-black">
                  {task.type}
                </span>

                {task.note && (
                  <span className="text-[11px] text-black opacity-60">
                    {task.note}
                  </span>
                )}

                <span className="text-[11px] font-bold opacity-60 mt-1">
                  Due: {task.dueDate}
                </span>
              </div>

              <button onClick={() => onDeleteTask(task.id)} className="p-2 opacity-30 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'edit' && (
        <form onSubmit={handleSaveEdits} className="bg-white p-7 rounded-3xl border border-gray-100 shadow-xl space-y-5">
          <input required type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3.5 border border-gray-100 bg-white rounded-2xl text-sm font-bold" placeholder="Shop Name" />
          <input type="text" value={editOwner} onChange={e => setEditOwner(e.target.value)} className="w-full p-3.5 border border-gray-100 bg-white rounded-2xl text-sm font-bold" placeholder="Owner Name" />
          <input required type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} className="w-full p-3.5 border border-gray-100 bg-white rounded-2xl text-sm font-bold" placeholder="Location" />
          <select value={editStatus} onChange={e => setEditStatus(e.target.value as ShopStatus)} className="w-full p-3.5 border border-gray-100 bg-white rounded-2xl text-sm font-bold">
            {Object.values(ShopStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={() => onDeleteShop(shop.id)} className="flex-1 border border-red-600 text-red-600 font-bold py-3.5 rounded-2xl text-sm">Delete Shop</button>
            <button type="submit" className="flex-1 bg-black !text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg">Save</button>
          </div>
        </form>
      )}
    </div>
  );
};
