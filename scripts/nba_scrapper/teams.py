import requests
import pandas as pd
from nba_scrapper.utils import nba_headers

def get_teams(season: int) -> pd.DataFrame:
    """
    Collects information about NBA teams in a specific season.

    Parameters:
    -----------
      - season (int): Year of the desired season.

    Returns:
    --------
      - da_teams (pd.DataFrame): Dataframe with information about 
        the season's teams. Each row represents a team and each column 
        represents a team detail, such as the team ID, name, city, logo, 
        conference, and division.
    """
    season_str = f'{season-1}-{season-2000}'

    url = f'https://stats.nba.com/stats/leaguestandingsv3?LeagueID=00&Season={season_str}&SeasonType=Regular%20Season'
    response = requests.get(url, headers = nba_headers)
    json_data = response.json()
    da_teams = pd.DataFrame(json_data['resultSets'][0]['rowSet'], columns = json_data['resultSets'][0]['headers'])
    da_teams = da_teams.assign(
        id = lambda x: x['TeamID'],
        city = lambda x: x['TeamCity'],
        name = lambda x: x['TeamName'],
        nameFull = lambda x: x['TeamCity'] + ' ' + x['TeamName'],
        slug = lambda x: x['TeamSlug'],
        season = lambda x: season_str,
        conference = lambda x: x['Conference'],
        division = lambda x: x['Division'],
        logo = lambda x: x['TeamID'].apply(lambda id: f"https://cdn.nba.com/logos/nba/{id}/primary/L/logo.svg")
    )
    da_teams = da_teams[['id', 'city', 'name', 'nameFull', 'slug', 
                         'season', 'conference', 'division', 'logo']]
    
    return da_teams