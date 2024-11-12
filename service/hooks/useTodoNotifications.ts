import { useState } from "react";
import { TodoList } from "../types";

export function useTodoNotifications(initialTodos: TodoList) {
  const [todos, setTodos] = useState<TodoList>(initialTodos);

  const setTodoNotification = (
    date: string,
    id: string,
    notificationTime: string
  ) => {
    const [hours, minutes] = notificationTime.split(":");
    const notificationDate = new Date(date);
    notificationDate.setHours(parseInt(hours), parseInt(minutes));

    setTodos((prev) => ({
      ...prev,
      [date]: prev[date].map((todo) =>
        todo.id === id ? { ...todo, notification: notificationDate } : todo
      ),
    }));
  };

  const removeTodoNotification = (id: string) => {
    setTodos((prev) => {
      const newTodos = { ...prev };
      Object.keys(newTodos).forEach((date) => {
        newTodos[date] = newTodos[date].map((todo) =>
          todo.id === id ? { ...todo, notification: null } : todo
        );
      });
      return newTodos;
    });
  };

  return { todos, setTodoNotification, removeTodoNotification };
}
