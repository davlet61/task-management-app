import { z } from 'zod';
import createRouter from '@utils/createRouter';

const projectRouter = createRouter()
  .query('all', {
    async resolve({ ctx }) {
      const projects = await ctx.projects.findMany({
        orderBy: {
          created_at: 'asc',
        },
        select: {
          id: true,
          name: true,
          user_id: true,
          todos: true,
        },
      });
      return projects;
    },
  })
  .mutation('add', {
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
  })
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        name: z.string().min(1).optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const todo = await ctx.projects.update({
        where: { id },
        data,
      });
      return todo;
    },
  })
  .mutation('delete', {
    input: z.string().uuid(),
    async resolve({ input: id, ctx }) {
      await ctx.projects.delete({ where: { id } });
      return id;
    },
  });

export default projectRouter;
