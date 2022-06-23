import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import prisma from 'db';

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions,
) => ({
  req: opts?.req,
  prisma,
  projects: prisma.projects,
  todos: prisma.todos,
});

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
