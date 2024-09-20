// Nodemailer
const nodemailer = require('nodemailer');

// Path
const path = require('path');

// Read the HTML email template file
const emailTemplatePath = path.join(__dirname, '../views/email/template.ejs');

const host = process.env.MAIL_ENCRYPTION + '://' + process.env.MAIL_HOST;
var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: host,
    port: process.env.MAIL_PORT,
    secure: true, // use SSL
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

// Verify connection configuration
transporter.verify((err, info) => {
    try {
        console.log('Server is ready to take our messages: ', info);
    } catch (error) {
        console.error(error);
    }
});

module.exports = {
    transporter,
    emailTemplatePath
};