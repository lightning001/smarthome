socket.on('server_send_control_device', (data)=>{
	if(data.success == true){
		if(data.result.status == true){
			$('#device_'+data.result.device).css('background', 'orange');
			$('#device_'+data.result.device).children('div.thumbnail').children('img').removeClass('item-off');
			$('#device_'+data.result.device).children('div.thumbnail').children('div').children('label').children('input').prop('checked', true);
		}else{
			$('#device_'+data.result.device).css('background', 'gray');
			$('#device_'+data.result.device).children('div.thumbnail').children('img').addClass('item-off');
			$('#device_'+data.result.device).children('div.thumbnail').children('div').children('label').children('input').prop('checked', false);
		}
	}else{
		alert(data.message);
	}
});

socket.on('client_send_create_device_in_room', (data)=>{
	let link = location.pathname;
	if(data.success==true){
		if(link =='/room'){
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
		}else if(link==device){
			let device= data.result;
			if(device.room){
				let newDevice = ejs.renderFile('./partials/item_device2', {'device': device});
				$('#room_'+device.room).children('div:contains("No device is used")').remove();
				$('#room_'+device.room).append(newDevice);
			}else{
				let newDevice = ejs.renderFile('./partials/item_device_noroom', {'device': device});
				$('#noroom').append(newDevice);
			}
			
		}
	}else{
		alert(data.message);
	}
});


socket.on('server_send_delete_device_in_room', (data)=>{
	if(data.success==true){
		$('#device_'+data.result).remove();
	}else{
		alert(data.message);
	}
});
socket.on('server_send_remove_device_in_room', (data)=>{
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
		let change = 
		$('.modal-body').children('div').append(change);
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
		console.log('AAA'+JSON.stringify(device));
			let pane = $('#device_' + device._id).children('div.thumbnail');
			if(device.device_name){
				console.log('AAA'+JSON.stringify(device.device_name));
				pane.children('figcaption').text(device.device_name);
				pane.children('figcaption').show();
				pane.children('input:text').value = device.device_name;
				pane.children('input:text').hide();
			}
			if(device.device){
				pane.children('img').attr('src', device.device.img);
			}
		}
	}else{
		alert(data.message);
	}
});


function control_device(value){
	if(value==undefined){
		alert('The device doesn\'t exist');
	}else{
		socket.emit('control-device', {'_id' : value});
	}
}

function delete_device(value, name){
	var r = confirm("You are really want to delete "+name+"?");
	if(r==true){
		if(value==undefined){
			alert('The device doesn\'t exist');
		}else{
			socket.emit('client_send_delete_device_in_room', value);
		}
	}
}

function remove_device(value, name){
	var r = confirm("You are really want to remove "+name+" from room?");
	if(r==true){
		socket.emit('client_send_remove_device_in_room', value);
	}
}
