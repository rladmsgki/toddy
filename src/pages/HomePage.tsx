import { useState } from 'react'
import { TaskList } from '../components/TaskList'
import type { Category } from '../types/Category'
import type { Task, ViewType } from '../types/Task'
import { format } from 'date-fns'

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

  return (
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
  )
}