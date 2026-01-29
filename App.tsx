import React, { useState, useEffect, useMemo } from 'react';
import { Shop, Task, TaskType, TaskStatus, Update } from './types';
import { DashboardView } from './views/DashboardView';
import { ShopListView } from './views/ShopListView';
import { ShopDetailView } from './views/ShopDetailView';
import { Navbar } from './components/Navbar';
import { CreateTaskModal } from './components/__temp';
// import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { collection, addDoc, onSnapshot } from 'firebase/firestore';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'shops'>('dashboard');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);

  // 🔥 SINGLE SOURCE OF TRUTH
  const [shops, setShops] = useState<Shop[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  /* ---------------- FIRESTORE: SHOPS ---------------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'shops'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        updates: [],
        ...doc.data(),
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
  const addShop = async (
    newShop: Omit<Shop, 'id' | 'updates'>,
    initialNote?: string
  ) => {
    try {
      await addDoc(collection(db, 'shops'), {
        ...newShop,
        updates: initialNote
          ? [
            {
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              note: initialNote,
            },
          ]
          : [],
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Error adding shop:', err);
      alert('Failed to add shop');
    }
  };


  const updateShop = async (shopId: string, updates: Partial<Shop>) => {
  try {
    const shopRef = doc(db, "shops", shopId);
    await updateDoc(shopRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (err) {
    console.error("Error updating shop:", err);
    alert("Failed to update shop");
  }
};
  
const deleteShop = async (shopId: string) => {
  if (!confirm("Delete this shop permanently?")) return;

  try {
    await deleteDoc(doc(db, "shops", shopId));
    setSelectedShopId(null);
  } catch (err) {
    console.error("Error deleting shop:", err);
    alert("Failed to delete shop");
  }
};
  const addUpdate = async (shopId: string, note: string) => {
    try {
      const update = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        note,
      };

      const shopRef = doc(db, 'shops', shopId);

      await updateDoc(shopRef, {
        updates: arrayUnion(update),
      });
    } catch (err) {
      console.error('Error adding update:', err);
      alert('Failed to save update');
    }
  };

  /* ---------------- TASK LOGIC (LOCAL FOR NOW) ---------------- */
  const addTask = async (
    shopId: string,
    type: TaskType,
    dueDate: string,
    note?: string
  ) => {
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

  const testFirestore = async () => {
    try {
      await addDoc(collection(db, "test"), {
        message: "Firebase connected successfully",
        createdAt: new Date(),
      });
      alert("Firestore write successful!");
    } catch (err) {
      console.error(err);
      alert("Firestore write failed");
    }
  };

  // const migrateLocalDataToFirestore = async () => {
  //   const rawShops = localStorage.getItem('fs_shops');
  //   const rawTasks = localStorage.getItem('fs_tasks');

  //   if (!rawShops && !rawTasks) {
  //     alert('No local data found on this device');
  //     return;
  //   }

  //   const shops = rawShops ? JSON.parse(rawShops) : [];
  //   const tasks = rawTasks ? JSON.parse(rawTasks) : [];

  //   if (shops.length === 0 && tasks.length === 0) {
  //     alert('Local data is empty');
  //     return;
  //   }

  //   const confirmMigration = window.confirm(
  //     `⚠️ ONE-TIME MIGRATION\n\n` +
  //     `Shops: ${shops.length}\n` +
  //     `Tasks: ${tasks.length}\n\n` +
  //     `This should be done ONLY ONCE.\n\nProceed?`
  //   );

  //   if (!confirmMigration) return;

  //   try {
  //     /* ---------- MIGRATE SHOPS ---------- */
  //     for (const shop of shops) {
  //       const { id, updates, ...shopData } = shop;

  //       await addDoc(collection(db, 'shops'), {
  //         ...shopData,
  //         createdAt: serverTimestamp(),
  //       });
  //     }

  //     /* ---------- MIGRATE TASKS ---------- */
  //     for (const task of tasks) {
  //       const { id, ...taskData } = task;

  //       await addDoc(collection(db, 'tasks'), {
  //         ...taskData,
  //         createdAt: serverTimestamp(),
  //       });
  //     }

  //     alert('✅ Shops and Tasks migrated successfully');
  //   } catch (err) {
  //     console.error(err);
  //     alert('❌ Migration failed. Check console.');
  //   }
  // };



  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pt-16">

      {/* <button
        onClick={migrateLocalDataToFirestore}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'red',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontWeight: 'bold',
          zIndex: 9999,
        }}
      >
        ⚠️ Sync Old Data (ONE TIME)
      </button> */}

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
