import create from 'zustand';
import { nanoid } from 'nanoid';
import { Task } from '../types';

const updateTodo = (todos: Task[], todo: Task): Task[] => todos
  .map((t) => (t.id === todo.id ? todo : t));

const markComplete = (todos: Task[], id: string): Task[] => todos.map((todo) => ({
  ...todo,
  completed: todo.id === id ? !todo.completed : todo.completed,
}));

const deleteTodo = (todos: Task[], id: string): Task[] => todos.filter((todo) => todo.id !== id);

const addTodo = (todos: Task[], todo: Task): Task[] => [
  ...todos,
  {
    ...todo,
    id: nanoid(),
    completed: false,
  },
];

const initialState: Task = {
  id: '',
  title: '',
  description: '',
  completed: false,
};

type Store = {
  todos: Task[];
  newTodo: Task;
  setTodos: (todos: Task[]) => void;
  addTodo: () => void;
  updateTodo: (todo: Task) => void;
  markComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  setNewTodo: (newTodo: Task) => void;
};

const useStore = create<Store>(
  (set): Store => ({
    todos: [],
    newTodo: initialState,
    setTodos: (todos: Task[]) => set((state) => ({
      ...state,
      todos,
    })),
    deleteTodo: (id: string) => set((state) => ({
      ...state,
      todos: deleteTodo(state.todos, id),
    })),
    updateTodo: (todo: Task) => set((state) => ({
      ...state,
      todos: updateTodo(state.todos, todo),
    })),
    markComplete: (id: string) => set((state) => ({
      ...state,
      todos: markComplete(state.todos, id),
    })),
    setNewTodo: (newTodo: Task) => set((state) => ({
      ...state,
      newTodo,
    })),
    addTodo: () => set((state) => ({
      ...state,
      todos: addTodo(state.todos, state.newTodo),
      newTodo: initialState,
    })),
  }),
);

export default useStore;