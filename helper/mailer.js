"use strict";
const nodeMailer = require('nodemailer');
const jade = require('jade');
const fs = require('fs');
// async..await is not allowed in global scope, must use a wrapper
exports.sendMail = async(temp, context, from, to, subject) => {
    // specify jade template to load
    const template = process.cwd() + '/views/mail/'+ temp +'.jade';
    
    // get template from file system
    fs.readFile(template, 'utf8', async function(err, file) {
        if (err) {
            return res.send('ERROR!');
        } else {
            //compile jade template into function
            const compiledTmpl = jade.compile(file, { filename: template });
            // get html back as a string with the context applied;
            const content = compiledTmpl(context);

            const transporter = nodeMailer.createTransport({
                host: 'sg2plcpnl0135.prod.sin2.secureserver.net',
                port: 465,
                secure: true,
                auth: {
                    user: 'admin@cutsonwheel.com', // sender's gmail id
                    pass: '?.&W;S$n8@[7' // sender password
                }
            });

            let mailOptions = {
                from: from,
                to: to,
                subject: subject,
                html: content
            }
            let info = await transporter.sendMail(mailOptions);
            if (info) {
                console.log(info);
            }
        }
    });
}
