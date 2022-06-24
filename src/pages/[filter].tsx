import type {
  GetServerSidePropsContext, InferGetServerSidePropsType,
} from 'next';
import Sidebar from '@components/Sidebar';
import { appRouter } from '@pages/api/trpc/[trpc]';
import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@utils/context';
import Todos from '@components/Todos';
import { transformer } from '@utils/trpc';

const Projects = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { filter } = props;
  return (
    <main>
      <Sidebar />
      <Todos filter={filter} />
    </main>
  );
};

export default Projects;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ filter: string }>,
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer,
  });
  const filter = context.params?.filter as string;

  ['todo', 'done', 'all'].map((f) => f);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      filter,
    },
  };
};
