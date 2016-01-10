$(document).ready(function(){

	var user_name=$("#user_name");
	var user_message=$("#user_message");
	var edit_user_name=$("#edit_user_name");
	var edit_user_message=$("#edit_user_message");
	var post_button=$("#postButton");
	var post_icon=$("#postIcon");	
	var message_list=$("#messageList");
	var no_message=$("#noMessage");
	var message_list_block=$("#messageListBlock");
	var loading_message_block=$("#loadingMessageBlock");
	var edit_message_model=$("#editModal");
	var delete_message_model=$("#deleteModal");
	var edit_message_form=$("#editMessageForm");
	var update_button=$("#updateButton");
	var delete_button=$("#deleteButton");	
	var	master_list=[];
	var current_message=null;

	loading_message_block.css('display','block');
	
	setTimeout(function(){
		retrieveMessages();
	},2500);
	
	function retrieveMessages(){
		var promise=$.ajax({
			method:"get",
			url:"message",
			responseType:"json",
		});
		
		promise.then(function(data,textStatus,jqXhr){
			loading_message_block.css('display','none');
			
			if(data && data['messages'] && data['messages'].length>0){
				message_list_block.css('display','block');
				
				data['messages'].forEach(function(msg){
					
					msg=JSON.parse(msg);
					
					master_list.push(msg);
				
					addToList(msg,'retrieve');
				});
			}
			else{
				no_message.css('display','block');
			}
		},function(jqXhr,textStatus,error){
			console.log(error);
		});	
	}
	
	function addToList(msg,mode){
	
		var tr=document.createElement('tr');
		var td1=document.createElement('td');
		var td2=document.createElement('td');
		var td3=document.createElement('td');		
		var n=document.createTextNode(msg['user_name']);
		var m=document.createTextNode(msg['user_message']);
		var a_edit=document.createElement('a');
		var a_delete=document.createElement('a');
		var a_edit_text=document.createTextNode("Edit");
		var a_delete_text=document.createTextNode("Delete");
		
		$(a_edit).append(a_edit_text);
		$(a_delete).append(a_delete_text);
		
		$(a_edit).attr('href','#');
		$(a_delete).attr('href','#');
				
		$(a_edit).attr('id',msg['_id']['$oid']);
		$(a_delete).attr('id',msg['_id']['$oid']);
		
		$(a_edit).click(function(e){
			e.preventDefault();
			
			populateEditForm($(this));
			
			edit_message_model.modal('show');
		});
		
		$(a_delete).click(function(e){
			e.preventDefault();
			
			populateDeleteForm($(this));
			
			delete_message_model.modal('show');
		});

		$(td1).append(n);
		$(td2).append(m);
		
		$(td1).attr('id',"name_"+msg['_id']['$oid']);
		$(td2).attr('id',"message_"+msg['_id']['$oid']);
		
		$(td3).append(a_edit).append(" | ").append(a_delete);
		$(tr).append(td1).append(td2).append(td3);

		if(mode=='add')
		{
			$(tr).css('display','none');
		}
		
		message_list.append(tr);
		
		if(mode=='add'){
			$('tr:hidden:first').fadeIn(700,'linear');
		}
	}
	
	function populateEditForm(element){
		var id=element.attr('id');
		
		for(var i=0;i<master_list.length;i++){
			var msg=master_list[i];
		
			if(msg['_id']['$oid']==id){
				edit_message_form.find('#edit_user_name').val(msg['user_name']);
				edit_message_form.find('#edit_user_message').val(msg['user_message']);
				
				current_message=msg;
				break;
			}
		}
	}
	
	function populateDeleteForm(element){
		var id=element.attr('id');
		
		for(var i=0;i<master_list.length;i++){
			var msg=master_list[i];
		
			if(msg['_id']['$oid']==id){
				current_message=msg;
				break;
			}
		}
	}
	
	function addNewMessage(){
		post_icon.text('Posting...');
		post_icon.css('disabled',true);
		post_icon.attr('disabled',true);
		
		var data={
			user_name:user_name.val(),
			user_message:user_message.val()
		};
		
		var promise=$.ajax({
			method:"post",
			url:"message",
			data:JSON.stringify(data),
			responseType:"json",
			contentType:"application/json"
		});
		
		promise.then(function(data,textStatus,jqXhr){
			no_message.css('display','none');
			message_list_block.css('display','block');
			post_icon.text('Post');
			post_icon.css('disabled',false);
			post_icon.attr('disabled',false);
			
			user_name.val('');
			user_message.val('');
			
			master_list.push(data);
			addToList(data,'add');
		},function(jqXhr,textStatus,error){
			console.log(error);
		});	
	}
	
	function updateMessage(){
		update_button.text('Updating...');
		update_button.css('disabled',true);
		update_button.attr('disabled',true);
	
		var data={
			id:current_message['_id']['$oid'],
			user_name:edit_user_name.val(),
			user_message:edit_user_message.val()
		};
		
		var promise=$.ajax({
			method:"put",
			url:"message",
			data:JSON.stringify(data),
			responseType:"json",
			contentType:"application/json"
		});
		
		promise.then(function(data,textStatus,jqXhr){
			for(var i=0;i<master_list.length;i++){
				var msg=master_list[i];
		
				if(msg==current_message){
					msg['user_name']=data['user_name'];
					msg['user_message']=data['user_message'];
					
					$("#name_"+msg['_id']['$oid']).text(msg['user_name']);
					$("#message_"+msg['_id']['$oid']).text(msg['user_message']);					
					
					break;
				}
			}	
			
			update_button.text('Update');
			update_button.css('disabled',false);
			update_button.attr('disabled',false);
			
			edit_message_model.modal('hide');
			current_message=null;
		},function(jqXhr,textStatus,error){
			console.log(error);
		});	
	}
	
	function deleteMessage(){
		delete_button.text('Deleting...');
		delete_button.css('disabled',true);
		delete_button.attr('disabled',true);
	
		var data={
			"id":current_message['_id']['$oid']
		}
		
		var promise=$.ajax({
			method:"delete",
			url:"message",
			data:JSON.stringify(data),
			responseType:"json",
			contentType:"application/json"
		});
		
		promise.then(function(data,textStatus,jqXhr){
			for(var i=0;i<master_list.length;i++){
				var msg=master_list[i];
		
				if(msg==current_message){
					master_list.splice(i,1);
					
					$("a#"+msg['_id']['$oid']).parentsUntil('#messageList').fadeOut(700,'linear').remove();
					
					break;
				}
			}
			
			if(master_list.length<1){
				no_message.css('display','block');
				message_list_block.css('display','none');
			}
			
			delete_button.text('Delete');
			delete_button.css('disabled',false);
			delete_button.attr('disabled',false);
			
			delete_message_model.modal('hide');
			
			current_message=null;			
		},function(jqXhr,textStatus,error){
			console.log(error);
		});
	}
	
	update_button.click(function(event){
		event.preventDefault();
		
		updateMessage();
	});
	
	delete_button.click(function(event){
		event.preventDefault();
		
		deleteMessage();
	});
	
	$("#postMessageForm").submit(function(event){
		event.preventDefault();
		
		addNewMessage();
	});
});
