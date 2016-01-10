from . import db

class Message(db.Document):
	user_name=db.StringField(required=True,max_length=100)
	user_message=db.StringField(required=True)
