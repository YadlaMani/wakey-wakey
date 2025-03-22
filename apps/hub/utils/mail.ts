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
export const sendLatencyAlertMail = async (
  to: string,
  url: string,
  latency: number,
  websiteLatencyAlert: number
) => {
  try {
    const mailOptions = {
      from: '"Wakey-Wakey Alerts" <alerts@wakey-wakey.com>',
      to,
      subject: `🚀 Great News! ${url} is Running with Low Latency`,
      text: `Hey there, 
  
  Your monitored website is performing exceptionally well with low latency!
  
  🔗 Website: ${url}  
  ⚡ Current Latency: ${latency}ms  
  🕒 Time: ${new Date().toLocaleString()}
  
  This means faster load times and a better experience for your users. Keep up the good work!
  
  Stay ahead,  
  Wakey-Wakey Team`,

      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #28a745;">🚀 Great News! Low Latency Detected</h2>
            <p>Hey there,</p>
            <p>Your monitored website is currently <strong>running smoothly with low latency</strong>.</p>
            <p><strong>🔗 Website:</strong> <a href="${url}" target="_blank">${url}</a></p>
            <p><strong>⚡ Current Latency:</strong> ${latency}ms</p>
            <p><strong>🕒 Time:</strong> ${new Date().toLocaleString()}</p>
            <p>This ensures a fast and seamless experience for your users. Keep it up!</p>
            <p>Best,</p>
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
