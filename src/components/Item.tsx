import useClickOutside from '@hooks/useClickOutside';
import { trpc } from '@utils/trpc';
import { useState, useRef, useEffect } from 'react';
import { Task } from 'types';

const ListItem = ({ task }: { task: Task }) => {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useContext();
  const [text, setText] = useState(task.title || '');
  const [completed, setCompleted] = useState(task.completed);
  useEffect(() => {
    setText(task.title || '');
  }, [task.title]);
  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  const editTask = trpc.useMutation('todo.edit', {
    async onMutate({ id, data }) {
      await utils.cancelQuery(['todo.all']);
      const allTasks = utils.getQueryData(['todo.all']);
      if (!allTasks) {
        return;
      }
      utils.setQueryData(
        ['todo.all'],
        allTasks.map((t) => (t.id === id
          ? {
            ...t,
            ...data,
          }
          : t)),
      );
    },
  });
  const deleteTask = trpc.useMutation('todo.delete', {
    async onMutate() {
      await utils.cancelQuery(['todo.all']);
      const allTasks = utils.getQueryData(['todo.all']);
      if (!allTasks) {
        return;
      }
      utils.setQueryData(
        ['todo.all'],
        allTasks.filter((t) => t.id !== task.id),
      );
    },
  });

  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback() {
      editTask.mutate({
        id: task.id,
        data: { title: text },
      });
      setEditing(false);
    },
  });
  return (
    <li
      key={task.id}
      ref={wrapperRef}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            const { checked } = e.currentTarget;
            setCompleted(checked);
            editTask.mutate({
              id: task.id,
              data: { completed: checked },
            });
          }}
          autoFocus={editing}
        />
        <label
          onDoubleClick={(e) => {
            setEditing(true);
            e.currentTarget.focus();
          }}
        >
          {text}
        </label>
        <button
          className="destroy"
          onClick={() => {
            deleteTask.mutate(task.id);
          }}
        />
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
            editTask.mutate({
              id: task.id,
              data: { title: text },
            });
            setEditing(false);
          }
        }}
      />
    </li>
  );
};

export default ListItem;
