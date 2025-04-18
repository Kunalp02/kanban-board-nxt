import { useEffect, useState } from 'react';
import AddTaskModal from './AddTaskModal';
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";

import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Task } from '@/types/task';
import Column from './Column';
import { FaTasks } from 'react-icons/fa';

type HeaderProps = {
  onAuthClick: () => void;
};

type ColumnType = {
  id: string;
  title: string;
  tasks: Task[];
};

const initialColumns: ColumnType[] = [
  { id: 'todo', title: 'To Do', tasks: [] },
  { id: 'inprogress', title: 'In Progress', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

export default function Board({ onAuthClick }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json() as Task[];
      console.log(data);

      if (Array.isArray(data)) {
        const grouped = initialColumns.map((col) => ({
          ...col,
          tasks: data.filter((task) => task.status === col.id),
        }));
        console.log(grouped);
        setColumns(grouped);
      } else {
        setColumns(initialColumns);
      }
    } catch (err) {
      console.error('Fetch failed', err);
      setColumns(initialColumns);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data);
        if (data) fetchTasks();
      });
  }, []);

  const findColumn = (unique: string | null) => {
    if (!unique) {
      return null;
    }
    if (columns.some((c) => c.id === unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }
    const id = String(unique);
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.id;
      return c.tasks.map((i) => ({ itemId: i.id, columnId: columnId }));
    });
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return columns.find((c) => c.id === columnId) ?? null;
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over, delta } = event;
    if (!over) return;
  
    const activeId = String(active.id);
    const overId = String(over.id);
  
    const activeColumn = findColumn(activeId);
    let overColumn = findColumn(overId);
  
    if (!activeColumn) return;
  
    if (!overColumn) {
      overColumn = columns.find(col => col.id === overId) ?? null;
    }
  
    if (!overColumn || activeColumn.id === overColumn.id) return;
  
    const activeIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
    if (activeIndex === -1) return;
  
    const taskToMove = activeColumn.tasks[activeIndex];
  
    setColumns(prevState => {
      const activeItems = activeColumn.tasks;
      const overItems = overColumn!.tasks;
  
      const overIndex = overItems.findIndex(task => task.id === overId);
      const putOnBelowLastItem = overIndex === overItems.length - 1 && delta.y > 0;
      const newIndex = overIndex >= 0 ? overIndex + (putOnBelowLastItem ? 1 : 0) : overItems.length;
  
      return prevState.map(col => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: activeItems.filter(task => task.id !== activeId),
          };
        }
        if (col.id === overColumn!.id) {
          return {
            ...col,
            tasks: [
              ...overItems.slice(0, newIndex),
              taskToMove,
              ...overItems.slice(newIndex),
            ],
          };
        }
        return col;
      });
    });
  
    try {
      await fetch(`/api/tasks/${activeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskToMove,
          status: overColumn.id,
        }),
      });
      console.log("Patch Request Made to tasks / active id ");
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };
  


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }
    const activeIndex = activeColumn.tasks.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.tasks.findIndex((i) => i.id === overId);
    if (activeIndex !== overIndex) {
      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            column.tasks = arrayMove(overColumn.tasks, activeIndex, overIndex);
            return column;
          } else {
            return column;
          }
        });
      });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center bg-white mt-10 from-blue-50 to-indigo-100 px-4 text-center space-y-6">
        <div className="flex text-indigo-600 text-6xl items-center gap-5">
          <FaTasks className="drop-shadow-md" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome to Kanban Manager
          </h1>
        </div>
       
        <p className="text-gray-600 text-md md:text-lg max-w-md">
          Organize your workflow, track progress, and manage your team like a pro.
        </p>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
          onClick={onAuthClick}
        >
          Get Started
        </button>
      </div>
    );
  }
  


  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        {user?.role === 'ADMIN' && (
          <div className="z-10 py-2 mb-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition duration-200"
            >
              + Add Task
            </button>
            <AddTaskModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onTaskAdded={fetchTasks}
            />
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col sm:flex-row gap-6 justify-between transition-all duration-300 ease-in-out overflow-auto">
            {columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                fetchTasks={fetchTasks}
              ></Column>
            ))}

          </div>
        </DndContext>
      </div>
    </div>
  );
}
