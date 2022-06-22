import { z } from 'zod';
import createRouter from '@utils/createRouter';

const todoRouter = createRouter()
  .query('all', {
    async resolve({ ctx }) {
      const todos = await ctx.todos.findMany({
        orderBy: {
          created_at: 'desc',
        },
        select: {
          title: true,
          project_id: true,
          description: true,
          created_at: true,
          completed: true,
        },
      });
      return todos;
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

export default todoRouter;
