const sendgridMailer = require('@sendgrid/mail');
sendgridMailer.setApiKey(process.env.SENDGRID_API_KEY);

class Mailer {
    static create ({ email, password }) {
        const msg = 
        {
            to: email, 
            from: 'pan.project.2104@gmail.com', 
            subject: 'Account Created',
            html: `<p> Good day, welcome to Pan Co. We hope you will enjoy your time with us.</p>
                   <p>Here is your new password:</p>
                   <h1>` + password + `</h1>
                   <p> You may change this password at your discretion or you consult with your manager in the case where you need a reset. </p>`
        }
        sendgridMailer
            .send(msg)
            .catch((error) => {
              console.error(error)
            })
    }
    
    static reset ({ email, password }) {
        const msg = 
        {
            to: email, // Change to your recipient
            from: 'pan.project.2104@gmail.com', // Change to your verified sender
            subject: 'Password Reset',
            html: `<p> Good day, this email is to let you know that your password has been reset.</p>
                   <p>Here is your new password:</p>
                   <h1>` + password + `</h1>
                   <p> Consult this manager if this change is unexpected. </p>`
        }
        sendgridMailer
            .send(msg)
            .catch((error) => {
              console.error(error)
            })
    }
    
    static change ({ email, password }) {
        const msg = 
        {
            to: email, 
            from: 'pan.project.2104@gmail.com', 
            subject: 'Password Changed',
            html: `<p> Good day, this email is to let you know that your password has been recently changed.</p>
                   <p>Here is your new password:</p>
                   <h1>` + password + `</h1>
                   <p> If you did not authorize this change, please consult your manager </p>`
        }
        sendgridMailer
            .send(msg)
            .catch((error) => {
              console.error(error)
            })
    }
}

module.exports = Mailer;