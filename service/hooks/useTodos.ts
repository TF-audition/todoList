import { useEffect, useState } from "react";
import { Todo, TodoList } from "../types";
import { toast } from "react-toastify";
import { getDate } from "@/lib/utils";
import {
  fetchAllTodos as fetchAllTodosApi,
  addTodo as addTodoApi,
  deleteTodo as deleteTodoApi,
  updateTodoCompletion as updateTodoCompletionApi,
} from "../api/todoApi";

export function useTodos() {
  const [todos, setTodos] = useState<TodoList>({});

  const fetchAllTodos = async () => {
    try {
      const allTodos = await fetchAllTodosApi();
      const todosByDate: TodoList = {};

      allTodos.forEach((todo) => {
        const dateKey = getDate(new Date(todo.dueDate));
        if (!todosByDate[dateKey]) {
          todosByDate[dateKey] = [];
        }
        todosByDate[dateKey].push(todo);
      });

      setTodos(todosByDate);
    } catch (error) {
      console.error("Error fetching all todos:", error);
      toast.error("전체 할 일 목록을 가져오는데 실패했습니다.");
    }
  };

  const addTodo = async (newTodo: Todo, dateKey: string) => {
    try {
      const insertedTodo = await addTodoApi(newTodo);

      setTodos((prev) => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), insertedTodo],
      }));
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("할 일 추가에 실패했습니다.");
    }
  };

  const deleteTodo = async (date: string, id: string) => {
    setTodos((prev) => ({
      ...prev,
      [date]: prev[date].filter((todo) => todo.id !== id),
    }));

    try {
      await deleteTodoApi(id);
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("할 일 삭제에 실패했습니다.");
      fetchAllTodos();
    }
  };

  const toggleTodo = (date: string, id: string) => {
    setTodos((prev) => ({
      ...prev,
      [date]: prev[date].map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));

    updateTodoCompletionApi(
      id,
      !todos[date].find((todo) => todo.id === id)?.completed
    ).catch((error) => {
      console.error("Error updating todo completion status:", error);
      toast.error("할 일 완료 상태 업데이트에 실패했습니다.");
    });
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  return { todos, setTodos, fetchAllTodos, addTodo, deleteTodo, toggleTodo };
}
