import type { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import AddTodo from '@components/AddTodo';
import Sidebar from '@components/Sidebar';
import TodoList from '@components/TodoList';
import { appRouter } from '@pages/api/trpc/[trpc]';
import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@utils/context';
import { Params, Project } from 'types';

interface IProjectProps {
  projects: Project[];
}
const Projects: NextPage<IProjectProps> = ({ projects }) => {
  // eslint-disable-next-line no-console
  console.log('projects', projects);

  return (
    <main>
      <Sidebar />
      <AddTodo />
      <TodoList />
    </main>
  );
};

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
  const projects = await ssg.fetchQuery('project.all');

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: context.params?.id ?? '',
      projects,
    },
    revalidate: 1,
  };
};
