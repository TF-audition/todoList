"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, ChevronLeft, ChevronRight, Bell, BellOff } from "lucide-react"
import { format } from "date-fns"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Todo = {
  id: number
  text: string
  completed: boolean
  time: string
  notification: Date | null
}

type TodoList = {
  [date: string]: Todo[]
}

export function CalendarTodoListComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [todos, setTodos] = useState<TodoList>({})
  const [newTodo, setNewTodo] = useState("")
  const [newTodoTime, setNewTodoTime] = useState("12:00")

  useEffect(() => {
    const checkNotifications = setInterval(() => {
      const now = new Date()
      Object.values(todos).flat().forEach(todo => {
        if (todo.notification && new Date(todo.notification) <= now) {
          toast.info(`알림: ${todo.text}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
          // 알림을 표시한 후 해당 todo의 알림을 제거합니다
          removeTodoNotification(todo.id)
        }
      })
    }, 60000) // 1분마다 체크

    return () => clearInterval(checkNotifications)
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() && selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0]
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        time: newTodoTime,
        notification: null
      }
      setTodos(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newTodoItem]
      }))
      setNewTodo("")
    }
  }

  const toggleTodo = (date: string, id: number) => {
    setTodos(prev => ({
      ...prev,
      [date]: prev[date].map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }))
  }

  const deleteTodo = (date: string, id: number) => {
    setTodos(prev => ({
      ...prev,
      [date]: prev[date].filter(todo => todo.id !== id)
    }))
  }

  const setTodoNotification = (date: string, id: number, notificationTime: string) => {
    const [hours, minutes] = notificationTime.split(':')
    const notificationDate = new Date(date)
    notificationDate.setHours(parseInt(hours), parseInt(minutes))

    setTodos(prev => ({
      ...prev,
      [date]: prev[date].map(todo =>
        todo.id === id ? { ...todo, notification: notificationDate } : todo
      )
    }))
  }

  const removeTodoNotification = (id: number) => {
    setTodos(prev => {
      const newTodos = { ...prev }
      Object.keys(newTodos).forEach(date => {
        newTodos[date] = newTodos[date].map(todo =>
          todo.id === id ? { ...todo, notification: null } : todo
        )
      })
      return newTodos
    })
  }

  const getTodoCountForDate = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    return todos[dateKey]?.length || 0
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <ToastContainer />
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">달력</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            classNames={{
              months: "space-y-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative w-full h-full flex items-center justify-center">
                  {date.getDate()}
                  {getTodoCountForDate(date) > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
              ),
              NavigationButton: ({ direction, ...props }) => (
                <Button variant="outline" size="icon" {...props}>
                  {direction === "previous" ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ),
            }}
          />
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            할 일 목록 - {selectedDate?.toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input
              type="text"
              placeholder="새로운 할 일"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="mr-2"
            />
            <Input
              type="time"
              value={newTodoTime}
              onChange={(e) => setNewTodoTime(e.target.value)}
              className="mr-2 w-32"
            />
            <Button onClick={addTodo}>추가</Button>
          </div>
          <ScrollArea className="h-[300px] pr-4">
            {selectedDate && (
              <ul className="space-y-2">
                {todos[selectedDate.toISOString().split('T')[0]]?.map(todo => (
                  <li key={todo.id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                    <div className="flex items-center">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(selectedDate.toISOString().split('T')[0], todo.id)}
                        className="mr-2"
                      />
                      <span className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                        {todo.time} - {todo.text}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {todo.notification ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTodoNotification(todo.id)}
                          title="알림 제거"
                        >
                          <Bell className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTodoNotification(selectedDate.toISOString().split('T')[0], todo.id, todo.time)}
                          title="알림 설정"
                        >
                          <BellOff className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(selectedDate.toISOString().split('T')[0], todo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}