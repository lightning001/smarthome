var DateOperation = new Object();

/**
d1: (Date) ngày thứ 1
d2: (Date/Long/Int) thời gian cần cộng thêm
return : (Date) ngày sau khi cộng
*/
DateOperation.add = (d1, d2)=>{
	if(typeof d1.getTime() == 'number'){
		if(d2 == 'number'){
			return new Date(d1.getTime() + d2);
		}else if(typeof d2.getTime() == 'number'){
			return new Date(d1.getTime() + d2.getTime());
		}
	}
	return null;
}

/**
d1: (Date) ngày thứ 1
d2: (Date/Long/Int) thời gian cần trừ
return : (milisecond) số mili giây sau khi trừ
*/
DateOperation.subtract = (d1, d2)=>{
	if(typeof d1.getTime() == 'number'){
		if(typeof d2 == 'number'){
			return d1.getTime() - d2;
		}else if(typeof d2.getTime() == 'number'){
			return d1.getTime() - d2.getTime();
		}
	}
	return 0;
}
/**
date : (Date) thời gian cần set
offsetTime : (Number) milisecond cần thêm
*/
DateOperation.create = (date, offsetTime)=>{
	return date.setTime(date.getTime() + offsetTime);
}

module.exports = exports = DateOperation;