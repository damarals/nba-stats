import { createTRPCRouter } from "@/server/api/trpc";
import { teamRouter } from "@/server/api/routers/team";
import { playerRouter } from "@/server/api/routers/player";
import { statsRouter } from "@/server/api/routers/stats";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  team: teamRouter,
  player: playerRouter,
  stats: statsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
