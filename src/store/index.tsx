import create from 'zustand';
import { v4 as uuid } from 'uuid';
import { Project, Store, Task } from '../types';

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
    id: uuid(),
    completed: false,
  },
];

const addProject = (projects: Project[], project: Project): Project[] => [
  ...projects,
  {
    ...project,
  },
];

const initialState: Task = {
  id: '',
  title: '',
  description: '',
  completed: false,
};

const initialProject: Project = {
  id: '',
  user_id: '',
  name: '',
  todos: [],
};

const useStore = create<Store>(
  (set): Store => ({
    todos: [],
    projects: [],
    newTodo: initialState,
    newProject: initialProject,
    visibility: true,
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
    setVisibility: () => set((state) => ({
      ...state,
      visibility: !state.visibility,
    })),
    setNewProject: (newProject: Project) => set((state) => ({
      ...state,
      newProject,
    })),
    addProject: () => set((state) => ({
      ...state,
      projects: addProject(state.projects, state.newProject),
      newProject: initialProject,
    })),
  }),
);

export default useStore;
