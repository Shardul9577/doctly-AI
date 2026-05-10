import User from '../models/user.model.js';
import { hashPassword } from '../utils/bcrypt.util.js';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config/env.config.js';

export default async function seedAdmin() {
  const adminEmail = ADMIN_EMAIL;
  const adminPassword = ADMIN_PASSWORD;

  const existingAdmin = await User.findOne({
    email: adminEmail,
    role: 'admin',
  });
  if (existingAdmin) {
    console.log('Admin user already exists. Skipping.');
    return;
  }

  const hashedPassword = await hashPassword(adminPassword);
  await User.create({
    role: 'admin',
    firstName: 'Super',
    lastName: 'Admin',
    email: adminEmail,
    phone: '1234567890',
    password: hashedPassword,
    is_active: true,
  });
  console.log('Admin user seeded!');
}
