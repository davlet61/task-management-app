import useClickOutside from '@hooks/useClickOutside';
import { trpc } from '@utils/trpc';
import React, {
  useState, useRef, useEffect, useMemo,
} from 'react';
import { HandleChangeFn, Task } from 'types';
import { DeleteButton, EditButton } from './SVGs';

const ListItem = ({ todo }: { todo: Task }) => {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const utils = trpc.useContext();
  const initialState = useMemo(() => ({
    title: todo.title || '',
    description: todo.description || '',
    completed: todo.completed || false,
  }), [todo]);
  const [newTodo, setNewTodo] = useState(initialState);

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
    setEditing(true);
    inputRef.current?.focus();
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
      className="flex items-center justify-between gap-1 max-w-xs mx-auto"
    >
      <input
        id="checkbox"
        type="checkbox"
        checked={todo.completed || false}
        onChange={(e) => {
          const { checked } = e.currentTarget;
          setNewTodo({ ...newTodo, completed: checked });
          editTodo.mutate({
            id: todo.id,
            data: { completed: checked },
          });
        }}
      />
      <form className="flex flex-col flex-wrap">
        <input
          ref={inputRef}
          type="text"
          name="title"
          value={newTodo.title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          name="description"
          value={newTodo.description}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </form>
      <DeleteButton click={() => deleteTodo.mutate(todo.id)} />
      <EditButton click={handleEdit} editing={editing} />
    </li>
  );
};

export default ListItem;
