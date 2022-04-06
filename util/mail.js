/* eslint-disable comma-spacing */


const nodemailer = require('nodemailer');


exports.mailApi = (email, mail) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        // true for 465, false for other ports
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: mail.subject, // Subject line
        text: mail.text,
        html: mail.html,
    });
};
