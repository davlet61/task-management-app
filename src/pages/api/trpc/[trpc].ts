import { prisma } from '@client/.';
import { appRouter } from '@routers/.';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions,
) => ({
  req: opts?.req,
  prisma,
  projects: prisma.projects,
  todos: prisma.todos,
});
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  teardown: () => prisma.$disconnect(),
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },
});
