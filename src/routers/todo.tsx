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
          id: true,
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
  .mutation('add', {
    input: z.object({
      project_id: z.string(),
      title: z.string(),
      description: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const project = await ctx.todos.create({
        data: {
          title: input.title,
          project_id: input.project_id,
          description: input.description,
        },
      });
      return project;
    },
  });

export default todoRouter;
