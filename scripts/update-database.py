import requests
import pandas as pd
import MySQLdb as mysql

# Define a função para fazer o download do arquivo parquet
def download_parquet_file(url, file_name):
    response = requests.get(url)
    with open(file_name, "wb") as f:
        f.write(response.content)

def generate_insert_query(table_name, df):
    # Obtém a lista de colunas do DataFrame
    columns = df.columns.tolist()
    
    # Gera a string com a lista de colunas
    columns_string = ", ".join(columns)
    
    # Gera a string com a lista de placeholders
    placeholders = ", ".join(["%s"] * len(columns))
    
    # Cria a query de inserção
    insert_query = f"""
        INSERT IGNORE INTO {table_name} 
        ({columns_string})
        VALUES ({placeholders})
    """
    
    return insert_query

# Define a URL do arquivo parquet e o nome do arquivo para salvar localmente
url = 'https://github.com/sportsdataverse/hoopR-nba-data/raw/main/nba/pbp/parquet/play_by_play_2023.parquet'
file_name = 'play_by_play_2023.parquet'

# Faz o download do arquivo parquet
download_parquet_file(url, file_name)

# Carrega o arquivo parquet em um DataFrame do Pandas
da_pbp = pd.read_parquet('play_by_play_2023.parquet')

# Conecta ao banco de dados MySQL
connection = mysql.connect(
    host='aws.connect.psdb.cloud',
    user='httyr16ehwwohhx2rvog',
    passwd='pscale_pw_W5dm3tRrspyCwxXrCoiH22ta2MwLHhufyWdRIEOkX6e',
    db='nba-stats',
    ssl_mode="VERIFY_IDENTITY",
    ssl={
        'ca': '/etc/ssl/certs/ca-certificates.crt'
    }
)

# Cria a query de inserção
insert_query = generate_insert_query("nba-stats.nba_pbp", da_pbp)

# Cria um cursor para executar comandos SQL
cursor = connection.cursor()

# Itera sobre as linhas do DataFrame, inserindo no banco de dados
for row in da_pbp.itertuples(index=False):
    # Executa a query de inserção para a linha atual
    cursor.execute(insert_query, row)

# Faz o commit das alterações no banco de dados
connection.commit()

# Fecha a conexão
connection.close()
