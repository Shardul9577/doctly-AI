import axios from 'axios';
import {
  MSG91_AUTH_KEY,
  MSG91_SENDER_ID,
  MSG91_OTP_URL,
} from '../config/env.config.js';

/**
 * Sends OTP via MSG91
 * @param {string} phone - Recipient's phone number with country code (e.g., +91...)
 * @param {string} otp - The OTP to send
 */
export async function sendOtpToPhone(phone, otp) {
  try {
    const response = await axios.post(MSG91_OTP_URL, {
      mobile: phone,
      authed: MSG91_AUTH_KEY,
      otp,
      sender: MSG91_SENDER_ID,
    });

    if (response.data.type === 'success') {
      console.log('✅ OTP sent via MSG91:', response.data.request_id);
    } else {
      console.error('⚠️ OTP send failed:', response.data.request_id);
      throw new Error('Failed to send OTP via MSG91');
    }
  } catch (error) {
    console.error('❌ MSG91 Error:', error.message || error);
    throw new Error('MSG91 OTP sending failed');
  }
}
