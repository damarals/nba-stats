import { useState } from "react"
import Image from "next/image"
import { statistics } from "@/data/statistics"
import { api } from "@/utils/api"
import { format } from "date-fns"

import LineChart from "@/components/ui/LineChart"
import { Checkbox } from "@/components/ui/primitives/checkbox"
import { CalendarDateRangePicker } from "@/components/ui/primitives/datePick"
import { Label } from "@/components/ui/primitives/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/primitives/select"

type PlayerStats = {
  gameDate: Date
  statValue: number
  meanValue?: number
}

function formatData(data: PlayerStats[] | undefined) {
  if (!data) return [] as PlayerStats[]
  return data.map((result) => {
    const gameDate = format(result.gameDate, "dd/MMM")
    return {
      gameDate,
      statValue: result.statValue,
      meanValue: result.meanValue,
    }
  })
}

export default function Dashboard() {
  const [selectedTeamId, setSelectedTeamId] = useState("1610612745")
  const [selectedPlayerId, setSelectedPlayerId] = useState("1630224")
  const [selectedStatistic, setSelectedStatistic] = useState("pts")
  const [meanLine, setMeanLine] = useState(true)

  const { data: teams } = api.team.getTeams.useQuery()
  const { data: players } = api.player.getPlayersFromTeam.useQuery({
    teamId: selectedTeamId,
  })
  const { data: playerStats } = api.stats.getPlayerStats.useQuery({
    teamId: selectedTeamId,
    playerId: selectedPlayerId,
    statisticName: selectedStatistic,
  })
  const meanValue =
    playerStats &&
    parseFloat((playerStats.reduce((acc, curr) => acc + curr.statValue, 0) / playerStats.length).toFixed(1))
  const playerStatsWithMean = playerStats?.map((stat) => ({
    ...stat,
    meanValue,
  }))

  const selectedPlayer = players?.find((player) => player.id === selectedPlayerId)
  const selectedTeam = teams?.find((team) => team.id === selectedTeamId)
  const selectedStatisticData = statistics.find((stat) => stat.dbName === selectedStatistic)

  return (
    <section className="row-span-14 grid grid-cols-12 gap-4 p-4 bg-slate-100">
      <div className="grid grid-rows-6 gap-4 col-span-full lg:col-span-8 2xl:col-span-9">
        <div className="grid gap-4 grid-cols-10 row-span-2">
          <div className="flex items-center justify-center rounded-md bg-white px-2 py-4 shadow-lg col-span-5 md:col-span-3">
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
          <div className="flex flex-col rounded-md bg-white p-6 py-8 shadow-lg col-span-5 md:col-span-7">
            {/* Player Name */}
            <div className="flex sm:space-x-2 md:space-x-3 flex-col sm:flex-row">
              <span className="text-4xl md:text-6xl font-bold mb-1">{selectedPlayer?.firstName}</span>
              <span className="text-4xl md:text-6xl font-bold mb-1 text-orange-500">{selectedPlayer?.lastName}</span>
            </div>
            {/* Player Info */}
            <div className="flex flex-col sm:flex-row mb-auto">
              {selectedPlayer && selectedTeam ? (
                <>
                  <span className="text-base md:text-2xl font-light sm:border-r-2 pr-1 md:pr-[15.5px] whitespace-nowrap">
                    {selectedTeam?.nameFull}
                  </span>
                  <div className="flex">
                    <span className="text-base md:text-2xl font-light border-r-2 pr-1 sm:px-1 md:px-[15.5px] whitespace-nowrap">
                      #{selectedPlayer?.jerseyNumber}
                    </span>
                    <span className="text-base md:text-2xl font-light px-1 md:px-2 whitespace-nowrap">
                      {selectedPlayer?.position}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
            {/* Player Overall Stats */}
            <div className="flex">
              <div className="flex flex-col items-center border-r-2 pr-2 sm:pr-4">
                <span className="text-sm sm:text-xl font-semibold">PTS</span>
                <span className="font-bold text-2xl sm:text-5xl text-orange-500">23</span>
              </div>
              <div className="flex flex-col items-center border-r-2 px-2 sm:px-4">
                <span className="text-sm sm:text-xl font-semibold">REB</span>
                <span className="font-bold text-2xl sm:text-5xl text-orange-500">4</span>
              </div>
              <div className="flex flex-col items-center md:border-r-2 px-2 sm:px-4">
                <span className="text-sm sm:text-xl font-semibold">AST</span>
                <span className="font-bold text-2xl sm:text-5xl text-orange-500">3</span>
              </div>
              <div className="md:flex flex-col items-center border-r-2 px-4 hidden">
                <span className="text-xl font-semibold">BLK</span>
                <span className="font-bold text-5xl text-orange-500">1</span>
              </div>
              <div className="md:flex flex-col items-center pl-4 hidden">
                <span className="text-xl font-semibold">STL</span>
                <span className="font-bold text-5xl text-orange-500">2</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col row-span-4 rounded-md bg-white px-1 md:px-6 py-4 shadow-lg">
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
      </div>
      <div className="hidden lg:flex flex-col justify-between space-y-6 rounded-md bg-white p-8 shadow-lg lg:col-span-4 2xl:col-span-3">
        {/* Main controls */}
        <div className="flex flex-col space-y-4">
          <div className="space-y-1 rounded-md">
            <span className="font-semibold">Time:</span>
            <Select defaultValue={selectedTeamId} onValueChange={(value) => setSelectedTeamId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {teams ? (
                  teams.map((team) => (
                    <SelectItem key={team.id} value={team.id} className="cursor-pointer">
                      <div className="flex space-x-3">
                        <Image src={team.logo} alt={`Logo do Time ${team.nameFull}`} width={20} height={20} />
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
            <Select defaultValue={selectedPlayerId} onValueChange={(value) => setSelectedPlayerId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {players ? (
                  players.map((player) => (
                    <SelectItem key={player.id} value={player.id} className="cursor-pointer">
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
            <Select defaultValue={selectedStatistic} onValueChange={(value) => setSelectedStatistic(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {statistics ? (
                  statistics.map((statistic) => (
                    <SelectItem key={statistic.dbName} value={statistic.dbName} className="cursor-pointer">
                      <div className="flex space-x-2">
                        <span className="w-8 text-right">{statistic.abbreviation}</span>
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
            <span className="font-semibold text-gray-400">Intervalo de jogos a serem analisados:</span>
            <CalendarDateRangePicker />
          </div>
        </div>
        {/* Additional controls */}
        <div className="space-y-1 rounded-md">
          <span className="font-semibold">Configurações Adicionais:</span>
          <div className="flex items-center space-x-2">
            <Checkbox id="meanLine" checked={meanLine} onClick={() => setMeanLine(!meanLine)} />
            <Label htmlFor="meanLine">Linha Média Histórica da Estatística</Label>
          </div>
        </div>
      </div>
    </section>
  )
}
