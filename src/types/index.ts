import { inferQueryOutput } from '@utils/trpc';

export interface Params {
  [key: string]: string;
}

export interface Routes {
  [key: string]: string;
}

export type Project = inferQueryOutput<'project.all'>[number];

export type Task = inferQueryOutput<'todo.all'>[number];

export type AddTodoFn = (item: Task) => void;

export type HandleChangeFn = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;

export type HandleSubmitFn = (event: React.FormEvent) => void;

export type HandleCloseFn = (bool: boolean) => void;

export type HandleClick = () => void;

export type HandleDelAndStatusFn = (id: string) => void;

export interface ICursor {
  x: number;
  y: number;
}

export type Presence = {
  cursor: ICursor | null;
};

export interface VisibilityProps {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
}
