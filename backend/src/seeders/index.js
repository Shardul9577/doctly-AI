import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/connect.db.js';
import seedAdmin from './admin.seed.js';
import seedPlans from './plans.seed.js';

async function runSeeders() {
  try {
    await connectDB();
    await seedAdmin();
    await seedPlans();
    console.log('All seeders ran successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

runSeeders();
