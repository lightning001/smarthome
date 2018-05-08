var nodemailer = require('nodemailer');
const config = require('../control/config');
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  service: 'gmail',
  auth: {
    user: config.emailFrom,
    pass: config.emailPassword
  }
});

var Email = new Object();

sendMail = (eFrom, eTo, eSubject, eHtml) => {
  options = {
    from: eFrom,
    to: eTo,
    subject: eSubject,
    html: eHtml
  };
  transporter.sendMail(options, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response.toString());
    }
  });
}

Email.confirmEmail = (email, link) => {
  let name = email.substring(0, email.indexOf('@'));
  let html = [];
  html.push(
    '<img style="margin : auto; padding : 20px; display : block" src="https://image.ibb.co/di4A4S/ic_launcher.png"/>',
    '<div> Hi @' + name + ',</div><br/>',
    '<div>You have requested to register your account at Smart Home system.</div>',
    '<div>If you did not make request, you can ignore this email.</div><br/>',
    '<div>To confirm your account registration, please click on this link: <a href="'+link+'">' + link + '</a></div>',
    '<div> Best regards <div>',
    '<div>Smart Home system</div>'
  );
  /**
  Bạn vừa yêu cầu đăng ký tài khoản ở Smart Home system.
  Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.
  Để xác nhận đăng ký tài khoản, vui lòng bấm vào link này

  Trân trọng
  Smart Home system
  */
  // sendMail('Smart Home', email, 'Confirm Email at Smart Home system', html.join(''));
}

module.exports = exports = Email;
Email.confirmEmail('wintersoul1212@gmail.com', 'http://facebook.com');
// sendMail('Smart Home', 'wintersoul1212@gmail.com', 'Test Node Mailer', '<div>Ahoho</div>');
