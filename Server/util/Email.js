var nodemailer = require('nodemailer');
let http = require('http');
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
    '<script type="text/javascript">',
    '$(document).ready(function(){',
    '$("#confirm").click(function(){',
    '$.post("/' + config.confirm_register_path + '",{data : ' + encode.stringify() + '}, function(success){',
    '  if(success==="done"){',
    '    alert("Dang ky thanh cong");',
    '  }else{alert("Dang ky that bai")}',
    '});',
    '});',
    '});',
    '</script>',
    '<img style="margin : auto; padding : 20px; display : block" src="https://image.ibb.co/di4A4S/ic_launcher.png"/>',
    '<div> Hi @' + name + ',</div><br/>',
    '<div>You have requested to register your account at Smart Home system.</div>',
    '<div>If you did not make request, you can ignore this email.</div><br/>',
    '<div>To confirm your account register, please click on this link: <a href="' + config.host + config.confirm_register_path + '">' + config.host + config.confirm_register_path + '</a></div>',
    '<div> Best regards <div>',
    '<div>Smart Home system</div>'
  );
  sendMail('Smart Home', email, 'Confirm Register at Smart Home system', html.join(''));
}

Email.thankConfirmRegister = (email) => {
  let html = [];
  html.push(
    '<script type="text/javascript"></script>'
    '<p>We are happy to have you trust and use our Smart Home service. You can experience a more modern and safe life, just by controlling your phone.</p>',
    '<br/><p>In the Smart Home app, you can control devices in your home automatically or manually, based on turning on or off devices and the usage modes you set.</p>',
    '<br/><p>We will send you notifications via this email, do not miss the next important things.</p>',
    '<br/><p>We do not monitor replies to this email, but if you have questions, the Help Center may have the answers you are looking for.</p>',
    '<p>We hope you enjoy your new account!</p>'
  );
  sendMail('Smart Home', email, 'Thanks for your register', html.join(''));
}

module.exports = exports = Email;
// Email.confirmEmail('wintersoul1212@gmail.com', 'http://facebook.com');
// sendMail('Smart Home', 'wintersoul1212@gmail.com', 'Test Node Mailer', '<div>Ahoho</div>');
