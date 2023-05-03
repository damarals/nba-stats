import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { CalendarDateRangePicker } from "@/components/ui/primitives/datePick";
import { Checkbox } from "@/components/ui/primitives/checkbox";
import { Label } from "@/components/ui/primitives/label";
import LineChart from "@/components/ui/LineChart";
import { useState } from "react";
import { api } from "@/utils/api";
import { format } from "date-fns";

type PlayerStats = {
  gameDate: Date;
  statValue: number;
  meanValue?: number;
};

function formatData(data: PlayerStats[] | undefined) {
  if (!data) return [] as PlayerStats[];
  return data.map((result) => {
    const gameDate = format(result.gameDate, "dd/MMM");
    return {
      gameDate,
      statValue: result.statValue,
      meanValue: result.meanValue,
    };
  });
}

const Home: NextPage = () => {
  const [selectedTeamId, setSelectedTeamId] = useState("1610612745");
  const [selectedPlayerId, setSelectedPlayerId] = useState("1630224");
  const [selectedStatistic, setSelectedStatistic] = useState("pts");
  const [meanLine, setMeanLine] = useState(true);

  const { data: teams } = api.team.getTeams.useQuery();
  const { data: players } = api.player.getPlayersFromTeam.useQuery({
    teamId: selectedTeamId,
  });
  const { data: playerStats } = api.stats.getPlayerStats.useQuery({
    teamId: selectedTeamId,
    playerId: selectedPlayerId,
    statisticName: selectedStatistic,
  });
  // TODO: round in tooltip
  const meanValue =
    playerStats &&
    parseFloat(
      (
        playerStats.reduce((acc, curr) => acc + curr.statValue, 0) /
        playerStats.length
      ).toFixed(1)
    );

  const playerStatsWithMean = playerStats?.map((stat) => ({
    ...stat,
    meanValue,
  }));

  const selectedPlayer = players?.find(
    (player) => player.id === selectedPlayerId
  );
  const selectedTeam = teams?.find((team) => team.id === selectedTeamId);
  const selectedStatisticData = statistics.find(
    (stat) => stat.dbName === selectedStatistic
  );

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <main className="grid min-h-screen grid-rows-9 gap-4 bg-slate-100 p-10">
        {/* Head section */}
        <div className="row-span-1 space-y-1">
          <h1 className="text-xl font-bold">Título do Dash</h1>
          <h3 className="font-light">Alguma descrição do que o dash faz...</h3>
        </div>
        {/* Player section */}
        <div className="row-span-3 grid gap-4 rounded-md md:grid-cols-5">
          <div className="flex items-center justify-center rounded-md bg-white px-6 py-4 shadow-md md:col-span-1">
            {selectedPlayer ? (
              <Image
                priority
                src={selectedPlayer?.headshot}
                alt={`Foto do Jogador ${selectedPlayer?.fullName}`}
                width={290}
                height={240}
                style={{ objectFit: "contain" }}
              />
            ) : null}
          </div>
          <div className="flex flex-col space-y-2 rounded-md bg-white p-6 shadow-md md:col-span-4">
            <span className="text-5xl font-bold">
              {selectedPlayer?.fullName}
            </span>
            <span className="text-lg font-light">
              {selectedPlayer && selectedTeam
                ? `${selectedTeam?.nameFull} | #${selectedPlayer?.jerseyNumber} | ${selectedPlayer?.position}`
                : null}
            </span>
          </div>
        </div>
        {/* Chart section */}
        <div className="row-span-6 grid gap-4 md:grid-cols-4">
          <div className="flex flex-col rounded-md bg-white px-6 py-4 shadow-md md:col-span-3">
            <h2>
              Gráfico de {selectedStatisticData?.name} (
              {selectedStatisticData?.abbreviation})
            </h2>
            {playerStatsWithMean ? (
              <LineChart
                className="md:h-full"
                data={formatData(playerStatsWithMean)}
                index="gameDate"
                categories={[selectedStatisticData?.name || ""]}
                meanLine={meanLine}
              />
            ) : null}
          </div>
          <div className="flex flex-col justify-between space-y-6 rounded-md bg-white p-8 shadow-md md:col-span-1">
            {/* Main controls */}
            <div className="flex flex-col space-y-4">
              <div className="space-y-1 rounded-md">
                <span className="font-semibold">Time:</span>
                <Select
                  defaultValue={selectedTeamId}
                  onValueChange={(value) => setSelectedTeamId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teams ? (
                      teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          <div className="flex space-x-3">
                            <Image
                              src={team.logo}
                              alt={`Logo do Time ${team.nameFull}`}
                              width={20}
                              height={20}
                            />
                            <span className="font-normal">{team.nameFull}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key="loading" value="">
                        Loading...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 rounded-md">
                <span className="font-semibold">Jogador:</span>
                <Select
                  defaultValue={selectedPlayerId}
                  onValueChange={(value) => setSelectedPlayerId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {players ? (
                      players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          <div className="flex space-x-2">
                            <span className="w-6 text-right">{`#${player.jerseyNumber}`}</span>
                            <span>-</span>
                            <span>{player.fullName}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key="loading" value="">
                        Loading...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 rounded-md">
                <span className="font-semibold">Estatística:</span>
                <Select
                  defaultValue={selectedStatistic}
                  onValueChange={(value) => setSelectedStatistic(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {statistics ? (
                      statistics.map((statistic) => (
                        <SelectItem
                          key={statistic.dbName}
                          value={statistic.dbName}
                        >
                          <div className="flex space-x-2">
                            <span className="w-8 text-right">
                              {statistic.abbreviation}
                            </span>
                            <span>-</span>
                            <span>{statistic.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key="loading" value="">
                        Loading...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 rounded-md">
                <span className="font-semibold">
                  Intervalo de jogos a serem analisados:
                </span>
                <CalendarDateRangePicker />
              </div>
            </div>
            {/* Additional controls */}
            <div className="space-y-1 rounded-md">
              <span className="font-semibold">Configurações Adicionais:</span>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="meanLine"
                  checked={meanLine}
                  onClick={() => setMeanLine(!meanLine)}
                />
                <Label htmlFor="meanLine">
                  Linha Média Histórica da Estatística
                </Label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const statistics = [
  {
    dbName: "min",
    name: "Minutos",
    abbreviation: "MIN",
  },
  {
    dbName: "fgm",
    name: "Arremessos de quadra convertidos",
    abbreviation: "FGM",
  },
  {
    dbName: "fga",
    name: "Arremessos de quadra tentados",
    abbreviation: "FGA",
  },
  {
    dbName: "fgpct",
    name: "Arremessos de quadra convertidos (%)",
    abbreviation: "FG%",
  },
  {
    dbName: "fg3m",
    name: "Arremessos de 3 pontos convertidos",
    abbreviation: "3PM",
  },
  {
    dbName: "fg3a",
    name: "Arremessos de 3 pontos tentados",
    abbreviation: "3PA",
  },
  {
    dbName: "fg3pct",
    name: "Arremessos de 3 pontos convertidos (%)",
    abbreviation: "3P%",
  },
  {
    dbName: "ftm",
    name: "Lances livres convertidos",
    abbreviation: "FTM",
  },
  {
    dbName: "fta",
    name: "Lances livres tentados",
    abbreviation: "FTA",
  },
  {
    dbName: "ftpct",
    name: "Lances livres convertidos (%)",
    abbreviation: "FT%",
  },
  {
    dbName: "oreb",
    name: "Rebotes ofensivos",
    abbreviation: "OREB",
  },
  {
    dbName: "dreb",
    name: "Rebotes defensivos",
    abbreviation: "DREB",
  },
  {
    dbName: "reb",
    name: "Rebotes totais",
    abbreviation: "REB",
  },
  {
    dbName: "ast",
    name: "Assistências",
    abbreviation: "AST",
  },
  {
    dbName: "stl",
    name: "Roubos de bola",
    abbreviation: "STL",
  },
  {
    dbName: "blk",
    name: "Tocos",
    abbreviation: "BLK",
  },
  {
    dbName: "turnover",
    name: "Turnovers",
    abbreviation: "TO",
  },
  {
    dbName: "pf",
    name: "Faltas",
    abbreviation: "PF",
  },
  {
    dbName: "pts",
    name: "Pontos",
    abbreviation: "PTS",
  },
  {
    dbName: "plusMinus",
    name: "Plus/Minus",
    abbreviation: "+/-",
  },
];
