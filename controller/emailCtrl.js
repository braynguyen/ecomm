const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async(data, req, res) => {
  // console.log("creating transporter");
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "rentalwebtest@gmail.com", //domain
      pass: process.env.MAIL_PASSWORD, //password
    },
  });
  // console.log("transporter made");

  const mailOptions = {
    from: 'rentalwebtest@gmail.com', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  }
      
  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
      
  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
});

module.exports = {sendEmail};