import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import type { Task } from '../types/Task';
import type { Category } from '../types/Category';

interface CalendarViewProps {
  tasks: Task[];
  categories: Category[];
  onDateClick: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onCreateTask: (date: Date) => void;
  selectedDate: Date | null;
}

export function CalendarView({ 
  tasks, 
  categories, 
  onDateClick, 
  onTaskClick,
  onCreateTask,
  selectedDate,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => isSameDay(task.date, day));
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              오늘
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] lg:text-[11px] text-gray-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 lg:gap-2">
          {days.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <div
                key={index}
                className={`group relative min-h-[80px] lg:min-h-[100px] p-1.5 lg:p-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                    : isCurrentMonth
                    ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                {/* 날짜 영역 - 왼쪽 상단 */}
                <div className="flex items-start justify-between mb-1 lg:mb-2">
                  <button
                    onClick={() => onDateClick(day)}
                    className={`text-[11px] lg:text-[13px] min-w-[20px] lg:min-w-[24px] h-[20px] lg:h-[24px] rounded-full flex items-center justify-center transition-all hover:bg-gray-100 ${
                      isCurrentDay
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : isCurrentMonth
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {format(day, 'd')}
                  </button>
                  
                  {/* 일정 추가 버튼 - 호버시 표시 */}
                  {isCurrentMonth && (
                    <button
                      onClick={() => onCreateTask(day)}
                      className="hidden lg:block opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                      title="Add task"
                    >
                      <Plus className="w-3 h-3 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* 태스크 목록 */}
                <div className="space-y-0.5 lg:space-y-1">
                  {dayTasks.slice(0, 3).map((task) => {
                    const category = categories.find(c => c.id === task.categoryId);
                    return (
                      <button
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                        className={`w-full text-left px-1 lg:px-2 py-0.5 lg:py-1 rounded text-[9px] lg:text-[11px] leading-tight transition-all hover:opacity-80 hover:shadow-sm ${
                          task.completed ? 'opacity-60 line-through' : ''
                        }`}
                        style={{
                          backgroundColor: category?.color,
                          color: 'white',
                        }}
                        title={task.title}
                      >
                        {!task.isAllDay && task.startTime && (
                          <span className="opacity-90 mr-1 hidden lg:inline">{task.startTime}</span>
                        )}
                        <span className="truncate block">{task.title}</span>
                      </button>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <button
                      onClick={() => onDateClick(day)}
                      className="w-full text-[9px] lg:text-[10px] text-gray-500 hover:text-gray-700 text-center py-0.5 hover:bg-gray-100 rounded transition-all"
                    >
                      +{dayTasks.length - 3}개 더보기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}