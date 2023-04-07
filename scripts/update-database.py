import pandas as pd
import pyarrow.parquet as pq
import os
import mysql.connector
from mysql.connector import errorcode

# Configurações do banco de dados
config = {
  'user': os.getenv('MYSQL_USER'),
  'password': os.getenv('MYSQL_PASSWORD'),
  'host': os.getenv('MYSQL_HOST'),
  'database': os.getenv('MYSQL_DATABASE'),
}

# Função para fazer o upsert no banco de dados
def upsert(df, table_name):
    try:
        # Conexão com o banco de dados
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()

        # Colunas do dataframe
        columns = list(df.columns)

        # Lista de placeholders para os valores
        values_placeholders = ', '.join(['%s'] * len(columns))

        # Comando SQL para o upsert
        upsert_query = f'''
        INSERT INTO {table_name} ({', '.join(columns)})
        VALUES ({values_placeholders})
        ON DUPLICATE KEY UPDATE {', '.join([f"{col} = VALUES({col})" for col in columns])}
        '''

        # Executa o upsert para cada linha do dataframe
        for index, row in df.iterrows():
            cursor.execute(upsert_query, tuple(row))

        cnx.commit()

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Erro: acesso negado")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Erro: banco de dados não existe")
        else:
            print(err)
    else:
        cnx.close()

# Loop para ler os arquivos parquet
for year in range(2023):
    filename = f'https://raw.githubusercontent.com/sportsdataverse/hoopR-nba-data/main/nba/pbp/parquet/play_by_play_{year}.parquet'
    table_name = f'nba_pbp_{year}'

    # Lê o arquivo parquet e cria o dataframe
    table = pq.read_table(filename).to_pandas()

    # Cria uma coluna 'season' com o ano
    table['season'] = year

    # Faz o upsert no banco de dados
    upsert(table, table_name)
