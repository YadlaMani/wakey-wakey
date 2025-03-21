import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "wakey.wakeydpin@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});

export const sendFailureMail = async (
  to: string,
  url: string,
  location: string
) => {
  try {
    const mailOptions = {
      from: '"Wakey-Wakey Alerts" <alerts@wakey-wakey.com>',
      to,
      subject: `🚨 Website Down Alert: ${url}`,
      text: `Hey there, 

We detected that your subscribed website is currently down.

🔗 Website: ${url}  
📍 Validator Location: ${location}  
🕒 Time: ${new Date().toLocaleString()}

Our system will continue monitoring and notify you once it's back online.

Stay tuned,  
Wakey-Wakey Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>🚨 Website Down Alert!</h2>
          <p>Hey there,</p>
          <p>We detected that your subscribed website is currently <strong>down</strong>.</p>
          <p><strong>🔗 Website:</strong> <a href="${url}" target="_blank">${url}</a></p>
          <p><strong>📍 Validator Location:</strong> ${location}</p>
          <p><strong>🕒 Time:</strong> ${new Date().toLocaleString()}</p>
          <p>Our system will keep monitoring and notify you once it's back online.</p>
          <p>Stay tuned,</p>
          <p><strong>Wakey-Wakey Team</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
