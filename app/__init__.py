from flask import Flask
from flask.ext.mongoengine import MongoEngine

app=Flask(__name__)
app.config.from_pyfile('config.py')

db=MongoEngine(app)

def register_blueprints(app):
	from main import main_blueprint
	
	app.register_blueprint(main_blueprint,url_prefix='/main')
	
register_blueprints(app)

if __name__=='__main__':
	app.run()
