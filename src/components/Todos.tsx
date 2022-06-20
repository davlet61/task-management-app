import { trpc } from '@utils/trpc';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useIsMutating } from 'react-query';
import { v4 as uuid } from 'uuid';
import { HandleChangeFn, HandleSubmitFn, Task } from 'types';
import { useUpdateMyPresence } from '@liveblocks/react';
import { useRouter } from 'next/router';
import TodoItem from './TodoItem';
import { Broom } from './SVGs';
import UserIsTyping from './UserIsTyping';

const Todos = ({ id }: { id?: string }) => {
  const initialState: Task = {
    id: '',
    title: '',
    project_id: '1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07',
    description: '',
    completed: false,
    created_at: new Date(),
  };
  const [newTask, setNewTask] = useState(initialState);
  const { query } = useRouter();
  const updateMyPresence = useUpdateMyPresence();
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
    async onMutate({ data }) {
      await utils.cancelQuery(['todo.all']);
      const allTasks = utils.getQueryData(['todo.all']);
      if (!allTasks) {
        return;
      }
      utils.setQueryData(
        ['todo.all'],
        allTasks.map((t) => ({
          ...t,
          completed: data.completed,
        }
        )),
      );
    },
  });

  const hrefClasses = 'p-1 px-10 border-1 rounded-md shadow-md bg-neutral-100 hover:bg-neutral-200 active:bg-slate-500 active:text-white active:translate-y-1 active:shadow-none transition-all duration-300 ease-in-out';
  const inputClasses = 'p-2 mx-2 rounded border border-solid border-neutral-300 shadow-inner focus:outline focus:outline-slate-400 focus:shadow-outline';

  const handleChange: HandleChangeFn = (e) => {
    const { value, name } = e.target;
    setNewTask({ ...newTask, [name]: value });
    updateMyPresence({ isTyping: true });
  };

  const handleSubmit: HandleSubmitFn = (e) => {
    e.preventDefault();
    addTask.mutate({
      project_id: id || '1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07',
      title: newTask.title,
      description: newTask.description ?? '',
    });
    setNewTask(initialState);
    updateMyPresence({ isTyping: false });
  };

  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.invalidateQueries('todo.all');
    }
  }, [number, utils]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col items-center justify-center gap-2 md:flex-row md:ml-80">
          <legend className="w-full p-6 border-0 text-center border-b-2 border-solid border-neutral-400 mb-8 bg-neutral-200 font-bold">Add a new task</legend>
          <input
            id="add-title"
            type="text"
            name="title"
            className={`${inputClasses}`}
            placeholder="Task title ..."
            value={newTask.title}
            onChange={handleChange}
            required
          />
          <input
            id="add-description"
            name="description"
            className={`${inputClasses}`}
            placeholder="Short description of the task"
            value={newTask.description || ''}
            onChange={handleChange}
          />
          <button id="btnAddTodo" className="btn-red" type="submit">
            Add
          </button>
        </fieldset>
      </form>
      <UserIsTyping action="typing" />
      {filteredTodos && filteredTodos.length > 0 && (
        <section className="flex p-1 flex-col gap-2 overflow-hidden items-center justify-center mx-4">
          <label className="m-4 text-sm font-medium md:ml-60" htmlFor={`${newTask.id}-checkbox`}>
            <input
              id={`${newTask.id}-checkbox`}
              type="checkbox"
              checked={newTask.completed}
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 "
              onChange={(e) => {
                const { checked } = e.currentTarget;
                setNewTask({ ...newTask, completed: checked });
                toggleComplete.mutate({
                  data: { project_id: newTask.project_id, completed: checked },
                });
              }}
            />
            &nbsp; Mark all as complete
          </label>
          <ul className="flex flex-col items-center justify-center gap-3 md:ml-80">
            {filteredTodos?.filter((task) => {
              if (query.id?.includes('todo')) {
                return !task.completed;
              }
              if (query.id?.includes('done')) {
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
        <footer className="flex flex-col items-center justify-center gap-4 md:ml-80">
          <span className="uppercase mx-auto text-lg">
            <strong>
              {filteredTodos?.reduce(
                (sum, task) => (!task.completed ? sum + 1 : sum),
                0,
              )}
            </strong>
            &nbsp; item left
          </span>
          <ul className="flex flex-col gap-4 md:flex-row items-center justify-center">
            <li>
              <NextLink href={`/projects/${id}/all`} passHref>
                <a className={hrefClasses} href="dummy">
                  All&nbsp;
                  <span className="font-semibold">
                    (
                    {filteredTodos?.length}
                    )
                  </span>
                </a>
              </NextLink>
            </li>
            <li>
              <NextLink href={`/projects/${id}/todo`} passHref>
                <a className={hrefClasses} href="dummy">
                  Todo&nbsp;
                  <span className="text-orange-400 font-semibold">
                    (
                    {filteredTodos?.reduce(
                      (sum, task) => (!task.completed ? sum + 1 : sum),
                      0,
                    )}
                    )
                  </span>
                </a>
              </NextLink>
            </li>
            <li>
              <NextLink href={`/projects/${id}/done`} passHref>
                <a className={hrefClasses} href="dummy">
                  Done&nbsp;
                  <span className="text-green-600 font-semibold">
                    (
                    {filteredTodos?.reduce(
                      (sum, task) => (task.completed ? sum + 1 : sum),
                      0,
                    )}
                    )
                  </span>
                </a>
              </NextLink>
            </li>
          </ul>
          {allTodos.data?.some((task) => task.completed) && (
            <button
              type="button"
              className="flex justify-center items-center gap-2 p-3 md:p-4 my-2 rounded-md bg-red-700 mx-auto hover:bg-neutral-400 active:bg-slate-500 active:text-white active:translate-y-1 active:shadow-none transition-all duration-300 ease-in-out shadow-md"
              onClick={() => {
                clearCompleted.mutate();
              }}
            >
              <span className="text-sm md:text-lg font-semibold text-white uppercase">Clear Completed</span>
              <Broom />
            </button>
          )}
        </footer>
      )}
    </>
  );
};

export default Todos;

Todos.defaultProps = {
  id: '1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07',
};
