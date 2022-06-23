import create from 'zustand';
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
  project_id: '1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07',
  description: '',
  completed: false,
};

const initialProject: Project = {
  id: '',
  user_id: '311eb43d-d131-4d97-8588-87db10048ca3',
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
