import bcrypt from "bcryptjs";

/**
 * Hash the given password.
 * @param {string} password - Plain password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare plain and hashed passwords.
 * @param {string} plain - Plain password
 * @param {string} hashed - Hashed password
 * @returns {Promise<boolean>} - Comparison result
 */
export const comparePasswords = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
