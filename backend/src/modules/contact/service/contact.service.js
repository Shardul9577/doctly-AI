import sendEmail from '../../../emails/services/mail.service.js';
import { EMAIL } from '../../../config/env.config.js';
import { CONTACT_MESSAGES } from '../constants/contact.constants.js';

class ContactService {
  async sendContactEmail(contactData) {
    try {
      const { name, email, subject, message } = contactData;

      // Email context for the template
      const emailContext = {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toLocaleString(),
      };

      // Send email to Doctly support
      await sendEmail(
        EMAIL, // Send to the configured Doctly email
        `${CONTACT_MESSAGES.EMAIL.SUBJECT_PREFIX}${subject}`,
        CONTACT_MESSAGES.EMAIL.TEMPLATE_NAME, // Template name
        emailContext
      );

      return {
        success: true,
        message: CONTACT_MESSAGES.SUCCESS.EMAIL_SENT,
      };
    } catch (error) {
      console.error('Error sending contact email:', error);
      throw new Error(CONTACT_MESSAGES.ERROR.EMAIL_FAILED);
    }
  }
}

export default new ContactService();
