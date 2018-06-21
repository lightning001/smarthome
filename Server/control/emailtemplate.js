var mongoose = require('mongoose'),
	conn = require('../util/config').database;
let msg = require('../msg').en,
	config = require('../util/config'),
	ejs = require('ejs'),
	nodemailer = require('nodemailer');

var emailTemplateSchema = new mongoose.Schema({
	lang: {type: String,default: 'en'},
	subject: {type: String,default: 'Smart Home system'},
	text: {type: String},
	html: {type: String}
});

var EmailTemplate = conn.model('EmailTemplate', emailTemplateSchema, 'EMAILTEMPLATE');

const Template = {
		RECOVER_PASSWORD: 'Recover Password',
		ACTIVE_ACCOUNT: 'Confirm Register',
		THANK_YOU: 'Thanks for Register'
	},
	transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		service: 'gmail',
		auth: {
			user: config.emailFrom,
			pass: config.emailPassword
		},
		tls: {rejectUnauthorized: false}
	}, {
		from: 'SmartHome system <smarthomeproject2018@gmail.com>'
	});

function sendMail(eFrom, eTo, eSubject, eHtml, eText) {
	options = {
		from: eFrom,
		to: eTo,
		subject: eSubject,
		html: eHtml,
		text: eText
	};
	transporter.sendMail(options, function (error, info) {
		if (error) {
			return false
		} else {
			console.log('Email sent: ' + info.response.toString());
			return true;
		}
	});
}

function getTemplate(subject, locals) {
	return new Promise((resolve, reject) => {
		EmailTemplate.findOne({'subject': subject}).
		exec(async (e, temp) => {
			if (e) {
				reject(e);
			} else if (!temp) {
				reject('Cannot find Template ${subject}');
			} else {
				let html = ejs.render(temp.html, locals);
				resolve({'html': html, 'text': temp.text, 'subject': temp.subject});
			}
		});
	});
}

EmailTemplate.ActiveAccount = (email, name, link) => {
	return new Promise((resolve, reject) => {
		getTemplate(Template.ACTIVE_ACCOUNT, {
			name: name,
			link: link
		}).then(temp => {
			if (sendMail(config.emailFrom, email, temp.subject, temp.html, temp.text))
				resolve(true);
			else reject('Error');
		}).catch(e => {
			reject(e);
		});
	});
}

EmailTemplate.RecoverPassword = (email, name, link, number) => {
	return new Promise((resolve, reject) => {
		getTemplate(Template.RECOVER_PASSWORD, {
			name: name,
			link: link,
			number: number
		}).then(temp => {
			if (sendMail(config.emailFrom, email, temp.subject, temp.html, temp.text))
				resolve(true);
			else reject('Cannot send');
		}).catch(e => {
			return reject(e);
		});
	});
}

EmailTemplate.Thankyou = (email, name) => {
	return new Promise((resolve, reject) => {
		getTemplate(Template.THANK_YOU, {name: name}).then(temp => {
			if (sendMail(config.emailFrom, email, temp.subject, temp.html, temp.text))
				resolve(true);
			else reject('Cannot send');
		}).catch(e => {
			return reject(e);
		});
	});
}

module.exports = EmailTemplate;