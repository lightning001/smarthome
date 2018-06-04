var nodemailer = require('nodemailer');
let http = require('http');
const config = require('../util/config');
//var transporter = nodemailer.createTransport({
//	service: 'gmail',
//	pool: true,
//	host: 'smtp.gmail.com',
//	port: 587,
//	secure: false, // secure:true use TLS for port 465, secure:false use STARTTLS for port 587
//	proxy: process.env.http_proxy,
//	auth: {
//		user: config.emailFrom,
//		pass: config.emailPassword
//	},
//	tls: {
//        rejectUnauthorized: false
//    }
//},{
//	from: 'SmartHome system <smarthomeproject2018@gmail.com>'
//});

var transporter = nodemailer.createTransport('smtps://smarthomeproject2018:100100.m@smtp.gmail.com');

var Email = new Object();

sendMail = (eFrom, eTo, eSubject, eHtml) => {
	options = {
		from: eFrom,
		to: eTo,
		subject: eSubject,
		html: eHtml
	};
	transporter.sendMail(options, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response.toString());
		}
	});
}

sendMail = (eFrom, eTo, eSubject, eHtml, eAttachments) => {
	options = {
		from: eFrom,
		to: eTo,
		subject: eSubject,
		html: eHtml,
		attachments : eAttachments
	};
	transporter.sendMail(options, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response.toString());
		}
	});
}

Email.forgetPassword = (email, encode, number) => {
	let name = email.substring(0, email.indexOf('@'));
	let html = [];
	html.push(
		'<!DOCTYPE html>',
		'<html><head><meta charset="utf-8" />',
		'<meta name="viewport" content="width=divice-width, initial-scale=1.0"/>',
		'<title>Activated</title>',
		'<body>',
		'<img style="margin : auto; padding : 20px; display : block" src="https://image.ibb.co/di4A4S/ic_launcher.png"/>',
		'<div> Hi @' + name + ',</div><br/>',
		'<div>We received a request to reset your SmartHome password</div>',
		'<a href="' + config.host + 'recover/password/' + encode + '">Click here to change your password</a>',
		'<div>Alternatively, you can enter the following password reset code: <b>' + number + '</b></div>',
		'<div><i>Note: This email is valid for 30 minutes</i></div><hr>',
		'<div> Best regards <div>',
		'<div>Smart Home system</div>',
		'</body>',
		'</html>'
	);
	sendMail('Smart Home', email, 'Reset Password at Smart Home system', html.join(''));
}

/**
Bạn vừa yêu cầu đăng ký tài khoản ở Smart Home system.
Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.
Để xác nhận đăng ký tài khoản, vui lòng bấm vào link này

Trân trọng
Smart Home system
*/
Email.confirmRegister = (email, encode) => {
	let name = email.substring(0, email.indexOf('@'));
	let html = [];
	html.push(
		'<!DOCTYPE html>',
		'<html><head><meta charset="utf-8" />',
		'<meta name="viewport" content="width=divice-width, initial-scale=1.0"/>',
		'<title>Activated</title>',
		'<body>',
		'<img style="margin : auto; padding : 20px; display : block" src="https://image.ibb.co/di4A4S/ic_launcher.png"/>',
		'<div> Hi @' + name + ',</div><br/>',
		'<div>You have requested to register your account at Smart Home system.</div>',
		'<div>If you did not make request, you can ignore this email.</div><br/>',
		'<div>To confirm your account register, please click on this link: <a href="' + config.host + config.confirm_register_path + '/' + encode + '">' + config.host + config.confirm_register_path + '</a></div>',
		'<div><i>Note: This email is valid for 30 minutes</i></div>',
		'<div> Best regards <div>',
		'<div>Smart Home system</div>',
		'</body>',
		'</html>'
	);
	sendMail('Smart Home', email, 'Confirm Register at Smart Home system', html.join(''));
}

Email.thankConfirmRegister = (email) => {
	let html = [];
	let name = email.substring(0, email.indexOf('@'));
	html.push(
		'<img style="margin : auto; padding : 20px; display : block" src="https://image.ibb.co/di4A4S/ic_launcher.png"/>',
		'<div> Hi @' + name + ',</div><br/>',
		'<div>We are happy to have you trust and use our Smart Home service. You can experience a more modern and safe life, just by controlling your phone.</div>',
		'<br/><div>In the Smart Home app, you can control devices in your home automatically or manually, based on turning on or off devices and the usage modes you set.</div>',
		'<br/><div>We will send you notifications via this email, do not miss the next important things.</div>',
		'<br/><div>We do not monitor replies to this email, but if you have questions, the Help Center may have the answers you are looking for.</div>',
		'<div>We hope you enjoy your new account!</div>'
	);
	sendMail('Smart Home', email, 'Thanks for your register', html.join(''));
}

module.exports = exports = Email;
