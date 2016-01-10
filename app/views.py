from main import main_blueprint as main
from flask.views import MethodView
from flask import request
from flask import render_template
from flask import json
from .models import Message
import time

class IndexView(MethodView):
	methods=['GET']
	
	def get(self):
		return render_template('main/index.html')
	
class MessageView(MethodView):
	methods=['GET','POST','PUT','DELETE']

	def get(self):
		messages=Message.objects
		
		response_body={}
		
		if messages:
			for message in messages:
				response_body.setdefault("messages",[]).append(message.to_json())
		
		response_headers=[('Content-Type','application/json'),('Content-Length',len(response_body))]
	
		status_code=200
		
		response_body=json.dumps(response_body)
		
		response=(response_body,status_code,response_headers)
		
		return response
		
	def post(self):	
		request_body=request.get_json()
		
		response_body={}
	
		message=Message(user_name=request_body['user_name'],user_message=request_body['user_message'])
	
		message.save()
	
		response_body=message.to_json()
	
		response_headers=[('Content-Type','application/json'),('Content-Length',len(response_body))]
	
		status_code=200
	
		response=(response_body,status_code,response_headers)
		
		time.sleep(3);
		
		return response
		
	def put(self):
		request_body=request.get_json()
		
		response_body={}
	
		message=Message.objects.get(id=request_body['id'])
	
		if message:
			message.user_name=request_body['user_name']
			message.user_message=request_body['user_message']
			message.save()
	
			response_body=message.to_json()
	
			response_headers=[('Content-Type','application/json'),('Content-Length',len(response_body))]
	
			status_code=200
	
			response=(response_body,status_code,response_headers)
		
		else:
			response_body=json.dumps({
				"error":"invalid message"
			})
	
			response_headers=[('Content-Type','application/json'),('Content-Length',len(response_body))]
	
			status_code=404
	
			response=(response_body,status_code,response_headers)
		
		return response
			
	def delete(self):
		request_body=request.get_json()
		
		response_body={}
	
		message=Message.objects.get(id=request_body['id'])
	
		if message:
			message.delete()
	
			response_body=json.dumps({
				"status":"success"
			})
	
			response_headers=[('Content-Type','application/json'),('Content-Length',len(response_body))]
	
			status_code=200
	
			response=(response_body,status_code,response_headers)
		
		else:
			response_body=json.dumps({
				"error":"invalid message"
			})
	
			response_headers=[('Content-Type','application/json'),('Content-Length',len(response_body))]
	
			status_code=404
	
			response=(response_body,status_code,response_headers)
		
		return response
		
main.add_url_rule('/',view_func=IndexView.as_view('index_view'))		
main.add_url_rule('/message',view_func=MessageView.as_view('message_view'))
