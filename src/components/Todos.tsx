import { trpc } from '@utils/trpc';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useIsMutating } from 'react-query';
import { v4 as uuid } from 'uuid';
import useStore from '@store/.';
import { HandleChangeFn, HandleSubmitFn } from 'types';
import { useRouter } from 'next/router';
import TodoItem from './TodoItem';
import { Broom } from './SVGs';

const Todos = ({ id, filter }: { id?: string, filter?: string }) => {
  const [toggleAll, setToggleAll] = useState(false);
  const store = useStore((state) => state);
  const router = useRouter();
  const allTodos = trpc.useQuery(['todo.all'], {
    staleTime: 3000,
  });

  const filteredTodos = allTodos.data?.filter((t) => t.project_id === id);
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

  const toggleComplete = trpc.useMutation('todo.all-completed', {
    async onMutate({ done }) {
      await utils.cancelQuery(['todo.all']);
      const allTasks = utils.getQueryData(['todo.all']);
      if (!allTasks) {
        return;
      }
      utils.setQueryData(
        ['todo.all'],
        allTasks.map((t) => ({
          ...t,
          completed: done,
        }
        )),
      );
    },
  });

  const hrefClasses = 'p-1 px-10 border-1 rounded-md shadow-md bg-neutral-100 hover:bg-neutral-200 active:bg-slate-500 active:text-white active:translate-y-1 active:shadow-none transition-all duration-300 ease-in-out';
  const inputClasses = 'p-2 mx-2 rounded border border-solid border-neutral-300 shadow-inner focus:outline focus:outline-slate-400 focus:shadow-outline';

  const handleChange: HandleChangeFn = (e) => {
    const { value, name } = e.target;
    store.setNewTodo({ ...store.newTodo, [name]: value });
  };

  const handleSubmit: HandleSubmitFn = (e) => {
    e.preventDefault();
    addTask.mutate({
      project_id: id || '1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07',
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
    <section className="ml-80 flex flex-col justify-center items-center focus:out">
      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-wrap">
          <legend className="w-full p-4 border-0 text-center border-b-2 border-solid border-neutral-400 mb-8 mt-4">Add a new task</legend>
          <input
            id="txtTodoItemToAdd"
            type="text"
            name="title"
            className={`${inputClasses}`}
            placeholder="Task title ..."
            value={store.newTodo.title || ''}
            onChange={handleChange}
            required
          />
          <input
            id="add-description"
            name="description"
            className={`${inputClasses}`}
            placeholder="Short description of the task"
            value={store.newTodo.description || ''}
            onChange={handleChange}
          />
          <button id="btnAddTodo" className="btn-black" type="submit">
            Add
          </button>
        </fieldset>
      </form>
      {filteredTodos && filteredTodos.length > 0 && (
        <section className="flex p-6 flex-col gap-2">
          <label htmlFor="toggle-all">
            <input
              id="toggle-all"
              className="mx-2"
              type="checkbox"
              checked={toggleAll}
              onChange={(e) => {
                const { checked } = e.currentTarget;
                setToggleAll(checked);
                toggleComplete.mutate({
                  done: checked,
                });
                const path = checked ? '/completed' : '/all';
                router.push(path);
              }}
            />
            Mark all as complete
          </label>
          <ul className="flex flex-col items-center justify-center gap-3">
            {filteredTodos?.filter((task) => {
              if (filter === 'todo') {
                return !task.completed;
              }
              if (filter === 'done') {
                return task.completed;
              }
              return true;
            })
              .map((task) => (
                <TodoItem key={task.id} todo={task} />
              ))}
          </ul>
        </section>
      )}
      {filteredTodos && filteredTodos.length > 0 && (
        <footer className="flex flex-col gap-4">
          <span className="uppercase mx-auto text-lg">
            <strong>
              {filteredTodos?.reduce(
                (sum, task) => (!task.completed ? sum + 1 : sum),
                0,
              )}
            </strong>
            &nbsp; item left
          </span>
          <ul className="flex gap-4 items-center justify-center">
            <li>
              <NextLink href="/all" passHref>
                <a className={hrefClasses} href="dummy">
                  All
                </a>
              </NextLink>
            </li>
            <li>
              <NextLink href="/active" passHref>
                <a className={hrefClasses} href="dummy">
                  Active
                </a>
              </NextLink>
            </li>
            <li>
              <NextLink href="/completed" passHref>
                <a className={hrefClasses} href="dummy">
                  Completed
                </a>
              </NextLink>
            </li>
          </ul>
          {allTodos.data?.some((task) => task.completed) && (
            <button
              type="button"
              className="flex justify-center items-center gap-2 p-4 my-2 rounded-md bg-red-700 mx-auto hover:bg-neutral-400 active:bg-slate-500 active:text-white active:translate-y-1 active:shadow-none transition-all duration-300 ease-in-out shadow-md"
              onClick={() => {
                clearCompleted.mutate();
              }}
            >
              <span className="text-lg font-semibold text-white uppercase">Clear Completed</span>
              <Broom />
            </button>
          )}
        </footer>
      )}
    </section>
  );
};

export default Todos;

Todos.defaultProps = {
  id: '1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07',
  filter: 'all',
};
