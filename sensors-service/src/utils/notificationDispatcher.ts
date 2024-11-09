const nodemailer = require('nodemailer');

const sendEmail = async (recipients: any[], subject: any, message: any) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'oobligatorioas@gmail.com',
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'oobligatorioas@gmail.com',
    to: recipients.join(','),
    subject: subject,
    text: message
  };

  await transporter.sendMail(mailOptions);
};



const notificationDispatcher = async (recipients: any[], subject: any, message: any) => {
  await sendEmail(recipients, subject, message);
};

module.exports = { notificationDispatcher };
