import datetime
import pandas as pd
import time

nba_headers = {
    'Host': 'stats.nba.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.48',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'x-nba-stats-origin': 'stats',
    'x-nba-stats-token': 'true',
    'Connection': 'keep-alive',
    'Origin': 'http://stats.nba.com',
    'Referer': 'https://www.nba.com/',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache'
}

def convert_height(height: str) -> float:
    """
    Converts a player's height from feet and inches to meters.

    Parameters:
      - height (str): A string representing the height in feet and inches (e.g. "6-7").

    Returns:
      - meters (float): The equivalent height in meters as a float, rounded to 2 decimal places.
    """
    feet, inches = height.split("-")
    meters = round((float(feet) * 0.3048) + (float(inches) * 0.0254), 2)
    return meters


def convert_weight(weight: str) -> float:
    """
    Converts a player's weight from pounds to kilograms.

    Parameters:
      - weight (str): A string representing the weight in pounds (e.g. "215").

    Returns:
      - weight_kg_rounded (float): The equivalent weight in kilograms as a float, 
        rounded to 2 decimal places.
    """
    weight_kg = float(weight) / 2.2046
    weight_kg_rounded = round(weight_kg, 2)
    return weight_kg_rounded

def convert_minutes(minute_str) -> float:
    """
    Converts a string representing minutes and seconds in a basketball game 
    to a floating-point value representing total minutes played.

    Parameters:
      - minute_str (str): String representing the number of minutes and seconds
        played in a basketball game in the format "MM:SS".

    Returns:
      - minute_float (float): Floating-point value representing the total 
        number of minutes played.
    """
    minute_int, second_int = map(int, minute_str.split(':'))
    return minute_int + (second_int / 60)

def generate_insert_query(table_name, df, primary_keys = None, overwrite = False) -> str:
    """
    Generates a SQL insertion query to insert data from a pandas DataFrame into a MySQL table.

    Parameters:
      - table_name (str): a string with the name of the MySQL table where the data will be inserted.
      - df (pandas.DataFrame): a pandas DataFrame containing the data to be inserted.
      - primary_keys (str or list of str): a string or list of strings containing the name(s) of the primary key(s) of the table.
      - overwrite (bool): a boolean indicating whether to overwrite rows with the same primary key (default: False).

    Returns:
      - insert_query (str): A string containing the SQL insertion query corresponding to the DataFrame data.
    """
    # Obtém a lista de colunas do DataFrame
    columns = df.columns.tolist()

    # Gera a string com a lista de colunas
    columns_string = ", ".join(columns)

    # Gera a string com a lista de placeholders
    placeholders = ", ".join(["%s"] * len(columns))

    # Cria a query de inserção
    if overwrite and primary_keys:
        update_columns = ", ".join([f"{col} = VALUES({col})" for col in columns if col not in primary_keys])
        insert_query = f"""
            INSERT INTO {table_name} 
            ({columns_string})
            VALUES ({placeholders})
            ON DUPLICATE KEY UPDATE {update_columns}
        """
    else:
        insert_query = f"""
            INSERT IGNORE INTO {table_name} 
            ({columns_string})
            VALUES ({placeholders})
        """

    return insert_query

def insert_data_to_mysql(table_name, df, cnx, batch_size = 10000, sleep_time = 30) -> None:
    """
    Inserts data from a pandas DataFrame into a MySQL table in batches.

    Parameters:
      - table_name (str): Name of the MySQL table where the data will be inserted.
      - df (pandas.DataFrame): DataFrame containing the data to be inserted.
      - cnx (mysql.connector.connect): MySQL connection object.
      - batch_size (int, optional): Batch size for insertion (default: 10000).
      - sleep_time (float, optional): Waiting time in seconds between each batch (default: 30).

    Returns:
      - None
    """
    cursor = cnx.cursor()

    if table_name == 'games':
        insert_query = generate_insert_query(table_name, df, primary_keys = ['id'])
    elif table_name == 'teams':
        insert_query = generate_insert_query(table_name, df, primary_keys = ['id'], overwrite = True)
    elif table_name == 'team_stats':
        insert_query = generate_insert_query(table_name, df, primary_keys = ['teamId'], overwrite = True)
    elif table_name == 'players':
        insert_query = generate_insert_query(table_name, df, primary_keys = ['id'], overwrite = True)
    elif table_name == 'player_stats':
        insert_query = generate_insert_query(table_name, df, primary_keys = ['gameId', 'teamId', 'playerId', 'period', 'statName'])

    iters = range(0, len(df), batch_size)
    for i in iters:
        batch = df.iloc[i:i+batch_size].to_numpy().tolist()
        batch = [[None if pd.isna(val) else val for val in row] for row in batch]

        start_time = time.time()
        cursor.executemany(insert_query, batch)
        cnx.commit()
        print(f"Inseridas {i+batch_size}/{len(df)} linhas em {time.time() - start_time:.2f} segundos")
        time.sleep(sleep_time)

def get_db_max_gamedate(cnx):
    """
    Retrieves the maximum date present in the 'date' column of the 'games' table of the database.

    Parameters:
      - cnx (mysql.connector.connect): MySQL connection object.

    Returns:
      - max_date (datetime.date): The maximum date present in the 'date' column of the 'games' table.
    """
    cursor = cnx.cursor()
    cursor.execute("SELECT MAX(date) FROM games")
    max_date = cursor.fetchone()[0].date()
    
    return max_date