import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getPbpById: publicProcedure
    .input(z.object({ gameId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.playByPlay.findMany({
        where: {
          gameId: input.gameId,
        },
      });
    }),
});
