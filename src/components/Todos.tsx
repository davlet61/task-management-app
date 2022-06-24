import { trpc } from '@utils/trpc';
import NextLink from 'next/link';
import { useEffect } from 'react';
import { useIsMutating } from 'react-query';
import { v4 as uuid } from 'uuid';
import { ReactQueryDevtools } from 'react-query/devtools';
import ListItem from './Item';

const Todos = ({ id }: { id: string }) => {
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
          },
        ],
      );
    },
  });

  // const clearCompleted = trpc.useMutation('todo.clearCompleted', {
  //   async onMutate() {
  //     await utils.cancelQuery(['todo.all']);
  //     const tasks = allTodos.data ?? [];
  //     utils.setQueryData(
  //       ['todo.all'],
  //       tasks.filter((t) => !t.completed),
  //     );
  //   },
  // });

  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.invalidateQueries('todo.all');
    }
  }, [number, utils]);
  return (
    <>
      <section className="ml-80">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onKeyDown={(e) => {
              const title = e.currentTarget.value.trim();
              if (e.key === 'Enter' && title) {
                addTask.mutate({ title, project_id: id, description: '' });
                e.currentTarget.value = '';
              }
            }}
          />
        </header>
        {/* This section should be hidden by default and shown when there are todos */}
        <section className="main">
          <label htmlFor="toggle-all">
            Mark all as complete
            <input id="toggle-all" className="toggle-all" type="checkbox" />
          </label>
          <ul className="todo-list">
            {filteredTodos?.map((task) => (
              <ListItem key={task.id} task={task} />
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
            {' '}
            item left
          </span>
          {/* Remove this if you don't implement routing */}
          <ul className="filters">
            <li>
              <NextLink href="/all">
                <a>
                  All
                </a>
              </NextLink>
            </li>
            <li>
              <NextLink href="/active">
                <a>
                  Active
                </a>
              </NextLink>
            </li>
            <li>
              <NextLink href="/completed">
                <a>
                  Completed
                </a>
              </NextLink>
            </li>
          </ul>
          {/* Hidden if no completed items are left ↓ */}
          {allTodos.data?.some((task) => task.completed) && (
            <button
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
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default Todos;
