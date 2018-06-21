socket.on('server_send_control_device', (data)=>{
	console.log('receive on/off device' + JSON.stringify(data));
	if(data.success == true){
		if(data.result.status == true){
			$('#device_'+data.result.device).children('div.thumbnail').children('img').removeClass('item-off');
		}else{
			$('#device_'+data.result.device).children('div.thumbnail').children('img').addClass('item-off');
		}
	}else{
		alert(data.message);
	}
});

socket.on('client_send_create_device_in_room', (data)=>{
	let link = $(location).attr('href');
	if(link.indexOf('/room')>=0){
		if(data.success==true){
			let device = data.result;
			let newDevice = ejs.renderFile('./partials/item_room', {'device' : device});
			if(device.room!=null && device.room!=undefined){
				let havent = document.getElementById('room_'+device.room).children('#nodeviceuse');
				if(havent){
					havent.remove();
					let haveDevice = document.createElement('div');
					haveDevice.setAttribute('id', 'havedevice');
					haveDevice.append(newDevice);
					document.getElementById('room_'+device.room).children('div.row').appendChild(haveDevice);
				}else{
					document.getElementById('room_'+device.room).children('#havedevice').append(newDevice);
				}

			}
		}else{
			alert(data.message);
		}
	}else if(link.indexOf('/device')>=0){
		
	}
});


socket.on('server_send_delete_device_in_room', (data)=>{
	if(data.success==true){
		$('#device_'+data.result).remove();
	}else{
		alert(data.message);
	}
});

socket.on('server_send_remove_device_from_room', data=>{
	if(data.success == true){
		let html = $('#device_'+data.result);
		$('#listNoRoom').append(html);
		$('#device_'+data.result).remove();
	}else{
		alert(data.message);
	}
});

socket.on('server_send_update_device_in_room', (data)=>{
	if(data.success == true){
		let device = data.result;
		if(device.room){
			location.reload(true);
		}else{
			let pane = $('#device_' + device._id).children('div.thumbnail');
			if(device.device_name){
				pane.children('figcaption').text = device.device_name;
				pane.children('input:text').value = device.device_name;
			}
			if(device.device){
				pane.children('img').attr('src', device.device.img);
			}
		}
	}else{
		alert(data.message);
	}
});


function control_device(e){
	var value = $(e).parent().children('input:hidden').val();
	if(value==undefined){
		alert('The device doesn\'t exist');
	}else{
		socket.emit('control-device', {'_id' : value});
	}
}

function delete_device(e){
	var value = $(e).parent().children('input:hidden').val();
	if(value==undefined){
		alert('The device doesn\'t exist');
	}else{
		socket.emit('client_send_delete_device_in_room', {'_id' : value});
	}
}

function remove_device(e){
	var value = $(e).parent().children('input:hidden').val();
	if(value==undefined){
		alert('The device doesn\'t exist');
	}else{
		socket.emit('client_send_remove_device_from_room', {'_id' : value});
	}
}
