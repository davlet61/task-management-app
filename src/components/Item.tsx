import useClickOutside from '@hooks/useClickOutside';
import { trpc } from '@utils/trpc';
import { useState, useRef, useEffect } from 'react';
import { Task } from 'types';
import { DeleteButton } from './SVGs';

const ListItem = ({ todo }: { todo: Task }) => {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);

  const utils = trpc.useContext();
  const [text, setText] = useState(todo.title || '');
  const [completed, setCompleted] = useState(todo.completed);

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

  useEffect(() => {
    setText(todo.title || '');
  }, [todo.title]);
  useEffect(() => {
    setCompleted(todo.completed);
  }, [todo.completed]);

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

  const handleContentEdit = (e: React.KeyboardEvent | React.MouseEvent): void => {
    if (e.type !== 'mousedown' || (e as React.KeyboardEvent).key !== ' ') {
      setEditing(true);
    }
  };

  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback() {
      editTodo.mutate({
        id: todo.id,
        data: { title: text },
      });
      setEditing(false);
    },
  });
  return (
    <li
      key={todo.id}
      ref={wrapperRef}
      className="flex items-center justify-between gap-1 mx-60"
    >

      <input
        id="checkbox"
        type="checkbox"
        checked={todo.completed || false}
        onChange={(e) => {
          const { checked } = e.currentTarget;
          setCompleted(checked);
          editTodo.mutate({
            id: todo.id,
            data: { completed: checked },
          });
        }}
      />
      <div
        role="button"
        tabIndex={0}
        contentEditable={editing}
        onClick={handleContentEdit}
        onKeyDown={handleContentEdit}
      >
        <p>{todo.title}</p>
        <p>{todo.description}</p>
      </div>
      <DeleteButton click={() => deleteTodo.mutate(todo.id)} />
    </li>
  );
};

export default ListItem;
