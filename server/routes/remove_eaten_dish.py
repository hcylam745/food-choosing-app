import logging

from flask import request, jsonify

from routes import app

import connect

conn = connect.get_connection()

@app.route("/remove_eaten_dish", methods=['POST'])
def remove_eaten_dish():
    # input in the format of {"search": "Swiss Chicken Wings"}
    if request.method == 'POST':
        cursor = conn.cursor()
        user_input = request.json["search"]
        # handle if user input is english/chinese.
        cursor.execute('DELETE FROM foods where EN_NAME = %s', [user_input])
        cursor.execute('DELETE FROM foods_history where EN_NAME = %s', [user_input])
        cursor.close()
        return "Successfully deleted " + user_input + " from the database!"
    else:
        return "Bad Request. Please use a POST request.", 400