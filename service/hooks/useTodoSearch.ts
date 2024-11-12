import { useState } from "react";
import { fetchTodoByTitle } from "../api/todoApi";
import { Todo } from "../types";
import { toast } from "react-toastify";

export function useTodoSearch() {
  const [searchResults, setSearchResults] = useState<Todo[]>([]);

  const searchTodos = async (title: string) => {
    try {
      const results = await fetchTodoByTitle(title);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching todos:", error);
      toast.error("검색어를 찾는 데 실패했습니다.");
    }
  };

  return { searchResults, searchTodos };
}



//  