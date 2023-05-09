import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { z } from "zod"

type PlayerStats = {
  gameDate: Date
  statValue: number
  meanValue?: number
}

type PlayerStatsOverall = {
  pts: number
  reb: number
  ast: number
  blk: number
  stl: number
}

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
      const { teamId, playerId, statisticName } = input
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
      `
      return results as PlayerStats[]
    }),
  getPlayerOverallStats: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        playerId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { teamId, playerId } = input
      const results: PlayerStatsOverall[] = await ctx.prisma.$queryRaw`
        SELECT
          AVG(stats_per_game.pts) as pts,
          AVG(stats_per_game.reb) as reb,
          AVG(stats_per_game.ast) as ast,
          AVG(stats_per_game.blk) as blk,
          AVG(stats_per_game.stl) as stl
        FROM (
          SELECT 
            ps.gameId as gameId,
            SUM(CASE WHEN ps.statName = 'pts' THEN ps.statValue ELSE 0 END) as pts,
            SUM(CASE WHEN ps.statName = 'reb' THEN ps.statValue ELSE 0 END) as reb,
            SUM(CASE WHEN ps.statName = 'ast' THEN ps.statValue ELSE 0 END) as ast,
            SUM(CASE WHEN ps.statName = 'blk' THEN ps.statValue ELSE 0 END) as blk,
            SUM(CASE WHEN ps.statName = 'stl' THEN ps.statValue ELSE 0 END) as stl
          FROM
            player_stats ps 
          WHERE playerId = ${playerId} AND teamId = ${teamId}
          GROUP BY ps.gameId
        ) as stats_per_game
      `
      return results[0]
    }),
  getTeamStats: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        statisticName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { teamId, statisticName } = input
      const results = await ctx.prisma.teamStat.findMany({
        where: {
          teamId,
          statName: statisticName,
        },
        select: {
          statValue: true,
        },
      })
      return results
    }),
})
