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
      const { project_id, title, description } = input;
      const project = await ctx.todos.create({
        data: {
          project_id,
          title,
          description,
        },
      });
      return project;
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).optional(),
        description: z.string().min(3).optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const todo = await ctx.todos.update({
        where: { id },
        data,
      });
      return todo;
    },
  })
  .mutation('delete', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      await ctx.todos.delete({ where: { id } });
      return id;
    },
  });

export default todoRouter;
