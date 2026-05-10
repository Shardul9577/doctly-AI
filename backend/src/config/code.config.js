import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * Generates a unique ABHA ID based on user role and year (12 digit Number)
 * Format: DOC25ABC1234, PAT25XYZ7890, etc.
 * @param {String} role - 'DOCTOR', 'PATIENT', or 'ADMIN'
 * @returns {Promise<String>} - Unique ABHA ID
 */
const generateAbhaId = async (role) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = role === 'doctor' ? 'DOC' : role === 'patient' ? 'PAT' : 'ADM';

  let abhaId;
  let isUnique = false;

  while (!isUnique) {
    const randomStr = generateStrongAlphaNumericCode(7);

    abhaId = `${prefix}${year}${randomStr}`;

    const existing = await mongoose.models.user.findOne({ abha_id: abhaId });
    if (!existing) isUnique = true;
  }

  return abhaId;
};

/**
 * Generate a 7-character strong alphanumeric code
 *
 * ✅ At least 2 letters (A-Z)
 * ✅ At least 3 digits (0-9)
 * ✅ Total length: 7 characters
 *
 * @param {number} length - Total length of the code (default 7)
 * @returns {string} - A valid alphanumeric code with required entropy
 */
function generateStrongAlphaNumericCode(length = 7) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const allChars = letters + digits;

  while (true) {
    const chars = [...Array(length)].map(() =>
      allChars.charAt(crypto.randomInt(0, allChars.length))
    );

    const letterCount = chars.filter((ch) => letters.includes(ch)).length;
    const digitCount = chars.filter((ch) => digits.includes(ch)).length;

    if (letterCount >= 2 && digitCount >= 3) {
      return chars.join('');
    }
  }
}

export default generateAbhaId;
