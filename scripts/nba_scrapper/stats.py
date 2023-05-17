import time
import requests
import datetime
import pandas as pd

from nba_scrapper.utils import nba_headers, convert_minutes

## Players
def get_player_period_stats(game_id, period) -> pd.DataFrame:
    """
    Retrieves box score data for a given game and period from the NBA stats API 
    and processes it into a pandas DataFrame.

    Parameters:
      - game_id (str): String representing the unique identifier of the game 
        for which to retrieve box score data.
      - period (int): Integer representing the period of the game for which 
        to retrieve box score data (1-4, or 5 for overtime).

    Returns:
      - da_boxscore (pd.DataFrame): DataFrame containing processed box score data 
        for the specified game and period, with columns including the game ID, team ID, 
        player ID, period, statistic name and the respective value.
    """
    url = f'https://stats.nba.com/stats/boxscoretraditionalv3?GameID={game_id}&LeagueID=00' + \
    f'&startPeriod={period}&endPeriod={period}&startRange=0&endRange=28800&rangeType=1'
    response = requests.get(url, headers = nba_headers)
    json_data = response.json()

    da_home = pd.json_normalize(json_data["boxScoreTraditional"]["homeTeam"]["players"])
    da_home["teamId"] = json_data["boxScoreTraditional"]["homeTeam"]["teamId"]
    da_home["isHome"] = True
    da_home["opponentTeamId"] = json_data["boxScoreTraditional"]["awayTeam"]["teamId"]
    da_away = pd.json_normalize(json_data["boxScoreTraditional"]["awayTeam"]["players"])
    da_away["teamId"] = json_data["boxScoreTraditional"]["awayTeam"]["teamId"]
    da_away["isHome"] = False
    da_away["opponentTeamId"] = json_data["boxScoreTraditional"]["homeTeam"]["teamId"]

    da_player_period_stats = pd.concat([da_home, da_away])
    da_player_period_stats["gameId"] = json_data["boxScoreTraditional"]["gameId"]
    da_player_period_stats["period"] = period

    da_player_period_stats = da_player_period_stats.assign(
        gameId = lambda x: x['gameId'].astype("string"),
        teamId = lambda x: x['teamId'].astype("string"),
        playerId = lambda x: x['personId'].astype("string"),
        period = lambda x: x['period'].astype("Int64"),
        min = lambda x: x['statistics.minutes'].apply(convert_minutes).astype("Float64"),
        fgm = lambda x: x['statistics.fieldGoalsMade'].astype("Int64"),
        fga = lambda x: x['statistics.fieldGoalsAttempted'].astype("Int64"),
        fgpct = lambda x: x['statistics.fieldGoalsPercentage'].astype("Float64"),
        fg3m = lambda x: x['statistics.threePointersMade'].astype("Int64"),
        fg3a = lambda x: x['statistics.threePointersAttempted'].astype("Int64"),
        fg3pct = lambda x: x['statistics.threePointersPercentage'].astype("Float64"),
        ftm = lambda x: x['statistics.freeThrowsMade'].astype("Int64"),
        fta = lambda x: x['statistics.freeThrowsAttempted'].astype("Int64"),
        ftpct = lambda x: x['statistics.freeThrowsPercentage'].astype("Float64"),
        oreb = lambda x: x['statistics.reboundsOffensive'].astype("Int64"),
        dreb = lambda x: x['statistics.reboundsDefensive'].astype("Int64"),
        reb = lambda x: x['statistics.reboundsTotal'].astype("Int64"),
        ast = lambda x: x['statistics.assists'].astype("Int64"),
        stl = lambda x: x['statistics.steals'].astype("Int64"),
        blk = lambda x: x['statistics.blocks'].astype("Int64"),
        turnover = lambda x: x['statistics.turnovers'].astype("Int64"),
        pf = lambda x: x['statistics.foulsPersonal'].astype("Int64"),
        pts = lambda x: x['statistics.points'].astype("Int64"),
        plusMinus = lambda x: x['statistics.plusMinusPoints'].astype("Int64"),
    )
    da_player_period_stats = da_player_period_stats[['gameId', 'teamId', 'playerId', 'period',
                                                     'min', 'fgm', 'fga', 'fgpct', 'fg3m', 'fg3a', 'fg3pct', 
                                                     'ftm', 'fta', 'ftpct', 'oreb', 'dreb', 'reb', 'ast', 
                                                     'stl', 'blk', 'turnover', 'pf', 'pts', 'plusMinus']]
    da_player_period_stats = pd.melt(da_player_period_stats, id_vars = ['gameId', 'teamId', 'playerId', 'period'],
                                     value_vars = ['min', 'fgm', 'fga', 'fgpct', 'fg3m', 'fg3a', 
                                                   'fg3pct', 'ftm', 'fta', 'ftpct', 'oreb', 'dreb', 
                                                   'reb', 'ast', 'stl', 'blk', 'turnover', 'pf', 
                                                   'pts', 'plusMinus'],
                                     var_name = 'statName', value_name = 'statValue')

    return da_player_period_stats

def get_stats_from_game_id(game_id: str) -> pd.DataFrame:
    """
    Retrieves the box score statistics of all players for a given game.

    Parameters:
      - game_id (str): The unique identifier of the game to retrieve the data from.

    Returns:
      - da_boxscore (pd.DataFrame): DataFrame containing box score statistics of all players 
        for the specified game, broken down by period.
    """
    da_player_stats = pd.DataFrame()
    for period in range(1,  5):
        da_player_period_stats = get_player_period_stats(game_id, period)
        da_player_stats = pd.concat([da_player_stats, da_player_period_stats], ignore_index = True)
        
    return da_player_stats

def get_game_ids(season: int) -> pd.DataFrame:
    """
    Collects the ids and dates of games from a given season, specified by the 'season' argument.

    Arguments:
      - season (int): The year of the season (e.g. 2023 for the 2023-2024 season).

    Returns:
      - da_game_ids (pd.Dataframe): A DataFrame containing the columns gameDate and gameId.
    """
    season = season - 1
    url = f'https://stats.nba.com/stats/scheduleleaguev2?LeagueID=00&Season={season}'
    response = requests.get(url, headers = nba_headers)
    json_data = response.json()

    games_list = []
    for day in json_data['leagueSchedule']['gameDates']:
        games = day['games']
        for game in games:
            game_info = {
                'gameDate': day['gameDate'],
                'gameId': game['gameId']
            }
            games_list.append(game_info)

    da_game_ids = pd.DataFrame(games_list)
    da_game_ids['gameDate'] = pd.to_datetime(da_game_ids['gameDate'], format = '%m/%d/%Y %H:%M:%S').dt.date
    
    return da_game_ids

def get_player_stats(start_date: datetime.date, end_date: datetime.date = datetime.date.today() - datetime.timedelta(days = 1), 
                     wait_time: int = 5) -> pd.DataFrame:
    """
    Collects boxscore data for all games within the time interval defined by start_date and end_date.
    Returns a dataframe with the boxscore data for all games.

    Parameters:
      - start_date (datetime.date): Start date of the time interval to be considered for data collection.
      - end_date (datetime.date): End date of the time interval to be considered for data collection.
      - wait_time (int): Wait time between each data collection request (in seconds).

    Returns:
      - da_player_stats (pd.DataFrame): DataFrame with the boxscore data for all games within 
        the time interval defined by start_date and end_date.
    """
    da_player_stats = pd.DataFrame()
    game_ids = get_game_ids(end_date.year)

    game_ids_filtered = game_ids.loc[(game_ids['gameDate'] >= start_date) & (game_ids['gameDate'] <= end_date)]
    game_ids_filtered = game_ids_filtered[~game_ids_filtered['gameId'].str.startswith('003')]

    for i, (game_date, game_id) in enumerate(game_ids_filtered.to_records(index = False)):
        start_time = time.time()

        da_player_stats_single = get_stats_from_game_id(game_id)
        da_player_stats = pd.concat([da_player_stats, da_player_stats_single], ignore_index = True)

        elapsed_time = time.time() - start_time
        print(f"[{i+1}/{len(game_ids_filtered)}, {elapsed_time:.0f}s] Data: {game_date} | Game ID: {game_id}")
        time.sleep(wait_time)

    return da_player_stats

## Teams
def get_team_stats(season: int) -> pd.DataFrame:
    """
    Retrieves team statistics for all NBA teams in a given season.

    Parameters:
      - season (int): Year of the season to retrieve the data from. 
      For example, 2021 represents the 2020-2021 NBA season.

    Returns:
      - da_team_stats (pd.DataFrame): DataFrame containing statistics
        for all NBA teams in the specified season, including: team ID, 
        games played (gp), wins (w), losses (l), winning percentage (wpct), 
        minutes played (min), field goals made (fgm) and others stats.
    """
    season_str = f'{season-1}-{season-2000}'
    url = f'https://stats.nba.com/stats/leaguedashteamstats?LastNGames=0&LeagueID=00&MeasureType=Base' + \
    '&Month=0&OpponentTeamID=0&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N' + \
    f'&Season={season_str}&SeasonType=Regular%20Season&TeamID=0&TwoWay=0'
    response = requests.get(url, headers = nba_headers)
    json_data = response.json()

    da_team_stats = pd.DataFrame(json_data['resultSets'][0]['rowSet'], columns = json_data['resultSets'][0]['headers'])
    da_team_stats = da_team_stats.filter(regex = '^(?!.*_RANK$)')
    da_team_stats = da_team_stats.assign(
      teamId = lambda x: x['TEAM_ID'].astype('string'), 
      gp = lambda x: x['GP'].astype('Int64'), 
      w = lambda x: x['W'].astype('Int64'),
      l = lambda x: x['L'].astype('Int64'),
      wpct = lambda x: x['W_PCT'].astype('Float64'), 
      min = lambda x: x['MIN'].astype('Float64'), 
      fgm = lambda x: x['FGM'].astype('Float64'), 
      fga = lambda x: x['FGA'].astype('Float64'), 
      fgpct = lambda x: x['FG_PCT'].astype('Float64'), 
      fg3m = lambda x: x['FG3M'].astype('Float64'), 
      fg3a = lambda x: x['FG3A'].astype('Float64'), 
      fg3pct = lambda x: x['FG3_PCT'].astype('Float64'), 
      ftm = lambda x: x['FTM'].astype('Float64'),  
      fta = lambda x: x['FTA'].astype('Float64'),  
      ftpct = lambda x: x['FT_PCT'].astype('Float64'),  
      oreb = lambda x: x['OREB'].astype('Float64'), 
      dreb = lambda x: x['DREB'].astype('Float64'),  
      reb = lambda x: x['REB'].astype('Float64'),  
      ast = lambda x: x['AST'].astype('Float64'),  
      turnover = lambda x: x['TOV'].astype('Float64'),  
      stl = lambda x: x['STL'].astype('Float64'),  
      blk = lambda x: x['BLK'].astype('Float64'),  
      blka = lambda x: x['BLKA'].astype('Float64'),  
      pf = lambda x: x['PF'].astype('Float64'),  
      pfd = lambda x: x['PFD'].astype('Float64'),  
      pts = lambda x: x['PTS'].astype('Float64'), 
      plusMinus = lambda x: x['PLUS_MINUS'].astype('Float64')
    )
    da_team_stats = da_team_stats[['teamId', 'gp', 'w', 'l', 'wpct', 'min', 'fgm', 
                                   'fga', 'fgpct', 'fg3m', 'fg3a', 'fg3pct', 'ftm', 
                                   'fta', 'ftpct', 'oreb', 'dreb', 'reb', 'ast', 
                                   'turnover', 'stl', 'blk', 'blka', 'pf', 'pfd', 
                                   'pts', 'plusMinus']]
    da_team_stats = pd.melt(da_team_stats, id_vars = ['teamId'],
                            value_vars = ['gp', 'w', 'l', 'min', 'fgm', 'fga', 'fgpct', 
                                          'fg3m', 'fg3a', 'fg3pct', 'ftm', 'fta', 
                                          'ftpct', 'oreb', 'dreb', 'reb', 'ast', 
                                          'stl', 'blk', 'turnover', 'pf', 'pts', 'plusMinus'],
                            var_name = 'statName', value_name = 'statValue')

    return da_team_stats