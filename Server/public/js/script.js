function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('#image-preview').attr('src', e.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

function logout(){
	localStorage.clear();
	$.ajax({
		url : '/logout',
		method : 'GET'
	});
}

function goBack(){
	window.history.back();
}