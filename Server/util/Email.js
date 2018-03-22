var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smarthomeproject2018@gmail.com',
    pass: '100100.m'
  }
});

var mailOptions = {
  from: 'no-reply@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};


sendMail = (from, to, subject, content) =>{

}
transporter.sendMail(option, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
