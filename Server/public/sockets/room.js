var socket = io();
socket.emit('join-room', $.cookie('token'));

socket.on('server_send_delete_room', function(data){
	if(data.success==true){
		$('#'+data.result).remove();
	}else{
		alert(data.message);
	}
});

socket.on('server_send_create_room', function(data){
	if(data.success == true){
		$('#pane_Room').append('<div class="col-md-3 col-xs-6 col-sm-6" id='+data.result._id+'><div class="thumbnail"><a href="/room/"'+data.result._id+'><input type="hidden" value='+data.result._id+'><img src='+data.result.img+' alt="room"  style="min-height:17vw" class="img-room img"><div class="caption row"><font class="col-xs-10" style="font-size:17px;">'+data.result.room_name+'</font><div class="col-xs-1"><div class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-ellipsis-v text-center col-xs-1" ></i></a><ul class="dropdown-menu"><li><a> Update room </a></li><li><a onclick="deleteRoom(this, 0)">Delete room</a><input type="hidden" value='+data.result._id+' name="id"></li><li><a onclick="deleteRoom(this, 1)">Delete room and device<a><input type="hidden" value="'+data.result._id+'"></li></ul></div></div></div></a></div></div>');
	}else{
		alert(data.message);
	}
});

socket.on('server_send_update_room', function(data){
	if(data.success == true){
		$(data.result._id).append('<div class="col-md-3 col-xs-6 col-sm-6" id='+data.result._id+'><div class="thumbnail"><a href="/room/"'+data.result._id+'><input type="hidden" value='+data.result._id+'><img src='+data.result.img+' alt="room"  style="min-height:17vw" class="img-room img"><div class="caption row"><font class="col-xs-10" style="font-size:17px;">'+data.result.room_name+'</font><div class="col-xs-1"><div class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-ellipsis-v text-center col-xs-1" ></i></a><ul class="dropdown-menu"><li><a> Update room </a></li><li><a onclick="deleteRoom(this, 0)">Delete room</a><input type="hidden" value='+data.result._id+' name="id"></li><li><a onclick="deleteRoom(this, 1)">Delete room and device<input type="hidden" value="'+data.result._id+'"></a></li></ul></div></div></div></a></div></div>');
	}else{
		alert(data.message);
	}
});

function deleteRoom(e, method){
	var token = $.cookie('token');
	console.log('token: '+token);
	var value = $(e).parent().children('input').val();
	console.log('input: '+value);
	console.log('document cookie'+document.cookie);
	socket.emit('client_send_delete_room', {'token': token, 'data' : {'id' : value, 'isDeleteDevice' : method}});
}