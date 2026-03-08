import { Plus, X } from 'lucide-react';
import type { Task } from '../types/Task';
import type { Category } from '../types/Category';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
  title: string;
  selectedDate?: Date | null;
  onClearDateFilter?: () => void;
}

export function TaskList({
  tasks,
  categories,
  onToggleTask,
  onDeleteTask,
  onTaskClick,
  onAddTask,
  title,
  selectedDate,
  onClearDateFilter,
}: TaskListProps) {
  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-[22px] lg:text-[28px] font-bold text-gray-900">{title}</h2>
          {selectedDate && onClearDateFilter && (
            <button
              onClick={onClearDateFilter}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-3.5 h-3.5" />
              지우기
            </button>
          )}
        </div>
        <p className="text-[13px] lg:text-[14px] text-gray-500">
          {incompleteTasks.length}개 진행중
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {incompleteTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            category={categories.find(c => c.id === task.categoryId)}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onClick={onTaskClick}
          />
        ))}
      </div>

      <button
        onClick={onAddTask}
        className="flex items-center gap-2 px-4 py-2.5 text-[14px] text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all w-full"
      >
        <Plus className="w-4 h-4" />
        할일 추가
      </button>

      {completedTasks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-[13px] text-gray-500 font-semibold uppercase tracking-wider mb-3">
            완료됨 ({completedTasks.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                category={categories.find(c => c.id === task.categoryId)}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                onClick={onTaskClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}