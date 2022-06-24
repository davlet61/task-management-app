import { inferQueryOutput } from '@utils/trpc';

export interface Params {
  [key: string]: string;
}

export interface Routes {
  [key: string]: string;
}

export type Project = inferQueryOutput<'project.all'>[number];
export type Task = inferQueryOutput<'todo.all'>[number];

export type Store = {
  todos: Task[];
  projects: Project[];
  newTodo: Task;
  newProject: Project;
  visibility: boolean;
  setTodos: (todos: Task[]) => void;
  addTodo: () => void;
  updateTodo: (todo: Task) => void;
  markComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  setNewTodo: (newTodo: Task) => void;
  setVisibility: () => void;
  setNewProject: (project: Project) => void;
  addProject: () => void;
};

export type AddTodoFn = (item: Task) => void;

export type HandleChangeFn = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;

export type HandleSubmitFn = (event: React.FormEvent) => void;

export type HandleCloseFn = (bool: boolean) => void;
export type HandleClick = () => void;

export type HandleDelAndStatusFn = (id: string) => void;
