"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Trash2, ChevronLeft, ChevronRight, Bell, BellOff } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useTodos } from "@/service/hooks/useTodos";
import { useTodoNotifications } from "@/service/hooks/useTodoNotifications";
import { getDate } from "@/lib/utils";
import "react-toastify/dist/ReactToastify.css";
import { useCalendar } from "@/service/hooks/useCalendar";
import { fetchTodoByTitle } from "@/service/api/todoApi";

export function CalendarTodoListComponent() {
  const { todos, addTodo, deleteTodo, toggleTodo } = useTodos();
  const { removeTodoNotification, setTodoNotification } =
    useTodoNotifications(todos);
  const { getTodoCountForDate } = useCalendar();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [newTodo, setNewTodo] = useState("");
  const [newTodoTime, setNewTodoTime] = useState("12:00");
  const [searchText, setSearchText] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim() && selectedDate) {
      const dateKey = getDate(selectedDate);
      const newTodoItem = {
        id: Date.now().toString(),
        title: newTodo.trim(),
        description: `${newTodo.trim()} ${newTodoTime}`,
        completed: false,
        time: newTodoTime,
        notification: null,
        alarmTime: null,
        dueDate: dateKey,
      };
      addTodo(newTodoItem, dateKey);
      setNewTodo("");
    }
  };

  const handleSearch = async () => {
    try {
      if (searchText) {
        const Todo = await fetchTodoByTitle(searchText);
        const selectedTime = Todo ? new Date(Todo[0].dueDate) : new Date();

        setSelectedDate(selectedTime); // 검색된 날짜로 선택된 날짜 업데이트
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("검색어를 찾는 데 실패했습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center p-4">
        <div className="flex justify-center items-center mb-4">
          <Input
            type="text"
            placeholder="할 일 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mr-2 p-5"
          />
          <Button onClick={handleSearch} className="p-5">
            검색
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <ToastContainer />
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                달력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-full flex justify-center items-center">
                <Calendar
                  mode="single"
                  selected={selectedDate || new Date()}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  className="rounded-md border w-80 h-80"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex justify-center",
                    head_cell:
                      "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2 justify-center",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                  components={{
                    DayContent: ({ date }) => (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {date.getDate()}
                        {getTodoCountForDate(date, todos) > 0 && (
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
              </div>
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
                <Button onClick={handleAddTodo}>추가</Button>
              </div>
              <ScrollArea className="h-[300px] pr-4">
                {selectedDate && (
                  <ul className="space-y-2">
                    {todos[getDate(selectedDate)]?.map((todo) => (
                      <li
                        key={todo.id}
                        className="flex items-center justify-between bg-secondary p-2 rounded-md"
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() =>
                              toggleTodo(getDate(selectedDate), todo.id)
                            }
                            className="mr-2"
                          />
                          <span
                            className={`${
                              todo.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {todo.title}
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
                              onClick={() =>
                                setTodoNotification(
                                  getDate(selectedDate),
                                  todo.id,
                                  todo.time
                                )
                              }
                              title="알림 설정"
                            >
                              <BellOff className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              deleteTodo(getDate(selectedDate), todo.id)
                            }
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
      </div>
    </div>
  );
}
