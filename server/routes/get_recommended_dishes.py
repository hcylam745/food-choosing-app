import logging

from flask import request, jsonify

from routes import app

import connect

conn = connect.get_connection()

@app.route("/get_recommended_dishes", methods=['GET'])
def get_recommended_dishes():
    if request.method == 'GET':
        cursor = conn.cursor()
        cursor.execute('SELECT EN_NAME,CH_NAME,MOST_RECENT_DATE FROM foods ORDER BY MOST_RECENT_DATE ASC')
        result = cursor.fetchall()
        cursor.close()
        res = jsonify(result)
        logging.info("Returning {}".format(res.data))
        return res
    else:
        return "Bad Request. Please use a GET request.", 400