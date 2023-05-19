import requests
import pandas as pd

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
    url = 'https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings'
    params = {'region': 'br', 'lang': 'pt', 'level': 3}
    response = requests.get(url, params = params)
    json_data = response.json()

    teams_list = []
    for conference in json_data['children']:
        for division in conference['children']:
            for team in division['standings']['entries']:
                team_info = {
                    'id': str(team['team']['id']),
                    'city': str(team['team']['location']),
                    'name': str(team['team']['name']),
                    'nameFull': str(team['team']['displayName']),
                    'abbreviation': str(team['team']['abbreviation']),
                    'season': str(season),
                    'conference': conference['name'].split(" ")[1],
                    'division': str(division['name']),
                    'logo': str(team['team']['logos'][0]['href']), # 500x500
                }
                teams_list.append(team_info)

    da_teams = pd.DataFrame(teams_list)
    
    return da_teams