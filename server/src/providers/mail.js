const sendgrid = require("@sendgrid/mail");
const config = require("config");

const { InternalServerError } = require("../../helpers/errors");
sendgrid.setApiKey(config.get("mail.key"));

async function send(email, body, { subject, content }) {
  try {
    await sendgrid.send({
      to: email,
      from: config.get("mail.address"),
      subject,
      html: content(body),
    });
  } catch (err) {
    console.log("[SEND GRID - MAILER ERROR]" + err.message);
    throw new InternalServerError();
  }
}

const template = {
  ACCOUNT_CREATED: {
    subject: "Account Created 🙌 - Welcome to Pan!",
    content: ({ name, password }) => {
      return `<style type="text/css">
        @import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;700&display=swap");
        </style>

        <div style="font-family: 'Work Sans', sans-serif; color: hsl(211, 28%, 16%);">
          <p>Hello, <b style="color: hsl(174, 36%, 64%);">${name}</b>,</p>

          <p>Welcome to <b style="color: hsl(41, 79%, 55%);">Pan Co.</b><p>

          <p>
            Your account has been succesfully created, and can now be used at 
            <a href="${config.get(
              "client.url"
            )}" target="_blank" rel="noopener noreferrer" style="color: hsl(174, 36%, 64%);">Pan</a> to start working today.
          </p>

          <p>You can use the following password below to login with your email:</p>

          <h2 style="color: hsl(41, 79%, 55%);">${password}</h2>
            
          <p>We hope you will enjoy your time with us. 🎉</p>

          <p>Sincerely,<br>
          <em>Manager</em></p>

          <p><b>P.S.</b> Don't forget to change your password once you have logged in.</p>
          
          <hr>

          <pre style="white-space: normal; font-size: 0.8rem; text-align: center; font-style: italic;">
            Should you receive this message by mistake, please disregard this email. 
            If possible, we would also like to ask you to delete this message from your mailbox, 
            and do not forward it or any part of it to anyone else. Thank you for your cooperation and understanding.
          </pre>
        </div>`;
    },
  },
  CHANGED_PASSWORD: {
    subject: "Password Reset 🔧 - Pan",
    content: ({ name, password }) => {
      return `<style type="text/css">
        @import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;700&display=swap");
        </style>

        <div style="font-family: 'Work Sans', sans-serif; color: hsl(211, 28%, 16%);">
          <p>Hello, <b style="color: hsl(174, 36%, 64%);">${name}</b>,</p>

          <p>
            Your password has been succesfully reset, and can now be used at 
            <a href="${config.get(
              "client.url"
            )}" target="_blank" rel="noopener noreferrer" style="color: hsl(174, 36%, 64%);">Pan</a>.
          </p>

          <p>Your new password is now found below 💪:</p>

          <h2 style="color: hsl(41, 79%, 55%);">${password}</h2>
            
          <p>Sincerely,<br>
          <em>Manager</em></p>

          <p><b>P.S.</b> Don't forget to change your password once you have logged in.</p>
          
          <hr>

          <pre style="white-space: normal; font-size: 0.8rem; text-align: center; font-style: italic;">
            Should you receive this message by mistake, please disregard this email. 
            If possible, we would also like to ask you to delete this message from your mailbox, 
            and do not forward it or any part of it to anyone else. Thank you for your cooperation and understanding.
          </pre>
        </div>`;
    },
  },
};

module.exports = {
  send,
  template,
};
