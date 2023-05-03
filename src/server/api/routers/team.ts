import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const teamRouter = createTRPCRouter({
  getTeams: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.team.findMany({
      orderBy: {
        nameFull: "asc",
      },
    });
  }),
});
