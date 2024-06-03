import { Resend } from 'resend';
const nodemailer = require("nodemailer");


const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL_FINAL;


const sendMail = (email: string, verificationLink: string, forgot: boolean) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.APP_PASSWORD,
        }
    });

    const subject = forgot ? 'Password reset link for ACD Referral' : 'Registration verification link for ACD Referral';

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center;">
    <h2 style="color: #4CAF50;">${subject}</h2>
    <p>Hey,</p>
    <p>Please click the link below to ${forgot ? 'reset your password' : 'complete your registration with ACD Referral Team'}:</p>
    <p><a href="${verificationLink}" style="color: #4CAF50; text-decoration: none;">Verify your account</a></p>
    <p>If the link above does not work, please copy and paste the following URL into your browser:</p>
    <p style="word-wrap: break-word;">${verificationLink}</p>
    <p>By verifying, you will gain access to your account for referral related works.</p>
    <p>Thank you for believing in A Code Daily</p>
</div>
  `;

    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: htmlContent,

    };

    return { transporter, mailOptions };
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    const { transporter, mailOptions } = sendMail(email, confirmLink, false)
    await transporter.sendMail(mailOptions)
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-password?token=${token}`;
    const { transporter, mailOptions } = sendMail(email, confirmLink, true)
    await transporter.sendMail(mailOptions)
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: `<p> Your 2FA Code: "${token}"</p>`

    })
}
