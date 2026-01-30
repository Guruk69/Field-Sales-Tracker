
import React, { useState, useMemo, useEffect } from 'react';
import { Shop, ShopStatus, Task, TaskStatus } from '../types';
import { getEffectiveTaskStatus } from '../utils';

interface ShopListViewProps {
  shops: Shop[];
  tasks: Task[];
  onAddShop: (shop: Omit<Shop, 'id' | 'updates'>, initialNote?: string) => void;
  onSelectShop: (id: string) => void;
  locations: string[];
}

export const ShopListView: React.FC<ShopListViewProps> = ({ shops, tasks, onAddShop, onSelectShop, locations }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ShopStatus | 'all'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterPendingTasks, setFilterPendingTasks] = useState<boolean>(() => {
    const saved = localStorage.getItem('filter_pending_tasks');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(
      'filter_pending_tasks',
      String(filterPendingTasks)
    );
  }, [filterPendingTasks]);


  const [newName, setNewName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStatus, setNewStatus] = useState<ShopStatus>(ShopStatus.NEW);
  const [firstUpdate, setFirstUpdate] = useState('');

  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      const matchesStatus = filterStatus === 'all' || shop.status === filterStatus;
      const matchesLocation = !filterLocation ||
        (shop.location &&
          shop.location.toLowerCase().includes(filterLocation.toLowerCase()));
      const shopTasks = tasks.filter(t => t.shopId === shop.id);
      const hasPendingOrOverdue = shopTasks.some(t => {
        const effStatus = getEffectiveTaskStatus(t);
        return effStatus === TaskStatus.PENDING || effStatus === TaskStatus.OVERDUE;
      });
      const matchesTaskFilter = !filterPendingTasks || hasPendingOrOverdue;
      return matchesStatus && matchesLocation && matchesTaskFilter;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [shops, tasks, filterStatus, filterLocation, filterPendingTasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newPhone.trim();
    // if (!cleanPhone) return alert('Phone number is required');
    // if (shops.some(s => s.phoneNumber === cleanPhone)) return alert('Phone number must be unique');

    onAddShop({
      name: newName.trim(),
      ownerName: newOwner.trim() || undefined,
      phoneNumber: cleanPhone,
      location: newLocation.trim(),
      status: newStatus
    }, firstUpdate.trim());

    setNewName(''); setNewOwner(''); setNewPhone(''); setNewLocation(''); setNewStatus(ShopStatus.NEW); setFirstUpdate('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-black tracking-tight">Shops</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm ${isAdding ? 'bg-gray-100 text-black hover:bg-gray-200' : 'bg-black !text-white hover:bg-blue-700 active:scale-95'}`}
        >
          {isAdding ? 'Cancel' : (
            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg> New Shop</>
          )}
        </button>
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4">
          <h3 className="font-extrabold text-xl text-black">Add Shop Record</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-black opacity-60 uppercase tracking-widest">Shop Name *</label>
              <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="mt-1 block w-full rounded-xl border-gray-200 border p-3 shadow-sm focus:border-black focus:ring-black text-black bg-white" placeholder="e.g. Apollo Pharmacy" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-black opacity-60 uppercase tracking-widest">Owner Name</label>
                <input type="text" value={newOwner} onChange={e => setNewOwner(e.target.value)} className="mt-1 block w-full rounded-xl border-gray-200 border p-3 shadow-sm focus:border-black focus:ring-black text-black bg-white" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black opacity-60 uppercase tracking-widest">Phone Number</label>
                <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="mt-1 block w-full rounded-xl border-gray-200 border p-3 shadow-sm focus:border-black focus:ring-black text-black bg-white" placeholder="Unique ID" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-black opacity-60 uppercase tracking-widest">Location / Area</label>
                <input list="locations-list" type="text" value={newLocation} onChange={e => setNewLocation(e.target.value)} className="mt-1 block w-full rounded-xl border-gray-200 border p-3 shadow-sm focus:border-black focus:ring-black text-black bg-white" placeholder="Area Name" />
                <datalist id="locations-list">
                  {locations.map(loc => <option key={loc} value={loc} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-black opacity-60 uppercase tracking-widest">Initial Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as ShopStatus)} className="mt-1 block w-full rounded-xl border-gray-200 border p-3 shadow-sm focus:border-black focus:ring-black text-black bg-white">
                  {Object.values(ShopStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-black opacity-60 uppercase tracking-widest">Initial Visit Note</label>
              <textarea value={firstUpdate} onChange={e => setFirstUpdate(e.target.value)} className="mt-1 block w-full rounded-xl border-gray-200 border p-3 shadow-sm focus:border-black focus:ring-black text-black bg-white" rows={2} placeholder="Brief summary of first contact..."></textarea>
            </div>
          </div>
          <button type="submit" className="w-full bg-black !text-white py-4 rounded-xl font-extrabold shadow-lg hover:bg-gray-800 active:scale-95 transition-all mt-4">Create Record</button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-black focus:ring-2 focus:ring-black transition-all"
                >
                  <option value="all">All Statuses</option>
                  {Object.values(ShopStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  list="locations-filter"
                  placeholder="Search Location..."
                  value={filterLocation}
                  onChange={e => setFilterLocation(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 font-bold text-black focus:ring-2 focus:ring-black transition-all"
                />
                <datalist id="locations-filter">
                  {locations.map(loc => <option key={loc} value={loc} />)}
                </datalist>
              </div>
              <label className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterPendingTasks}
                  onChange={e => setFilterPendingTasks(e.target.checked)}
                  className="w-5 h-5 rounded-md border-gray-300 text-black focus:ring-black"
                />
                <span className="font-bold text-black">Filter: Active Tasks Only</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredShops.map(shop => {
              const latestUpdate =
                shop.updates && shop.updates.length > 0
                  ? shop.updates[shop.updates.length - 1]
                  : null;

              const pendingCount = tasks.filter(t => t.shopId === shop.id && getEffectiveTaskStatus(t) !== TaskStatus.COMPLETED).length;
              return (
                <button
                  key={shop.id}
                  onClick={() => onSelectShop(shop.id)}
                  className="text-left bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-black hover:shadow-lg transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h4 className="font-extrabold text-black text-lg group-hover:text-black transition-colors leading-tight">{shop.name}</h4>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-black bg-white text-black`}>
                        {shop.status}
                      </span>
                    </div>
                    <div className="text-sm text-black opacity-60 font-medium space-x-3 flex flex-wrap">
                      <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg> {shop.location}</span>
                      <span className="flex items-center gap-1 font-mono tracking-tight">{shop.phoneNumber}</span>
                    </div>
                    {latestUpdate && (
                      <p className="mt-3 text-xs text-black opacity-70 italic line-clamp-1 border-l-2 border-black pl-3">
                        "{latestUpdate.note}"
                      </p>
                    )}
                  </div>
                  {pendingCount > 0 && (
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-black self-start sm:self-center">
                      <div className="h-2 w-2 rounded-full bg-black animate-pulse"></div>
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">{pendingCount} Action Items</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
