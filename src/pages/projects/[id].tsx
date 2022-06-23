import type { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import AddTodo from '@components/AddTodo';
import Sidebar from '@components/Sidebar';
import TodoList from '@components/TodoList';
import { appRouter } from '@pages/api/trpc/[trpc]';
import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@utils/context';
import { Params, Task } from 'types';

interface IProjectProps {
  todos: Task[];
}
const Projects: NextPage<IProjectProps> = ({ todos }) => (
  <main>
    <Sidebar />
    <AddTodo />
    <TodoList tasks={todos} />
  </main>
);

export default Projects;

export const getStaticPaths: GetStaticPaths = async () => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
  });
  const allIds = await ssg.fetchQuery('project.ids');

  return {
    paths: allIds.map((p: Params) => ({
      params: { id: p.id },
    })),

    fallback: false,
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>,
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
  });

  await ssg.fetchQuery('project.ids');
  const todos = await ssg.fetchQuery('todo.all-match', { project_id: context.params?.id ?? '' });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: context.params?.id ?? '',
      todos,
    },
    revalidate: 1,
  };
};
