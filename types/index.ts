export interface Task {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

export type Store = {
  todos: Task[];
  newTodo: Task;
  visibility: boolean;
  setTodos: (todos: Task[]) => void;
  addTodo: () => void;
  updateTodo: (todo: Task) => void;
  markComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  setNewTodo: (newTodo: Task) => void;
  setVisibility: () => void;
};

export type AddTodoFn = (item: Task) => void;

export type HandleChangeFn = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;

export type HandleSubmitFn = (event: React.FormEvent) => void;

export type HandleCloseFn = (bool: boolean) => void;

export type HandleDelAndStatusFn = (id: string) => void;
