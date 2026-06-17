const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {

        console.log("coming in mailSender")
        console.log("MAIL_HOST:", process.env.MAIL_HOST)
      console.log("MAIL_USER:", process.env.MAIL_USER)
        console.log("MAIL_PASS:",  process.env.MAIL_PASS)
        console.log("email in mailSender",email);
        console.log("title of  email in mailsender",title);
        
        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth : {
                user : process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        console.log("coming below transporter")

        let info = await transporter.sendMail({
            from: 'Uber || by Anshuman',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log("info is...",info);
        return info;

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { mailSender };