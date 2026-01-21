import React, { useState, useEffect, useMemo } from 'react';
import { Shop, Task, TaskType, TaskStatus, Update } from './types';
import { DashboardView } from './views/DashboardView';
import { ShopListView } from './views/ShopListView';
import { ShopDetailView } from './views/ShopDetailView';
import { Navbar } from './components/Navbar';
import { CreateTaskModal } from './components/__temp';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'shops'>('dashboard');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('fs_shops');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('fs_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fs_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('fs_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const uniqueLocations = useMemo(
    () => Array.from(new Set(shops.map(s => s.location).filter(Boolean))),
    [shops]
  );

  /* ---------------- SHOP LOGIC ---------------- */

  const addShop = (newShop: Omit<Shop, 'id' | 'updates'>, initialNote?: string) => {
    const id = crypto.randomUUID();
    const updates: Update[] = initialNote
      ? [{ id: crypto.randomUUID(), timestamp: new Date().toISOString(), note: initialNote }]
      : [];

    setShops(prev => [...prev, { ...newShop, id, updates }]);
  };

  const updateShop = (shopId: string, updates: Partial<Shop>) =>
    setShops(prev => prev.map(s => (s.id === shopId ? { ...s, ...updates } : s)));

  const deleteShop = (shopId: string) => {
    if (!confirm('Delete everything?')) return;
    setShops(prev => prev.filter(s => s.id !== shopId));
    setTasks(prev => prev.filter(t => t.shopId !== shopId));
    setSelectedShopId(null);
  };

  const addUpdate = (shopId: string, note: string) => {
    const update: Update = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      note,
    };

    setShops(prev =>
      prev.map(s =>
        s.id === shopId ? { ...s, updates: [update, ...s.updates] } : s
      )
    );
  };

  /* ---------------- TASK LOGIC ---------------- */

  const addTask = (shopId: string, type: TaskType, dueDate: string, note?: string) => {
    setTasks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        shopId,
        type,
        dueDate,
        status: TaskStatus.PENDING,
        note,
      },
    ]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) =>
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, ...updates } : t)));

  const deleteTask = (taskId: string) =>
    setTasks(prev => prev.filter(t => t.id !== taskId));

  const activeShop = useMemo(
    () => shops.find(s => s.id === selectedShopId) || null,
    [shops, selectedShopId]
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-16">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'dashboard') setSelectedShopId(null);
        }}
      />

      <main className="max-w-xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            shops={shops}
            onTaskStatusChange={(id, status) =>
              updateTask(id, { status })
            }
            onShopSelect={(id) => {
              setSelectedShopId(id);
              setActiveTab('shops');
            }}
            onOpenCreateTask={() => setShowCreateTask(true)}
          />
        )}

        {showCreateTask && (
          <CreateTaskModal
            shops={shops}
            onClose={() => setShowCreateTask(false)}
            onCreate={addTask}
          />
        )}

        {activeTab === 'shops' && !selectedShopId && (
          <ShopListView
            shops={shops}
            tasks={tasks}
            onAddShop={addShop}
            onSelectShop={setSelectedShopId}
            locations={uniqueLocations}
          />
        )}

        {activeTab === 'shops' && activeShop && (
          <ShopDetailView
            shop={activeShop}
            tasks={tasks.filter(t => t.shopId === activeShop.id)}
            onBack={() => setSelectedShopId(null)}
            onAddUpdate={addUpdate}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onUpdateShop={updateShop}
            onDeleteShop={deleteShop}
            onDeleteTask={deleteTask}
          />
        )}
      </main>
    </div>
  );
};

export default App;
