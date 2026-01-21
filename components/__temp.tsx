import React, { useState } from 'react';
import { Shop, TaskType } from '../types';

interface CreateTaskModalProps {
  shops: Shop[];
  onClose: () => void;
  onCreate: (
    shopId: string,
    type: TaskType,
    dueDate: string,
    note?: string
  ) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  shops,
  onClose,
  onCreate,
}) => {
  const [shopId, setShopId] = useState('');
  const [type, setType] = useState<TaskType>(TaskType.VISIT);
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) {
      alert('Please select shop and due date');
      return;
    }

    onCreate(shopId, type, dueDate, note.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4"
      >
        <h2 className="text-xl font-extrabold text-black">
          Create Task
        </h2>

        <select
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200"
        >
          <option value="">Select Shop</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as TaskType)}
          className="w-full p-3 rounded-xl border border-gray-200"
        >
          {Object.values(TaskType).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200"
          required
        />

        <input
          type="text"
          placeholder="Task note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded-xl py-2 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-black !text-white rounded-xl py-2 font-bold"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

