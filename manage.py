from app import app
from app import db
from app import models
from flask.ext.script import Manager
from flask.ext.script import Shell
from flask.ext.script import Server

manager=Manager(app)

def make_shell():
	return dict(app=app,db=db,message=models.Message)

manager.add_command('shell',Shell(make_context=make_shell))
manager.add_command('runserver',Server(
	use_debugger=True,
	use_reloader=True,
	host='localhost',
	port=5000
))

if __name__=='__main__':
	manager.run()
