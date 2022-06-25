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
      <main className="h-[calc(100vh-5rem)]">
        <Sidebar />
        <Todos id={id} />
      </main>
    </Layout>
  );
};

export default Projects;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>,
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer,
  });
  const id = context.params?.id as string;

  await ssg.fetchQuery('project.ids');

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};
