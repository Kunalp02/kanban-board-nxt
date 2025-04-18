'use client';

import TaskCard from './TaskCard';
import EditTaskModal from './EditTaskModal';
import { useDroppable } from '@dnd-kit/core';
import { Task } from '@/types/task';
import { useState } from 'react';
import {
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';

type ColumnProps = {
  id: string;
  title: string;
  tasks: Task[];
  fetchTasks: () => void;
};

const columnStyles: Record<
  'todo' | 'inprogress' | 'done',
  { bg: string; dot: string; label: string }
> = {
  todo: {
    bg: 'bg-red-50',
    dot: 'bg-red-500',
    label: 'To Do',
  },
  inprogress: {
    bg: 'bg-yellow-50',
    dot: 'bg-yellow-500',
    label: 'In Progress',
  },
  done: {
    bg: 'bg-green-50',
    dot: 'bg-green-500',
    label: 'Done',
  },
};

export default function Column({ id, title, tasks, fetchTasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditModalOpen(true);
  };


  const titleKeyMap: Record<string, keyof typeof columnStyles> = {
    'to do': 'todo',
    'in progress': 'inprogress',
    'done': 'done',
  };
  
  const normalizedTitle = titleKeyMap[title.toLowerCase()] ?? 'todo';
  const styles = columnStyles[normalizedTitle];
  
  return (
    <div className="w-full sm:w-1/3 px-2 flex flex-col space-y-4">
      <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg mb-2">
        <span className={`w-3 h-3 rounded-full ${styles.dot}`} />
        <h2 className="tracking-wide">{styles.label}</h2>
        <span className="ml-1 text-sm text-gray-600">({tasks.length})</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 p-4 rounded-xl shadow-sm border border-gray-200 ${styles.bg}`}
        style={{ minHeight: '300px' }}
      >
        <SortableContext
          id={id}
          items={tasks.map(task => task.id)}
          strategy={rectSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              task={task}
              onEdit={() => handleEditClick(task)}
            />
          ))}
        </SortableContext>
      </div>
      <EditTaskModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={editingTask || undefined}
        onTaskUpdated={fetchTasks}
      />
    </div>

    
  );
}
