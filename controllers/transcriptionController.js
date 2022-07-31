const pdf = require("pdf-creator-node");
const fs = require("fs");
const nodemailer = require("nodemailer");
const mmToMS = require("../services");

const template = fs.readFileSync(`${__dirname}\\template.html`, "utf8");
const options = require('../config/options.json');
const jsonData = require('../data/mp4.json');
const controllers = {};

async function mail(attachmentsFile) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"No Responder" <no-responder@sendinblue.com>', // sender address
        to: "william@fabioarias.co", // list of receivers william@fabioarias.co
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        attachments: [
            {   // utf-8 string as an attachment
                path: attachmentsFile
            }
        ]
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

controllers.send = async (req, res) => {

    let resData = jsonData.Transcript.map((d) => {
        return {
            ...d,
            BeginOffsetMillis: mmToMS(d.BeginOffsetMillis),
            EndOffsetMillis: mmToMS(d.EndOffsetMillis),
        };
    });

    let dir = process.cwd();
    let document = {
        html: template,
        data: {
            transcript: resData,
        },
        path: `${dir}\\data\\pdf\\output.pdf`,
        type: "",
    };

    pdf
        .create(document, options)
        .then(async (res) => {
            console.log('archivo: ' + res.filename);

            await mail(res.filename);
        })
        .catch((error) => {
            console.error(error);
        });

    res.json({ success: true, data: resData });
};

controllers.read = async (req, res) => {

    let resData = jsonData.Transcript.map((d) => {
        return {
            ...d,
            BeginOffsetMillis: mmToMS(d.BeginOffsetMillis),
            EndOffsetMillis: mmToMS(d.EndOffsetMillis),
        };
    });

    res.json({ success: true, data: resData });
};

module.exports = controllers;