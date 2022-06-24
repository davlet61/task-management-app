import type { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import Sidebar from '@components/Sidebar';
import { appRouter } from '@pages/api/trpc/[trpc]';
import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@utils/context';
import { Params } from 'types';
import Todos from '@components/Todos';

interface IProjectProps {
  id: string;
}
const Projects: NextPage<IProjectProps> = ({ id }) => (
  <main>
    <Sidebar />
    <Todos id={id} />
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

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: context.params?.id ?? '',
    },
    revalidate: 1,
  };
};
