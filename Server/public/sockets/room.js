socket.on('server_send_delete_room', function(data){
	console.log('receive Delete room');
	if(data.success==true){
		let item = document.getElementById('room_'+data.result);
		let index = Array.from(document.getElementById('room_'+data.result).parentNode.children).indexOf(item);
		item.remove();
		document.getElementById('item_room_'+data.result).remove();
		$('#carousel').children('div:nth-child('+index+')').show();
		$('.tab-content').children('div:nth-child('+index+')').addClass('in active');
	}else{
		alert(data.message);
	}
});
socket.on('server_send_create_room', function (data){
	console.log('Receive new room');
	if(data.success == true){
		let noroom = $('#noroom');
		if(noroom!=null && noroom!=undefined){
			location.reload(true);
		}else{
			let newRoom = ejs.renderFile('./partials/item_room', {'room' : data.result});
			$('#carousel').append(newRoom);
		}
	}else{
		alert(data.message);
	}
});

socket.on('server_send_add_device_in_room', (data)=>{
	if(data.success==true){
		console.log(JSON.stringify(data));
		let listDevice = data.result;
		let id_room = data.room;
		let parent = $('#room_'+id_room);
		listDevice.forEach(device=>{
			let dv = ejs.renderFile('./partials/item_device', {'device': device});
			if(parent.children('div.row').includes('No device is used'))parent.children('div.row').includes('No device is used').empty().prop('id', 'havedevice');
			parent.children('div.row').children('#havedevice').append(dv);
			$('.modal-body').find('#md_device_'+device._id).remove();
		});
	}else{
		alert(data.message);
	}
})

socket.on('server_send_update_room', (data) => {
	if(data.success == true){
		let room = data.result;
		let innerHtml = $('#item_room_'+room._id);
		if(room.img){
			innerHtml.find('img').attr('src', room.img);
		}
		if(room.room_name){
			innerHtml.find('figcaption').val(room.room_name);
		}
	}else{
		alert(data.message);
	}
});

function deleteRoom(value, method){
	var s = '';
	if(method==0){
		s = "You are really want to delete this room?";
	}else if(method==1){
		s = "You are really want to delete this room and devices in this room?";
	}
	var r = confirm(s);
	if(r==true){
		socket.emit('client_send_delete_room', {'_id' : value, 'isDeleteDevice' : method});
	}
}


var myFile;
function changeImg(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			$('#image-preview').attr('src', evt.target.result);
			myFile = evt.target.result;
		};
		reader.readAsDataURL(input.files[0]);
	}
}

function createRoom(){
	let name = $('#room_name').val();
	let device = $("#formRoom input:checkbox:checked").map(function(){
        return $(this).val();
    }).toArray();
	let img = $('#file');
	let data = {};
	if (myFile !=null && myFile != undefined) {
		data.img = myFile;
	}
	data.room_name = name;
	data.device = device;
	socket.emit('client_send_create_room', {'data' : data});
	window.location.back();
}

function updateRoom(e){
	let data = $(e).val();
	socket.emit('client_send_update_room', data);
}