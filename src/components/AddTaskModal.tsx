'use client';

import { useEffect, useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void; 
};

type User = {
  id: string;
  name: string;
};

export default function AddTaskModal({ isOpen, onClose, onTaskAdded }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: '',
    assigneeId: '',
  });

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
        setForm({
          title: '',
          description: '',
          status: 'todo',
          dueDate: '',
          assigneeId: '',
        });
        onTaskAdded(); 
        onClose();;
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to add task');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl font-bold">
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="assigneeId"
            value={form.assigneeId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Assign to...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
