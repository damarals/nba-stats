import requests
import pandas as pd
import time
from nba_scrapper.utils import nba_headers, convert_height, convert_weight

def __get_player_info_from_id(player_id: str) -> pd.DataFrame:
    """
    Retrieves basic information about a player from the NBA Stats API and returns it as a pandas DataFrame.

    Args:
      - player_id: A string representing the player's ID (e.g. "1628369").

    Returns:
      - da_player_info (pd.Dataframe): DataFrame containing the player's basic information, 
        with columns for ID, team ID, first name, full name, slug, birthdate, and others infos.
    """
    url = f'https://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID={player_id}'
    response = requests.get(url, headers = nba_headers)
    json_data = response.json()
    da_player_info = pd.DataFrame(json_data['resultSets'][0]['rowSet'], columns = json_data['resultSets'][0]['headers'])
    da_player_info = da_player_info.assign(
        id = lambda x: x['PERSON_ID'].astype('str'),
        teamId = lambda x: x['TEAM_ID'].astype('str'),
        firstName = lambda x: x['FIRST_NAME'].astype('str'),
        lastName = lambda x: x['LAST_NAME'].astype('str'),
        fullName = lambda x: x['DISPLAY_FIRST_LAST'].astype('str'),
        slug = lambda x: x['PLAYER_SLUG'].astype('str'),
        birthdate = lambda x: pd.to_datetime(x['BIRTHDATE'], format = '%Y/%m/%d %H:%M:%S').dt.date,
        college = lambda x: x['SCHOOL'].astype('str'),
        country = lambda x: x['COUNTRY'].astype('str'),
        height = lambda x: x['HEIGHT'].apply(lambda h: convert_height(h)).astype("Float64"),
        weight = lambda x: x['WEIGHT'].apply(lambda w: convert_weight(w)).astype("Float64"),
        experience = lambda x: x['SEASON_EXP'].astype("Int64"),
        jerseyNumber = lambda x: x['JERSEY'].astype('str'),
        position = lambda x: x['POSITION'].astype('str'),
        rosterStatus = lambda x: x['ROSTERSTATUS'].astype('str'),
        draftYear = lambda x: x['DRAFT_YEAR'].apply(lambda y: y if y != 'Undrafted' else pd.NA).astype("Int64"),
        draftRound = lambda x: x['DRAFT_ROUND'].apply(lambda r: r if r != 'Undrafted' else pd.NA).astype("Int64"),
        draftNumber = lambda x: x['DRAFT_NUMBER'].apply(lambda n: n if n != 'Undrafted' else pd.NA).astype("Int64"),
        headshot = lambda x: x['PERSON_ID'].apply(lambda p_id: f'https://cdn.nba.com/headshots/nba/latest/1040x760/{p_id}.png')
    )
    da_player_info = da_player_info[['id', 'teamId', 'firstName', 'lastName', 'fullName', 'slug', 
                                     'birthdate', 'college', 'country', 'height', 'weight', 
                                     'experience', 'jerseyNumber', 'position', 'rosterStatus', 
                                     'draftYear', 'draftRound', 'draftNumber', 'headshot']]

    return da_player_info

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
    season_str = f'{season-1}-{season-2000}'

    url = f'https://stats.nba.com/stats/playerindex?Historical=0&LeagueID=00&Season={season_str}&SeasonType=Regular%20Season'
    response = requests.get(url, headers = nba_headers)
    json_data = response.json()
    da_players_id = pd.DataFrame(json_data['resultSets'][0]['rowSet'], columns = json_data['resultSets'][0]['headers'])
    da_players_id = da_players_id['PERSON_ID']

    da_players = pd.DataFrame()
    for i, player_id in enumerate(da_players_id):
        start_time = time.time()

        da_player_info = __get_player_info_from_id(player_id)
        da_players = pd.concat([da_players, da_player_info], ignore_index = True)

        elapsed_time = time.time() - start_time
        print(f'[{i+1}/{len(da_players_id)} {elapsed_time:.0f}s] Player ID: {player_id}')
        
        time.sleep(1)

    return da_players