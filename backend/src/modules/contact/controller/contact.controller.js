import contactService from '../service/contact.service.js';
import { CONTACT_MESSAGES } from '../constants/contact.constants.js';

class ContactController {
  async contactUs(req, res, next) {
    try {
      const { name, email, subject, message } = req.body;

      const result = await contactService.sendContactEmail({
        name,
        email,
        subject,
        message,
      });

      res.status(200).json({
        success: true,
        message: CONTACT_MESSAGES.SUCCESS.MESSAGE_SENT,
        data: {
          success: true,
          message: CONTACT_MESSAGES.SUCCESS.EMAIL_SENT,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();
