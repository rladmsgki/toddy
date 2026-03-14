import { useState } from 'react'
import { TaskList } from '../components/TaskList'
import type { Category } from '../types/Category'
import type { Task, ViewType } from '../types/Task'
import { format } from 'date-fns'
import { CalendarView } from '../components/CalendarView'

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('today')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCalendar, setShowCalendar] = useState(true)

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: '업무', color: '#3B82F6' },
    { id: '2', name: '개인', color: '#8B5CF6' },
    { id: '3', name: '건강', color: '#10B981' },
  ])

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '프로젝트 제안서 검토',
      completed: false,
      categoryId: '1',
      priority: 'high',
      date: new Date(),
      startTime: '09:00',
      endTime: '11:00',
      isAllDay: false,
      notes: '',
    },
    {
      id: '2',
      title: '팀 미팅 준비',
      completed: false,
      categoryId: '1',
      priority: 'medium',
      date: new Date(),
      startTime: '14:00',
      endTime: '15:00',
      isAllDay: false,
      notes: '',
    },
    {
      id: '3',
      title: '아침 운동',
      completed: true,
      categoryId: '3',
      priority: 'low',
      date: new Date(),
      isAllDay: true,
      notes: '',
    },
  ])

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setSelectedDate(null)
    setTaskModalOpen(true)
  }

  const filteredTasks =
    selectedCategoryId
      ? tasks.filter(task => task.categoryId === selectedCategoryId)
      : selectedCalendarDate
      ? tasks.filter(
          task =>
            task.date.toDateString() ===
            selectedCalendarDate.toDateString()
        )
      : tasks

  const getTaskTitle = () => {
    if (currentView === 'today') return '오늘의 할 일'
    if (selectedCalendarDate) {
      const isToday =
        selectedCalendarDate.toDateString() ===
        new Date().toDateString()
      if (isToday) return '오늘의 할 일'
      return `${format(selectedCalendarDate, 'M월 d일')} 할 일`
    }
    return '모든 할 일'
  }

  const handleDateClick = (date: Date) => {
    setSelectedCalendarDate(date);
    setCurrentView('all');
  };

  const handleCreateTask = (date: Date) => {
    setSelectedDate(date);
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-[18px] text-gray-900">Toddy</h1>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <TaskList
              tasks={
                currentView === 'today'
                  ? filteredTasks.filter(t => {
                    const today = new Date()
                    return (
                      t.date.toDateString() === today.toDateString()
                    )
                  })
                  : filteredTasks
              }
              categories={categories}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onTaskClick={handleTaskClick}
              onAddTask={() => {
                setSelectedTask(null)
                setSelectedDate(null)
                setTaskModalOpen(true)
              }}
              title={getTaskTitle()}
              selectedDate={selectedCalendarDate}
              onClearDateFilter={() => setSelectedCalendarDate(null)}
            />
          </div>
          <div className={`
          w-full lg:w-[480px] border-t lg:border-t-0 lg:border-l border-gray-200 p-4 lg:p-8 overflow-y-auto bg-white
          ${showCalendar ? 'block' : 'hidden lg:block'}
        `}>
            <CalendarView
              tasks={tasks}
              categories={categories}
              onDateClick={handleDateClick}
              onTaskClick={handleTaskClick}
              onCreateTask={handleCreateTask}
              selectedDate={selectedCalendarDate}
            />
          </div>
      </main>
    </div>
  );
}