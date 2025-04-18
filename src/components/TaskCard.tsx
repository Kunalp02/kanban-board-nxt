import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Task } from '@/types/task';

type TaskCardProps = {
  id: string;
  title: string;
  task: Task;
  onEdit: () => void;
};

export default function TaskCard({ id, title, task, onEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id
  });

  const style = {
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="rounded-2xl p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start">
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </div>
        <FaEdit onClick={onEdit} className="text-gray-500 hover:text-blue-500 cursor-pointer" />
      </div>
      <div className="flex items-center mt-4 text-sm text-gray-700">
        <FaUserCircle className="mr-2 text-lg text-gray-500" />
        <span>{task.assigneeName || "Unassigned"}</span>
      </div>
    </div>
  );
}
