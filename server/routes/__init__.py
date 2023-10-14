from flask import Flask

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

import routes.existing_dishes
import routes.add_eaten_dish
import routes.remove_eaten_dish
import routes.get_recommended_dishes