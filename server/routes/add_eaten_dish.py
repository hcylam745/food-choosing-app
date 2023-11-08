import logging

from flask import request, jsonify

from routes import app

import connect

import datetime

conn = connect.get_connection()

@app.route("/add_eaten_dish", methods=['POST'])
def add_eaten_dish():
    # input in the format of {"english":"Swiss Chicken Wings", "chinese": }
    if request.method == 'POST':
        cursor = conn.cursor()
        english_input = request.json["english"]
        chinese_input = request.json["chinese"]
        # handle if user input is english/chinese.
        cursor.execute('SELECT * FROM foods WHERE EN_NAME = %s OR CH_NAME = %s', [english_input, chinese_input])
        result = cursor.fetchall()
        curr_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if not result:
            # searched name not found in db, make a new one.
            cursor.execute('INSERT INTO foods (EN_NAME, CH_NAME, MOST_RECENT_DATE) VALUES (%s, %s, %s)', [english_input, chinese_input,curr_time])
            cursor.close()
            return "Successfully added " + english_input + " and " + chinese_input + " into the database!"
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
            cursor.close()
            return "Updated the entry " + english_input + chinese_input
    else:
        return "Bad Request. Please use a POST request.", 400