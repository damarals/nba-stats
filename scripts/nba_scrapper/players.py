import requests
import pandas as pd

from nba_scrapper.utils import convert_height, convert_weight, pluck
from nba_scrapper.teams import get_teams

def get_players(season: int) -> pd.DataFrame:
    """
    Retrieves information on all NBA players who played in a given season.

    Parameters:
      - season (int): Year of the season to retrieve the data from. 
        For example, 2021 represents the 2020-2021 NBA season.

    Returns:
      - da_players (pd.Dataframe): DataFrame containing information on all NBA players 
        who played in the specified season.
    """
    teams = get_teams(season)

    players_list = []
    for team in teams.itertuples():
        url = f'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/{team.id}'
        params = {'region': 'br', 'lang': 'pt', 'enable': 'roster'}
        response = requests.get(url, params = params)
        json_data = response.json()

        for player in pluck(json_data, 'team', 'athletes'):
            player_info = {
                'id': str(pluck(player, 'id')),
                'teamId': str(team.id),
                'firstName': str(pluck(player, 'firstName')),
                'lastName': str(pluck(player, 'lastName')),
                'fullName': str(pluck(player, 'displayName')),
                'birthdate': str(player.get('dateOfBirth')),
                'city': str(pluck(player, 'birthPlace', 'city')),
                'state': str(pluck(player, 'birthPlace', 'state')),
                'height': str(pluck(player, 'height')),
                'weight': str(pluck(player, 'weight')),
                'experience': str(pluck(player, 'experience', 'years')),
                'jerseyNumber': str(pluck(player, 'jersey')),
                'position': str(pluck(player, 'position', 'displayName')),
                'rosterStatus': str(pluck(player, 'status', 'type')),
                'draftYear': str(pluck(player, 'draft', 'year')),
                'draftRound': str(pluck(player, 'draft', 'round')),
                'draftNumber': str(pluck(player, 'draft', 'selection')),
                'headshot': str(pluck(player, 'headshot', 'href')) # 600x436
            }
            players_list.append(player_info)

    da_players = pd.DataFrame(players_list)
    da_players['birthdate'] = pd.to_datetime(da_players['birthdate'], format = '%Y-%m-%dT%H:%MZ').dt.date 

    return da_players