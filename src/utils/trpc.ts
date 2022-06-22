import { createReactQueryHooks } from '@trpc/react';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@pages/api/trpc/[trpc]';

export const trpc = createReactQueryHooks<AppRouter>();

// eslint-disable-next-line @typescript-eslint/naming-convention
export type inferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries'],
  > = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;
