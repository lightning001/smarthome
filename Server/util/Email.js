var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smarthomeproject2018@gmail.com',
    pass: '100100.m'
  }
});

module.exports = exports = sendMail = (eFrom, eTo, eSubject, eContent) =>{
  options = {from : eFrom, to : eTo, subject : eSubject, text : eContent};
  transporter.sendMail(options, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
