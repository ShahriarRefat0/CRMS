
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import OtpEmail from './template/Otp';



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// SMTP connection check
transporter.verify((err, success) => {
  if (err) {
    console.error('SMTP connection error:', err);
  } else {
    console.log('SMTP ready to send emails');
  }
});

export const sendVerificationMail = async ({ email, otp }) => {
  const emailHtml = await render(<OtpEmail otp={otp} />);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
 
};

console.log(transporter)