import { Trash2, Clock } from 'lucide-react';
import type { Task } from '../types/Task';
import type { Category } from '../types/Category';

interface TaskItemProps {
  task: Task;
  category?: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
}

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

const priorityLabels = {
  low: '낮음',
  medium: '보통',
  high: '높음',
};

export function TaskItem({ task, category, onToggle, onDelete, onClick }: TaskItemProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all">
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className="flex-shrink-0 mt-0.5"
        >
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              task.completed
                ? 'bg-gray-900 border-gray-900'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>

        <button
          onClick={() => onClick(task)}
          className="flex-1 min-w-0 text-left"
        >
          <p className={`text-[15px] mb-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.title}
          </p>
          
          {(task.startTime || task.isAllDay) && (
            <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <Clock className="w-3 h-3" />
              {task.isAllDay ? (
                <span>하루종일</span>
              ) : (
                <span>
                  {task.startTime}
                  {task.endTime && ` - ${task.endTime}`}
                </span>
              )}
            </div>
          )}
        </button>

        <div className="flex items-center gap-2 flex-shrink-0">
          {category && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px]"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </div>
          )}

          <span className={`text-[12px] px-2 py-1 ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}