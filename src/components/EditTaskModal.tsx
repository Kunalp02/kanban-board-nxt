'use client';

  import { useState, useEffect } from 'react';
  import { Dialog } from '@headlessui/react';
  import { FaTimes } from 'react-icons/fa';
  import { Task } from '@/types/task';

  type EditTaskModalProps = {
    task?: Task;
    isOpen: boolean;
    onClose: () => void;
    onTaskUpdated?: () => void;
  };

  export default function EditTaskModal({
    task,
    isOpen,
    onClose,
    onTaskUpdated,
  }: EditTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status || 'todo');
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      }
    }, [task]);

    const handleUpdate = async () => {
      if (!task) return;
      try {
        const res = await fetch(`/api/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, status, dueDate }),
        });

        if (!res.ok) throw new Error('Failed to update task');

        onTaskUpdated?.();
        onClose();
      } catch (err) {
        console.error(err);
        alert('Something went wrong while updating the task.');
      }
    };

    return (
      <Dialog open={isOpen} onClose={onClose} className="z-[100]">
        <div className="fixed inset-0 bg-black/40 z-50" aria-hidden="true" />
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-[110]">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Edit Task
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

