import logging

from flask import request, jsonify

from routes import app

import connect

conn = connect.get_connection()

@app.route("/existing_dishes", methods=['GET'])
def existing_dishes():
    if request.method == 'GET':
        cursor = conn.cursor()
        logging.info("Trying to get all dishes in system.")
        cursor.execute('SELECT * FROM foods;')
        result = cursor.fetchall()
        cursor.close()
        res = jsonify(result)
        return res
    else:
        return "Bad Request. Please use a GET request.", 400