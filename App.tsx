import React, { useState, useEffect, useMemo } from 'react';
import { Shop, Task, TaskType, TaskStatus } from './types';
import { DashboardView } from './views/DashboardView';
import { ShopListView } from './views/ShopListView';
import { ShopDetailView } from './views/ShopDetailView';
import { Navbar } from './components/Navbar';
import { CreateTaskModal } from './components/__temp';
import { StatsDashboardView } from './views/StatsDashboardView';
import  LoginView  from './views/LoginView';

import { db } from './src/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";

const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'shops' | 'stats'>('dashboard');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const [shops, setShops] = useState<Shop[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // ✅ Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  /* ---------------- FIRESTORE: SHOPS ---------------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'shops'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Shop, 'id'>),
        updates: doc.data().updates || [],
      })) as Shop[];

      setShops(data);
    });

    return () => unsub();
  }, []);

  /* ---------------- LOCATIONS ---------------- */
  const uniqueLocations = useMemo(
    () => Array.from(new Set(shops.map(s => s.location).filter(Boolean))),
    [shops]
  );

  /* ---------------- SHOP LOGIC ---------------- */
  const addShop = async (newShop: Omit<Shop, 'id' | 'updates'>, initialNote?: string) => {
    await addDoc(collection(db, 'shops'), {
      ...newShop,
      updates: initialNote
        ? [{
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            note: initialNote,
          }]
        : [],
      createdAt: new Date(),
    });
  };

  const updateShop = async (shopId: string, updates: Partial<Shop>) => {
    await updateDoc(doc(db, "shops", shopId), updates);
  };

  const deleteShop = async (shopId: string) => {
    await deleteDoc(doc(db, "shops", shopId));
    setSelectedShopId(null);
  };

  const addUpdate = async (shopId: string, note: string) => {
    const update = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      note,
    };

    await updateDoc(doc(db, 'shops', shopId), {
      updates: arrayUnion(update),
    });
  };

  /* ---------------- TASK LOGIC ---------------- */
  const addTask = async (shopId: string, type: TaskType, dueDate: string, note?: string) => {
    await addDoc(collection(db, "tasks"), {
      shopId,
      type,
      dueDate,
      status: TaskStatus.PENDING,
      note: note || "",
      createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks(data);
    });

    return () => unsub();
  }, []);

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    await updateDoc(doc(db, "tasks", taskId), updates);
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const activeShop = useMemo(
    () => shops.find(s => s.id === selectedShopId) || null,
    [shops, selectedShopId]
  );

  // 🚀 AUTH CHECK
  if (!isAuthenticated) {
    return (
      <LoginView onLogin={() => setIsAuthenticated(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-16">

      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'shops') setSelectedShopId(null);
        }}
        onLogout={() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
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

        {activeTab === 'stats' && (
          <StatsDashboardView shops={shops} tasks={tasks} />
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