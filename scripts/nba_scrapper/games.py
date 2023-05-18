import requests
import pandas as pd

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
    url = 'https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings'
    params = {'region': 'br', 'lang': 'pt', 'season': season}
    response = requests.get(url, params = params)
    json_data = response.json()

    return json_data

    games_list = []
    for day in json_data['leagueSchedule']['gameDates']:
        games = day['games']
        for game in games:
            if game['gameCode'] != '':
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
    
    return da_games