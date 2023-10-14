from configs import Config

import psycopg2

def get_connection():
    conn = psycopg2.connect(host=Config.PostgreSQL_HOST,
                            database=Config.PostgreSQL_DATABASE,
                            user=Config.PostgreSQL_USER,
                            password=Config.PostgreSQL_PASSWORD)

    conn.autocommit = True

    return conn