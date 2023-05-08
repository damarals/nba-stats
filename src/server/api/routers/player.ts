import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { z } from "zod"

export const playerRouter = createTRPCRouter({
  getPlayersFromTeam: publicProcedure.input(z.object({ teamId: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.player.findMany({
      where: {
        teamId: input.teamId,
      },
      select: {
        id: true,
        teamId: true,
        firstName: true,
        lastName: true,
        fullName: true,
        position: true,
        jerseyNumber: true,
        headshot: true,
      },
    })
  }),
})
