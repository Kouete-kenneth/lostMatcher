import nodemailer from 'nodemailer';
import config from '../config/env.config';
import logger from '../config/logging.config';

let transport: nodemailer.Transporter;

transport = nodemailer.createTransport(config.email.smtp);
transport.verify()
  .then(() => {
    logger.info('Connected to email server: ' + config.email.smtp.auth.user);
  })
  .catch((error: any) => {
    if (error.code === 'EAUTH' && error.responseCode === 535) {
      logger.warn('Authentication error: Incorrect email address or password. Please double-check your email server credentials.');
    } else if (error.code === 'EAUTH' && error.responseCode === 534) {
      logger.warn('Authentication error: Incorrect email address. Please double-check your email server credentials.');
    } else if (error.code === 'EAUTH' && error.responseCode === 535) {
      logger.warn('Authentication error: Incorrect password. Please double-check your email server credentials.');
    } else {
      logger.warn('Connection error: Unable to connect to email server. Make sure you have configured the SMTP options in .env.');
    }
  });

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise<void>}
 */
const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const msg = { from: config.email.from, to, subject, html: text };
  await transport.sendMail(msg);
};

/**
 * Send an email from a client 
 * @param {string} from
 * @param {string} subject
 * @param {string} text
 * @returns {Promise<void>}
 */
const sendEmailFrom = async (from: string, subject: string, text: string): Promise<void> => {
  const msg = { from, to: config.email.from, subject, html: text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  try {
    const subject = 'Reset password';
    const resetPasswordUrl = `https://emailpasswordutilities.vercel.app/verify-reset/reset-password/new-password?token=${token}&&email=${to}`;
    const text = `
      <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color: #2d8cf0;">Reset Your Password</h2>
      <p>
        Dear user,
      </p>
      <p>
        We received a request to reset your password for your FindIt account. To proceed, please click the button below:
      </p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${resetPasswordUrl}" style="background: #2d8cf0; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
        Reset Password
        </a>
      </p>
      <p>
        If the button above does not work, please copy and paste the following link into your browser:<br>
        <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
      </p>
      <p>
        If you did not request a password reset, you can safely ignore this email.
      </p>
      <br>
      <p>Happy exploring!</p>
      <p style="margin-top: 32px;">
        Best regards,<br>
        <strong>FindIt Team</strong>
      </p>
      </div>
    `;
    await sendEmail(to, subject, text);
    logger.info('email send succesfully');
  } catch (error) {
    logger.error('an error occured while sending the reset password email:', error);
  }
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `https://emailpasswordutilities.vercel.app/verify-reset/verify?token=${token}`;
  const text = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color: #2d8cf0;">Verify Your Email Address</h2>
      <p>
        Dear user,
      </p>
      <p>
        Thank you for registering with FindIt! To verify your email address and activate your account, please click the button below:
      </p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${verificationEmailUrl}" style="background: #2d8cf0; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
          Verify Email
        </a>
      </p>
      <p>
        If the button above does not work, please copy and paste the following link into your browser:<br>
        <a href="${verificationEmailUrl}">${verificationEmailUrl}</a>
      </p>
      <p>
        If you did not create an account, you can safely ignore this email.
      </p>
      <br>
      <p>Happy exploring!</p>
      <p style="margin-top: 32px;">
        Best regards,<br>
        <strong>FindIt Team</strong>
      </p>
    </div>
  `;
  await sendEmail(to, subject, text);
};

/**
 * Send captivating confirmation email
 * @param {string} to - The recipient's email address.
 * @param {string} token - The confirmation token generated for the user.
 * @returns {Promise<void>} - A Promise that resolves when the email is sent successfully.
 */
const sendEmailVerificationConfirmationEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Email Address Verification Success';
  const text = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color: #2d8cf0;">Welcome to FindIt!</h2>
      <p>
        Thank you for joining our community. We're thrilled to have you on board!
      </p>
      <p>
        By verifying your email address, you now have access to exclusive features and updates.
      </p>
      <p>
        If you didn't create an account with us, you can safely ignore this email.
      </p>
      <br>
      <p>Happy exploring!</p>
      <p style="margin-top: 32px;">
        Best regards,<br>
        <strong>FindIt Team</strong>
      </p>
    </div>
  `;
  await sendEmail(to, subject, text);
};

export {
  transport,
  sendEmailVerificationConfirmationEmail,
  sendEmail,
  sendEmailFrom,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
