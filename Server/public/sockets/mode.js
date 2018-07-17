let ejs = require('ejs');
socket.on('server_send_create_mode', (data) => {
	if (data.success == false) {
		alert(data.message);
	} else {
		let newMode = ejs.renderFile('./partials/item_mode', {
			'mode': data.result
		});
		$('.container').append(newMode);
	}
});

socket.on('server_send_update_mode', (data) => {
	if (data.success == false) {
		alert(data.message);
	} else {
		let mode = data.result;
		let innerHtml = document.getElementById('item_mode_' + mode._id);
		if (mode.mode_name) {
			innerHtml.find('#mode_name').val(mode.mode_name);
		}
		if (mode.status) {
			innerHtml.find('.switch input:checkbox').prop("checked", true);
		}
		if (mode.starttime) {
			innerHtml.find('#starttime').val(mode.starttime)
		}
		if (mode.stoptime) {
			innerHtml.find('#stoptime').val(mode.stoptime)

		}
		if (mode.circle) {
			for (var i = 1; i <= 7; i++) {
				if (mode.circle.indexOf(i%7) >= 0) {
					innerHtml.find('#circle').children('li:nth-child(' + i + ')').addClass('badge-warning');
				} else {
					innerHtml.find('#circle').children('li:nth-child(' + i + ')').removeClass('badge-warning');
				}

			}
		}
	}
});

socket.on('server_send_delete_mode', (data)=>{
	if(data.success==false){
		alert(data.message);
	}else{
		document.getElementById('item_mode_'+data.result).remove();
	}
});