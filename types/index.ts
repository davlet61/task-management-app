export interface Task {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

export type AddTodoFn = (item: Task) => void;

export type HandleChangeFn = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;

export type HandleSubmitFn = (event: React.FormEvent) => void;

export type HandleCloseFn = (bool: boolean) => void;

export type HandleDelAndStatusFn = (id: string) => void;
