from flask import jsonify, request, Flask
from configs import Config
from flask_mysqldb import MySQL
from flask_cors import CORS

import datetime

app = Flask(__name__)

cors = CORS(app)

app.config['MYSQL_HOST'] = Config.MYSQL_HOST
app.config['MYSQL_USER'] = Config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = Config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = Config.MYSQL_DB

mysql = MySQL(app)

@app.route("/existing_dishes", methods=['GET'])
def existing_dishes():
    if request.method == 'GET':
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM foods;')
        result = cursor.fetchall()
        cursor.close()
        res = jsonify(result)
        return res
    else:
        return "Bad Request. Please use a GET request.", 400

@app.route("/add_eaten_dish", methods=['POST'])
def add_eaten_dish():
    # input in the format of {"search":"Swiss Chicken Wings"}
    if request.method == 'POST':
        cursor = mysql.connection.cursor()
        user_input = request.json["search"]
        # handle if user input is english/chinese.
        cursor.execute('SELECT * FROM foods WHERE EN_NAME = %s', [user_input])
        result = cursor.fetchall()
        curr_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if not result:
            # searched name not found in db, make a new one.
            cursor.execute('INSERT INTO foods (EN_NAME, MOST_RECENT_DATE) VALUES (%s, %s)', [user_input,curr_time])
            mysql.connection.commit()
            cursor.close()
            return "Successfully added " + user_input + " into the database!"
        else:
            # add to history, just so user can do undos.
            cursor.execute('SELECT * FROM foods_history WHERE EN_NAME = %s ORDER BY MOST_RECENT_Date ASC', [user_input])
            history_result = cursor.fetchall()
            if len(history_result) >= 5:
                cursor.execute("UPDATE foods_history SET MOST_RECENT_DATE = (%s) WHERE id = %s AND MOST_RECENT_DATE = %s", [result[0][3], history_result[0][2],history_result[0][3]])
            else:
                cursor.execute('INSERT INTO foods_history (EN_NAME, CH_NAME, id, MOST_RECENT_DATE) VALUES (%s, %s, %s, %s)', [result[0][0], result[0][1], result[0][2], result[0][3]])

            # searched name found in db, update the most recent eaten time.
            cursor.execute('UPDATE foods SET MOST_RECENT_DATE = (%s) WHERE id = %s', [curr_time, result[0][2]])
            mysql.connection.commit()
            cursor.close()
            return "Updated the entry " + user_input
    else:
        return "Bad Request. Please use a POST request.", 400

@app.route("/remove_eaten_dish", methods=['POST'])
def remove_eaten_dish():
    # input in the format of {"search": "Swiss Chicken Wings"}
    if request.method == 'POST':
        cursor = mysql.connection.cursor()
        user_input = request.json["search"]
        # handle if user input is english/chinese.
        cursor.execute('DELETE FROM foods where EN_NAME = %s', [user_input])
        cursor.execute('DELETE FROM foods_history where EN_NAME = %s', [user_input])
        mysql.connection.commit()
        cursor.close()
        return "Successfully deleted " + user_input + " from the database!"
    else:
        return "Bad Request. Please use a POST request.", 400

@app.route("/get_recommended_dishes", methods=['GET'])
def get_recommended_dishes():
    if request.method == 'GET':
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT EN_NAME,CH_NAME,MOST_RECENT_DATE FROM foods ORDER BY MOST_RECENT_DATE ASC')
        result = cursor.fetchall()
        cursor.close()
        res = jsonify(result)
        return res
    else:
        return "Bad Request. Please use a GET request.", 400

