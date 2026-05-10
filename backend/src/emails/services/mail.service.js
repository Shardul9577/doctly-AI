import path from 'path';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { fileURLToPath } from 'url';
import {
  EMAIL,
  EMAIL_PASS,
  EMAIL_FROM,
  EMAIL_SERVICE,
} from '../../config/env.config.js';

// Required if you're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
});

// Configure Handlebars
transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      partialsDir: path.resolve(__dirname, '../templates'),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, '../templates'),
    extName: '.hbs',
  })
);

const mailFrom =
  EMAIL_FROM ||
  (EMAIL ? `Doctly <${EMAIL}>` : 'Doctly <no-reply@doctly.com>');

// Generic sendEmail function
export default async function sendEmail(to, subject, template, context = {}) {
  const mailOptions = {
    from: mailFrom,
    to,
    subject,
    template,
    context,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}`, err);
    throw err;
  }
}
