/* eslint-disable comma-spacing */


const nodemailer = require('nodemailer');

let config = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    }
};

if(!process.env.EMAIL_SERVICE){
    config = {
        // true for 465, false for other ports       
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_HOST_PORT)||587,
        secure: false, // use TLS
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: true,
        },
    }
}
exports.mailApi = (email, mail) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(config);

    // send mail with defined transport object
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: mail.subject, // Subject line
        text: mail.text,
        html: mail.html,
    });
};
