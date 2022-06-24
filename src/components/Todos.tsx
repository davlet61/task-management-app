import { trpc } from '@utils/trpc';
import NextLink from 'next/link';
import { useEffect } from 'react';
import { useIsMutating } from 'react-query';
import { v4 as uuid } from 'uuid';
import useStore from '@store/.';
import { HandleChangeFn, HandleSubmitFn } from 'types';
import TodoItem from './TodoItem';

const Todos = ({ id }: { id: string }) => {
  const store = useStore((state) => state);
  const allTodos = trpc.useQuery(['todo.all'], {
    staleTime: 3000,
  });

  const filteredTodos = allTodos?.data?.filter((t) => t.project_id === id);
  const utils = trpc.useContext();
  const addTask = trpc.useMutation('todo.add', {
    async onMutate({ title, project_id }) {
      await utils.cancelQuery(['todo.all']);
      const tasks = filteredTodos ?? [];
      utils.setQueryData(
        ['todo.all'],
        [
          ...tasks,
          {
            id: `${uuid()}`,
            project_id,
            completed: false,
            title,
            description: '',
            created_at: new Date(),
          },
        ],
      );
    },
  });

  const clearCompleted = trpc.useMutation('todo.clear-completed', {
    async onMutate() {
      await utils.cancelQuery(['todo.all']);
      const tasks = allTodos.data ?? [];
      utils.setQueryData(
        ['todo.all'],
        tasks.filter((t) => !t.completed),
      );
    },
  });

  const handleChange: HandleChangeFn = (e) => {
    const { value, name } = e.target;
    store.setNewTodo({ ...store.newTodo, [name]: value });
  };

  const handleSubmit: HandleSubmitFn = (e) => {
    e.preventDefault();
    addTask.mutate({
      project_id: id,
      title: store.newTodo.title ?? '',
      description: store.newTodo.description ?? '',
    });
    store.addTodo();
  };

  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.invalidateQueries('todo.all');
    }
  }, [number, utils]);
  return (
    <section className="ml-80">
      <header className="header">
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-wrap">
            <legend className="mx-auto">Add a new task</legend>
            <label htmlFor="txtTodoItemToAdd">
              Title
              <input
                id="txtTodoItemToAdd"
                type="text"
                name="title"
                placeholder="Task title ..."
                value={store.newTodo.title || ''}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="add-description">
              Description
              <input
                id="add-description"
                name="description"
                placeholder="Short description of the task"
                value={store.newTodo.description || ''}
                onChange={handleChange}
              />
            </label>
            <button id="btnAddTodo" className="btn-black" type="submit">
              Add
            </button>
          </fieldset>
        </form>
      </header>
      {/* This section should be hidden by default and shown when there are todos */}
      <section className="main">
        <label htmlFor="toggle-all">
          Mark all as complete
          <input id="toggle-all" className="toggle-all" type="checkbox" />
        </label>
        <ul className="flex flex-col items-center justify-center gap-3">
          {filteredTodos?.map((task) => (
            <TodoItem key={task.id} todo={task} />
          ))}
        </ul>
      </section>
      {/* This footer should be hidden by default and shown when there are todos */}
      <footer className="footer">
        {/* This should be `0 items left` by default */}
        <span className="todo-count">
          <strong>
            {filteredTodos?.reduce(
              (sum, task) => (!task.completed ? sum + 1 : sum),
              0,
            )}
          </strong>
          item left
        </span>
        {/* Remove this if you don't implement routing */}
        <ul className="filters">
          <li>
            <NextLink href="/all" passHref>
              <a href="dummy">
                All
              </a>
            </NextLink>
          </li>
          <li>
            <NextLink href="/active" passHref>
              <a href="dummy">
                Active
              </a>
            </NextLink>
          </li>
          <li>
            <NextLink href="/completed" passHref>
              <a href="dummy">
                Completed
              </a>
            </NextLink>
          </li>
        </ul>
        {/* Hidden if no completed items are left ↓ */}
        {allTodos.data?.some((task) => task.completed) && (
          <button
            type="button"
            className="clear-completed"
            onClick={() => {
              clearCompleted.mutate();
            }}
          >
            Clear completed
          </button>
        )}
      </footer>
    </section>
  );
};

export default Todos;
