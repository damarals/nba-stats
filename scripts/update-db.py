import os
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

# Create Scrapper Agent Instance (Selenium)
# scrapper_agent = nba_scrapper_driver()

# Params
ACTUAL_SEASON = 2023 # TODO: Get this auto
LAST_GAMEDATE_IN_DB = get_db_max_gamedate(connection) - datetime.timedelta(days = 1)

print(f'Actual Season: {ACTUAL_SEASON}, Last Game Date in DB: {LAST_GAMEDATE_IN_DB}')

# Get Data
## new games (+old games with a threshold)
#da_games = get_games(season = ACTUAL_SEASON)
## updated teams info
da_teams = get_teams(season = ACTUAL_SEASON)
print(da_teams)
## updated players info
# da_players = get_players(season = ACTUAL_SEASON) 
## updated team stats
# da_team_stats = get_team_stats(season = ACTUAL_SEASON)
## updated player stats
# da_player_stats = get_player_stats(start_date = LAST_GAMEDATE_IN_DB, wait_time = 2)

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