import { z } from 'zod';
import createRouter from '@utils/createRouter';

const projectRouter = createRouter()
  .query('all', {
    async resolve({ ctx }) {
      const projects = await ctx.projects.findMany({
        orderBy: {
          created_at: 'desc',
        },
        select: {
          name: true,
          user_id: true,
          todos: true,
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
      const project = await ctx.projects.create({
        data: {
          name: input.name,
          user_id: input.user_id,
        },
      });
      return project;
    },
  });

export default projectRouter;
