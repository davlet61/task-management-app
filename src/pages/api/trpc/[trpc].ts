import prisma from 'db';
import superjson from 'superjson';
import projectRouter from '@routers/project';
import todoRouter from '@routers/todo';
import * as trpcNext from '@trpc/server/adapters/next';
import createRouter from '@utils/createRouter';
import { createContext } from '@utils/context';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('project.', projectRouter)
  .merge('todo.', todoRouter);

export type AppRouter = typeof appRouter;

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
