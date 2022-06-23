import type {
  GetServerSidePropsContext, InferGetServerSidePropsType,
} from 'next';
import Sidebar from '@components/Sidebar';
import { appRouter } from '@pages/api/trpc/[trpc]';
import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@utils/context';
import Todos from '@components/Todos';
import { transformer } from '@utils/trpc';
import Layout from '@components/Layout';

const Projects = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { id } = props;
  return (
    <Layout>
      <Sidebar />
      <Todos id={id} />
    </Layout>
  );
};

export default Projects;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string, filter: string }>,
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer,
  });
  const id = context.params?.id as string;

  // await ssg.fetchQuery('project.ids');
  const single = await ssg.fetchQuery('project.single', { id: id[0] });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: single?.id,
      filter: ['all', 'todo', 'done'].map((f) => f),
    },
  };
};
