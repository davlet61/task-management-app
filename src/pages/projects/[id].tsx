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
  const { id } = props;
  return (
    <main>
      <Sidebar />
      <Todos id={id} />
    </main>
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

// export const getStaticPaths: GetStaticPaths = async () => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//   const allIds = await ssg.fetchQuery('project.ids');

//   return {
//     paths: allIds.map((p: Params) => ({
//       params: { id: p.id },
//     })),

//     fallback: false,
//   };
// };

// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ id: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     transformer,
//     ctx: await createContext(),
//   });

//   await ssg.fetchQuery('project.ids');

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       id: context.params?.id ?? '',
//     },
//     revalidate: 1,
//   };
// };
