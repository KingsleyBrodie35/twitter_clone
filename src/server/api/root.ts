//used for creating api route endpoints to use in our client side typescript
import { postsRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
