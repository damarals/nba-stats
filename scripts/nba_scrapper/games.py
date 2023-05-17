import requests
import pandas as pd

from nba_scrapper.utils import nba_headers

def get_games(season: int) -> pd.DataFrame:
    """
    Collects information about NBA games in a specific season.

    Parameters:
    -----------
      - season (int): Year of the desired season.

    Returns:
    --------
      - da_games (pd.DataFrame): DataFrame with information about 
        the season's games. Each row represents a game and each column 
        represents a game detail, such as the game ID, date, home and 
        away team IDs, arena, and other details.
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
                'id': str(game['gameId']),
                'date': day['gameDate'],
                'homeTeamId': str(game['homeTeam']['teamId']),
                'awayTeamId': str(game['awayTeam']['teamId']),
                'arenaName': str(game['arenaName']),
                'arenaState': str(game['arenaState']),
                'arenaCity': str(game['arenaCity']),
                'seriesGameNumber': str(game['seriesGameNumber']).replace("Game ", ""),
                'seriesText': str(game['seriesText'])
            }
            games_list.append(game_info)

    da_games = pd.DataFrame(games_list)
    da_games['date'] = pd.to_datetime(da_games['date'], format = '%m/%d/%Y %H:%M:%S').dt.date
    da_games = da_games[(da_games['homeTeamId'] != '0') & (da_games['awayTeamId'] != '0')]
    
    return da_games