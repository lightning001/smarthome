let width = $( window ).width();
function getQuantity(){
let  quantity, width = $( window ).width();
if(width>=1200)
	quantity = 6;
else if(quantity>=992)
	quantity = 4;
else
	quantity = 3
	return quantity;
}


$(document).ready(() => {
	let quantity= getQuantity();
	$('#carousel').children('div:nth-child(n+' + (quantity+1)+ ')').hide();
});
$('.controler-left').click(() => {
	let length = $('#length').val();
	let quantity = getQuantity();
	if (length > quantity) {
		currentIndex = parseInt($('#currentIndex').val()) - 1;
		if (currentIndex < 0){
			if(length%quantity==0)
				currentIndex = parseInt(length / quantity);
			else
				currentIndex = parseInt(length / quantity)+1;
		}
		$('#carousel').children('div:nth-child(n)').hide();
		for (var i = 0; i < quantity; i++) {
			$('#carousel').children('div:nth-child(' + (1+ currentIndex * quantity + i) + ')').show();
		}
		$('#currentIndex').val(currentIndex);
		$('.tab-content').children('div.active').removeClass('in active');
		$('.tab-content').children('div:nth-child('+(1+ currentIndex * quantity)+')').addClass('in active');
		$('#carousel').children('div.active').removeClass('active');
		$('#carousel').children('div:nth-child('+1+currentIndex*quantity+')').addClass('active');
	}
});
$('.controler-right').click(() => {
	let length = $('#length').val();
	let quantity = getQuantity();
	if (length > quantity) {
		var max = 0;
		if(length%quantity==0)
			max = parseInt(length / quantity);
		else
			max = parseInt(length / quantity)+1;
		currentIndex = parseInt($('#currentIndex').val()) + 1;
		if (currentIndex >=max)
			currentIndex = 0;
		$('#carousel').children('div:nth-child(n)').hide();
		for (var i = 0; i < quantity; i++) {
			$('#carousel').children('div:nth-child(' + (1 + currentIndex * quantity + i) + ')').show();
		}
		$('#currentIndex').val(currentIndex);
		$('.tab-content').children('div.active').removeClass('in active');
		$('.tab-content').children('div:nth-child('+(1+ currentIndex * quantity)+')').addClass('in active');
	}
});
