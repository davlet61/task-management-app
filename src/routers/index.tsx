import type { Context } from '@pages/api/trpc/[trpc]';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export const appRouter = trpc
  .router<Context>()
  .query('all', {
    async resolve({ ctx }) {
      const projects = await ctx.projects.findMany({
        orderBy: {
          created_at: 'desc',
        },
        select: {
          name: true,
          user_id: true,
        },
      });
      return projects;
    },
  })
  .mutation('add-project', {
    input: z.object({
      user_id: z.string(),
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.projects.create({
          data: {
            name: input.name,
            user_id: input.user_id,
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
  });

export type AppRouter = typeof appRouter;
