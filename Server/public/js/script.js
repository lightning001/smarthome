function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('#image-preview').attr('src', e.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

function img_click(e){
		var value = $(e).children('input').val();
		$.ajax({
			url: '/device/turn-on',
			type : 'POST',
			data : {'id' : value},
			success : function(data){
				if(data.success==true){
					if(data.onvalue==false){
						$(e).children('img').addClass('item-off');
					}else if(data.onvalue==true){
						$(e).children('img').removeClass('item-off');
					}
				}else{
					 alert('Error! An error occurred. Please try again later');
				}
			},
			error: function(){
				alert('Error! An error occurred. Please try again later');
			}
		});
	}