import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { prisma } from '@client/.';

export const appRouter = trpc
  .router()
  .query('all', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      const count = await prisma.shortLink.count({
        where: {
          slug: input.slug,
        },
      });
      return { used: count > 0 };
    },
  })
  .mutation('createSlug', {
    input: z.object({
      slug: z.string(),
      url: z.string(),
    }),
    async resolve({ input }) {
      try {
        await prisma.shortLink.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

// import * as trpc from '@trpc/server';
// import * as trpcNext from '@trpc/server/adapters/next';
// import { z } from 'zod';

// export const appRouter = trpc
//   .router()
//   .query('hello', {
//     input: z
//       .object({
//         text: z.string().nullish(),
//       })
//       .nullish(),
//     resolve({ input }) {
//       return {
//         greeting: `hello ${input?.text ?? 'world'}`,
//       };
//     },
//   });

// // export type definition of API
// export type AppRouter = typeof appRouter;

// // export API handler
// export default trpcNext.createNextApiHandler({
//   router: appRouter,
//   createContext: () => null,
// });
