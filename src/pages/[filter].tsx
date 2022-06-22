import { createSSGHelpers } from '@trpc/react/ssg';
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {
  RefObject, useEffect, useRef, useState,
} from 'react';
import { useIsMutating } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { inferQueryOutput, trpc } from '@utils/trpc';
import { createContext, appRouter } from '@pages/api/trpc/[trpc]';
import Image from 'next/image';

type Task = inferQueryOutput<'todo.all'>[number];

const useClickOutside = ({
  ref,
  callback,
  enabled,
}: {
  ref: RefObject<any>;
  callback: () => void;
  enabled: boolean;
}) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callbackRef.current();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line consistent-return
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, enabled]);
};
const ListItem = ({ task }: { task: Task }) => {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useContext();
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);
  useEffect(() => {
    setText(task.text);
  }, [task.text]);
  useEffect(() => {
    setCompleted(task.completed);
  }, [task.completed]);

  const editTask = trpc.useMutation('edit', {
    async onMutate({ id, data }) {
      await utils.cancelQuery(['all']);
      const allTasks = utils.getQueryData(['all']);
      if (!allTasks) {
        return;
      }
      utils.setQueryData(
        ['all'],
        allTasks.map((t) => (t.id === id
          ? {
            ...t,
            ...data,
          }
          : t)),
      );
    },
  });
  const deleteTask = trpc.useMutation('delete', {
    async onMutate() {
      await utils.cancelQuery(['all']);
      const allTasks = utils.getQueryData(['all']);
      if (!allTasks) {
        return;
      }
      utils.setQueryData(
        ['all'],
        allTasks.filter((t) => t.id != task.id),
      );
    },
  });

  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback() {
      editTask.mutate({
        id: task.id,
        data: { text },
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
          type="button"
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
              data: { text },
            });
            setEditing(false);
          }
        }}
      />
    </li>
  );
};

const TodosPage = ({
  filter,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const allTasks = trpc.useQuery(['todo.all'], {
    staleTime: 3000,
  });
  const utils = trpc.useContext();
  const addTask = trpc.useMutation('todo.add', {
    async onMutate({ text }) {
      await utils.cancelQuery(['todo.all']);
      const tasks = allTasks.data ?? [];
      utils.setQueryData(
        ['all'],
        [
          ...tasks,
          {
            id: `${Math.random()}`,
            completed: false,
            text,
            createdAt: new Date(),
          },
        ],
      );
    },
  });

  const clearCompleted = trpc.useMutation('clearCompleted', {
    async onMutate() {
      await utils.cancelQuery(['all']);
      const tasks = allTasks.data ?? [];
      utils.setQueryData(
        ['all'],
        tasks.filter((t) => !t.completed),
      );
    },
  });

  const number = useIsMutating();
  useEffect(() => {
    // invalidate queries when mutations have settled
    // doing this here rather than in `onSettled()`
    // to avoid race conditions if you're clicking fast
    if (number === 0) {
      utils.invalidateQueries('all');
    }
  }, [number, utils]);
  return (
    <>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={(e) => {
              const text = e.currentTarget.value.trim();
              if (e.key === 'Enter' && text) {
                addTask.mutate({ text });
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
            {/* These are here just to show the structure of the list items */}
            {/* List items should get the class `editing`
            when editing and `completed` when marked as completed */}
            {allTasks.data
              ?.filter((task) => {
                if (filter === 'active') {
                  return !task.completed;
                }
                if (filter === 'completed') {
                  return task.completed;
                }
                return true;
              })
              .map((task) => (
                <ListItem key={task.id} task={task} />
              ))}
          </ul>
        </section>
        {/* This footer should be hidden by default and shown when there are todos */}
        <footer className="footer">
          {/* This should be `0 items left` by default */}
          <span className="todo-count">
            <strong>
              {allTasks.data?.reduce(
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
              <Link href="/all" passHref>
                <a href="dummy">
                  All
                </a>
              </Link>
            </li>
            <li>
              <Link href="/active" passHref>
                <a href="dummy">
                  Active
                </a>
              </Link>
            </li>
            <li>
              <Link href="/completed" passHref>
                <a href="dummy">
                  Completed
                </a>
              </Link>
            </li>
          </ul>
          {/* Hidden if no completed items are left ↓ */}
          {allTasks.data?.some((task) => task.name) && (
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
      <footer className="info">
        <p>Double-click to edit a todo</p>
        {/* Change this out with your name and url ↓ */}
        <p>
          Created with
          {' '}
          <a href="http://trpc.io">tRPC</a>
          {' '}
          by
          {' '}
          <a href="https://twitter.com/alexdotjs">alexdotjs / KATT</a>
          .
        </p>
        <p>
          <a href="https://github.com/trpc/examples-next-prisma-todomvc">
            Source code
          </a>
          {' '}
          -
          {' '}
          <a href="https://codesandbox.io/s/github/trpc/trpc/tree/main/examples/next-prisma-todomvc?file=/pages/%5Bfilter%5D.tsx">
            <strong>Play with it in CodeSandbox.</strong>
          </a>
          .
        </p>
        <p>
          Based on
          {' '}
          <a href="http://todomvc.com">TodoMVC</a>
          , template made by
          {' '}
          <a href="http://sindresorhus.com">Sindre Sorhus</a>
          .
        </p>
        <div style={{ marginTop: '100px' }}>
          <p>
            <a
              href="https://vercel.com/?utm_source=trpc&utm_campaign=oss"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/powered-by-vercel.svg"
                alt="Powered by Vercel"
                height={25}
                width={25}
              />
            </a>
          </p>
        </div>
      </footer>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default TodosPage;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ['active', 'completed', 'all'].map((filter) => ({
    params: { filter },
  })),

  fallback: false,
});

export const getStaticProps = async (
  context: GetStaticPropsContext<{ filter: string }>,
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
  });

  await ssg.fetchQuery('all');

  return {
    props: {
      trpcState: ssg.dehydrate(),
      filter: context.params?.filter ?? 'all',
    },
    revalidate: 1,
  };
};
