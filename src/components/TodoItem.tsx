import useClickOutside from '@hooks/useClickOutside';
import { trpc } from '@utils/trpc';
import React, {
  useState, useRef, useEffect, useMemo,
} from 'react';
import { HandleChangeFn, Task } from 'types';
import { DeleteButton, EditButton } from './SVGs';

const TodoItem = ({ todo }: { todo: Task }) => {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const utils = trpc.useContext();
  const initialState = useMemo(() => ({
    title: todo.title,
    description: todo.description || '',
    completed: todo.completed,
  }), [todo]);
  const [newTodo, setNewTodo] = useState(initialState);

  const inputClasses = 'focus:outline-none focus:italic focus:text-sky-700 bg-transparent';
  const listClasses = newTodo.completed ? 'bg-gray-400 opacity-60 border-2 border-solid border-gray-500 italic' : 'bg-neutral-100';

  useEffect(() => {
    setNewTodo(initialState);
  }, [initialState]);

  const editTodo = trpc.useMutation('todo.edit', {
    async onMutate({ id, data }) {
      await utils.cancelQuery(['todo.all']);
      const allTodos = utils.getQueryData(['todo.all']);
      if (!allTodos) {
        return;
      }
      utils.setQueryData(
        ['todo.all'],
        allTodos.map((t) => (t.id === id
          ? {
            ...t,
            ...data,
          }
          : t)),
      );
    },
  });
  const deleteTodo = trpc.useMutation('todo.delete', {
    async onMutate() {
      await utils.cancelQuery(['todo.all']);
      const allTodos = utils.getQueryData(['todo.all']);
      if (!allTodos) {
        return;
      }
      utils.setQueryData(
        ['todo.all'],
        allTodos.filter((t) => t.id !== todo.id),
      );
    },
  });

  const handleChange: HandleChangeFn = (e) => {
    setEditing(true);
    const { value, name } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const element = e.target as HTMLInputElement;
      element.blur();
      editTodo.mutate({
        id: todo.id,
        data: { title: newTodo.title, description: newTodo.description },
      });
      setEditing(false);
    }
  };

  const handleEdit = () => {
    setEditing((prev) => !prev);
    editing ? inputRef.current?.blur() : inputRef.current?.focus();
  };

  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback() {
      editTodo.mutate({
        id: todo.id,
        data: { title: newTodo.title, description: newTodo.description },
      });
      setEditing(false);
    },
  });
  return (
    <li
      key={todo.id}
      ref={wrapperRef}
      className={`flex items-center justify-between gap-1 max-w-sm mx-auto p-4 border rounded-md shadow transition-all duration-300 ease-in-out ${listClasses} `}
    >

      <label htmlFor={`${todo.id}-checkbox`} className="relative mb-5 cursor-pointer text-lg">
        <input
          id={`${todo.id}-checkbox`}
          type="checkbox"
          className="checkbox-hide peer"
          checked={todo.completed}
          onChange={(e) => {
            const { checked } = e.currentTarget;
            setNewTodo({ ...newTodo, completed: checked });
            editTodo.mutate({
              id: todo.id,
              data: { completed: checked },
            });
          }}
        />
        <span className="absolute top-0 left-0 h-6 w-6 bg-white border border-solid border-neutral-300 shadow-inner rounded-2xl hover:bg-neutral-200 peer-checked:bg-green-700  peer-checked:after:block " />
      </label>

      <form className="flex flex-col flex-wrap ml-8">
        <input
          ref={inputRef}
          type="text"
          name="title"
          className={`${inputClasses} capitalize`}
          value={newTodo.title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          name="description"
          className={`${inputClasses} text-sm`}
          value={newTodo.description}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </form>
      <EditButton click={handleEdit} editing={editing} />
      <DeleteButton click={() => deleteTodo.mutate(todo.id)} />
    </li>
  );
};

export default TodoItem;
