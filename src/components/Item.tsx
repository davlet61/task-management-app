import useClickOutside from '@hooks/useClickOutside';
import { trpc } from '@utils/trpc';
import { useState, useRef, useEffect } from 'react';
import { Task } from 'types';
import { DeleteButton } from './SVGs';

const ListItem = ({ todo }: { todo: Task }) => {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useContext();
  const [text, setText] = useState(todo.title || '');
  const [completed, setCompleted] = useState(todo.completed);

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
    >
      <div className="view">
        <label
          htmlFor="checkbox"
          onDoubleClick={(e) => {
            setEditing(true);
            e.currentTarget.focus();
          }}
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
            autoFocus={editing}
          />
          {text}
        </label>
      </div>
      <input
        className="edit"
        value={text}
        ref={inputRef}
        onChange={(e) => {
          const newText = e.currentTarget.value;
          setText(newText);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            editTodo.mutate({
              id: todo.id,
              data: { title: text },
            });
            setEditing(false);
          }
        }}
      />
      <DeleteButton click={() => deleteTodo.mutate(todo.id)} />
    </li>
  );
};

export default ListItem;
