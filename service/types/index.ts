export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  time: string;
  alarmTime: Date | null;
  notification: Date | null;
  dueDate: string;
};

export type SearchTodo = {
  text: string;
  searchDate: string;
};

export type TodoList = {
  [date: string]: Todo[];
};
