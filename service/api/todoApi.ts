import { Todo } from "../types";

const API_URI = "http://localhost:8001";

export const fetchAllTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_URI}/api/todos`);
  if (!response.ok) {
    throw new Error("Failed to fetch all todos");
  }
  return response.json();
};

export const fetchTodosByDate = async (dateKey: string): Promise<Todo[]> => {
  const response = await fetch(`${API_URI}/api/todos/date/${dateKey}`);
  if (!response.ok) {
    throw new Error("Failed to fetch todos by date");
  }
  return response.json();
};

export const fetchTodoByTitle = async (title: string): Promise<Todo[]> => {
  const response = await fetch(`${API_URI}/api/todos/search?keyword=${title}`);
  if (!response.ok) {
    throw new Error("Failed to fetch todos by title");
  }
  return response.json();
};

export const addTodo = async (newTodo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_URI}/api/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTodo.title,
      description: `${newTodo.title.trim()} ${newTodo.time}`,
      completed: false,
      dueDate: newTodo.dueDate,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add todo");
  }

  return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URI}/api/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
};

export const updateTodoCompletion = async (
  id: string,
  completed: boolean
): Promise<void> => {
  const response = await fetch(`${API_URI}/api/todos/${id}/completed`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error("Failed to update todo completion status");
  }
};
