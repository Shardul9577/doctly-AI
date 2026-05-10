import { FRONTEND_URL } from '../config/env.config.js';
import sendEmail from '../emails/services/mail.service.js';

export const emailVerification = async (name, email, token) => {
  const url = `${FRONTEND_URL}/email-verify/token=${token}`;

  console.log(url, 'this is url');
  let res = await sendEmail(
    email,
    'Doctly - Initial Account Setup',
    'verify_email',
    {
      USER: name,
      TOKEN: url,
    }
  );

  console.log(res, 'res');
  console.log(`✅Email verification mail sent to - ${email}`);
};

export const doctorWelcomeEmail = async (email, name) => {
  const url = `${FRONTEND_URL}/login`;
  let res = await sendEmail(
    email,
    'Welcome To Doctly — Trusted Care, Simplified',
    'welcome_doctor',
    {
      USER: name,
      LOGIN: url,
    }
  );

  console.log(`✅ Welcome Email sent to Doctor - ${email}`);
};

export const patientWelcomeEmail = async (email, name) => {
  const url = `${FRONTEND_URL}/auth/login`;
  await sendEmail(
    email,
    'Welcome To Doctly — Trusted Care, Simplified',
    'welcome_patient',
    {
      USER: name,
      LOGIN: url,
    }
  );
  console.log(`✅ Welcome Email sent to Patient - ${email}`);
};

export const forgetPasswordEmail = async (email, name, resetToken) => {
  const url = `${FRONTEND_URL}/auth/reset-password/token=${resetToken}`;
  await sendEmail(email, 'Doctly — Reset Password', 'forget_password', {
    USER: name,
    URL: url,
  });
  console.log(`✅ Forget password Email sent to - ${email}`);
};

export const passwordUpdatedEmail = async (email, name) => {
  const url = `${FRONTEND_URL}/auth/login`;
  await sendEmail(email, 'Doctly — Password Update', 'password_update', {
    USER: name,
    URL: url,
  });
  console.log(`✅ Password updated successfully Email sent to - ${email}`);
};

export const sendDocApprovalEmail = async (email, name) => {
  const url = `${FRONTEND_URL}/auth/login`;
  let to = email;
  let subject = 'Your MedDoc Verification: Approved!';
  let template = 'approval_doctor';
  let context = {
    USER: name,
    LOGIN: url,
  };

  await sendEmail(to, subject, template, context);

  console.log(`✅ Approval Email sent to Doctor - ${email}`);
};

export const sendDocRejectionEmail = async (email, name, rejectionReason) => {
  const url = `${FRONTEND_URL}/auth/login`;
  let to = email;
  let subject = 'Your MedDoc Verification: Approved!';
  let template = 'rejection_doctor';
  await sendEmail(email, subject, template, {
    name,
    rejectionReason,
    LOGIN: url,
  });
  console.log(`⚠️ Rejection Email sent to Doctor - ${toEmail}`);
};

export const sendRefundRejection = async (email, name, REASON) => {
  let to = email;
  let subject = 'Your Refund Verification: Rejected!';
  let template = 'reject_refund';
  await sendEmail(email, subject, template, {
    name,
    REASON,
  });
  console.log(`⚠️ Rejection Refund Email sent to Doctor - ${email}`);
};

export const sendRefundApproval = async (email, name) => {
  let to = email;
  let subject = 'Your Refund Verification: Approved!';
  let template = 'approval_refund';
  await sendEmail(email, subject, template, {
    name,
  });
  console.log(`⚠️ Rejection Email sent to Doctor - ${email}`);
};
