import os
import requests
import datetime
import MySQLdb as mysql

from nba_scrapper.utils import get_db_max_gamedate, insert_data_to_mysql, nba_headers
from nba_scrapper.games import get_games
from nba_scrapper.stats import get_team_stats, get_player_stats
from nba_scrapper.teams import get_teams
from nba_scrapper.players import get_players

# Open DB Connection
connection = mysql.connect(
    host = os.environ['HOST'],
    database = os.environ['DATABASE'],
    user = os.environ['USER'],
    password = os.environ['PASSWORD'],
    ssl_mode = os.environ['SSL_MODE'],
    ssl = {
        'ca': os.environ['SSL_CERT'],
    }
)

# Params
ACTUAL_SEASON = 2023 # TODO: Get this auto
LAST_GAMEDATE_DB = get_db_max_gamedate(connection) - datetime.timedelta(days = 1)

print(f'Actual Season: {ACTUAL_SEASON}, Last Game Date in DB: {LAST_GAMEDATE_DB}')

import requests

url = 'https://stats.nba.com/stats/leagueLeaders'
headers = {
    'Accept': '*/*',
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'Connection': 'keep-alive',
    'Origin': 'https://www.nba.com',
    'Referer': 'https://www.nba.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
    'sec-ch-ua': '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"'
}

params = {
    'LeagueID': '00',
    'PerMode': 'Totals',
    'Scope': 'S',
    'Season': '2022-23',
    'SeasonType': 'Playoffs',
    'StatCategory': 'FG3_PCT'
}

response = requests.get(url, headers=headers, params=params)
data = response.json()

# Get Data
## new games (+old games with a threshold)
#da_games = get_games(season = ACTUAL_SEASON)
## updated teams info
#da_teams = get_teams(season = ACTUAL_SEASON)
## updated players info
# da_players = get_players(season = ACTUAL_SEASON) 
## updated team stats
# da_team_stats = get_team_stats(season = ACTUAL_SEASON)
## updated player stats
# da_player_stats = get_player_stats(start_date = LAST_GAMEDATE_DB, wait_time = 2)

# Update DB
## games
#insert_data_to_mysql('games', da_games, connection)
## teams
#insert_data_to_mysql('teams', da_teams, connection)
## players
# insert_data_to_mysql('players', da_players, connection)
## team stats
# insert_data_to_mysql('team_stats', da_team_stats, connection)
## player stats
# insert_data_to_mysql('player_stats', da_player_stats, connection, batch_size = 50000)

# Close DB Connection
connection.close()