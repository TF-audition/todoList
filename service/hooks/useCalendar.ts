import { getDate } from "@/lib/utils";
import { TodoList } from "../types";

export function useCalendar() {
  const getTodoCountForDate = (date: Date, todos: TodoList) => {
    const dateKey = getDate(date);
    return todos[dateKey]?.length || 0;
  };

  return { getTodoCountForDate };
}
