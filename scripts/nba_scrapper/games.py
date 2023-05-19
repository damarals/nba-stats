import requests
import pandas as pd

from nba_scrapper.teams import get_teams
from nba_scrapper.utils import pluck

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
    teams = get_teams(season)

    games_list = []
    for team in teams.itertuples():
        url = f'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/{team.id}/schedule'
        for season_type in [2, 3]: # 2: Regular Season, 3: Playoffs
            params = {'region': 'br', 'lang': 'pt', 
                      'season': season, 'seasontype': season_type}
            response = requests.get(url, params = params)
            json_data = response.json()

            for game in pluck(json_data, 'events'):
                # Check if game is completed
                if pluck(game, "competitions", 0, "status", "type", "completed") is True: 
                    game_info = {
                        'id': str(pluck(game, 'id')),
                        'date': str(pluck(game, 'date')),
                        'homeTeamId': str(pluck(game, 'competitions', 0, 'competitors', 0, 'team', 'id')),
                        'awayTeamId': str(pluck(game, 'competitions', 0, 'competitors', 1, 'team', 'id')),
                        'arenaName': str(pluck(game, 'competitions', 0, 'venue', 'fullName')),
                        'arenaCity': str(pluck(game, 'competitions', 0, 'venue', 'address', 'city')),
                    }
                    games_list.append(game_info)

    da_games = pd.DataFrame(games_list)
    da_games['date'] = pd.to_datetime(da_games['date'], format = '%Y-%m-%dT%H:%MZ').date()
    da_games = da_games.sort_values(by = 'date', ascending = True).reset_index(drop = True)
    
    return da_games