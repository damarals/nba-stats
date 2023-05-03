import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

type PlayerStats = {
  gameDate: Date;
  statValue: number;
  meanValue?: number;
};

export const statsRouter = createTRPCRouter({
  getPlayerStats: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        playerId: z.string(),
        statisticName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { teamId, playerId, statisticName } = input;
      const results = await ctx.prisma.$queryRaw`
        SELECT
          g.date as gameDate,
          SUM(ps.statValue) as statValue
        FROM
          games g
          JOIN player_stats ps ON ps.gameId = g.id
        WHERE
          ps.teamId = ${teamId}
          AND ps.playerId = ${playerId}
          AND ps.statName = ${statisticName}
        GROUP BY
          g.id
      `;
      return results as PlayerStats[];
    }),
  getTeamStats: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        statisticName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { teamId, statisticName } = input;
      const results = await ctx.prisma.teamStat.findMany({
        where: {
          teamId,
          statName: statisticName,
        },
        select: {
          statValue: true,
        },
      });
      return results;
    }),
});
