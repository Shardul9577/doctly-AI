import plansModel from '../models/plans.model.js';

const freePlanFeatures = [
  {
    key: 'patient_management',
    title: 'Patient Management',
    star_feature: false,
    description:
      'Add, edit, and view patient details, including medical history and contact information.',
  },
  {
    key: 'visit_management',
    title: 'Visit Management',
    star_feature: false,
    description:
      'Schedule and document patient visits with basic notes and vital information.',
  },
  {
    key: 'profile_access',
    title: 'Doctor Profile Access',
    star_feature: false,
    description:
      'Update your profile, clinic details, and contact information anytime.',
  },
];

const planFeatures = [
  {
    key: 'ai_report_assistant',
    title: 'AI Assistant for Reports',
    star_feature: true,
    description:
      'Chat using voice or text with an AI that quickly creates visit summaries, follow-up notes, and health suggestions — all in real time.',
  },
  {
    key: 'ai_visit_summary',
    title: 'AI Visit Summary Dashboard',
    star_feature: true,
    description:
      'See a complete summary after every visit — including symptoms, diagnosis, prescriptions, and next steps — automatically created by AI.',
  },
  {
    key: 'patient_dashboard',
    title: 'Comprehensive Patient Dashboard',
    star_feature: false,
    description:
      'View each patient’s full history in one place — records, visits, vitals, alerts, and even common or trending conditions.',
  },
  {
    key: 'visit_analytics',
    title: 'Visit Analytics',
    star_feature: false,
    description:
      'Track visit counts, patient flow, and symptom trends with easy-to-read charts and reports.',
  },
  {
    key: 'ai_risk_prediction',
    title: 'AI Risk Prediction',
    star_feature: true,
    description:
      'Get alerts about possible health risks like diabetes or BP — predicted early from patient patterns.',
  },
  {
    key: 'symptom_search',
    title: 'AI Symptom-Based Search',
    star_feature: false,
    description:
      'Type a symptom to instantly find similar past cases and what worked in their treatment.',
  },
  {
    key: 'disease_trends',
    title: 'Disease Trend Visualization',
    star_feature: false,
    description:
      'See which diseases are rising or common in your clinic or city — shown clearly in charts.',
  },
  {
    key: 'multi_language_reports',
    title: 'Multi-Language Report Drafting',
    star_feature: true,
    description:
      'Create reports in Hindi, Gujarati, or other local languages to better connect with patients.',
  },
];

const plans = [
  {
    name: 'Free Plan',
    price: 0,
    duration: 1, // month
    token_limit: 0,
    features: freePlanFeatures,
    billing_cycle: 'monthly',
    is_active: true,
    priority: 0,
  },
  {
    name: 'Starter Plan (1 Month)',
    price: 2500,
    duration: 1,
    token_limit: 500,
    features: planFeatures,
    billing_cycle: 'monthly',
    is_active: true,
    priority: 1,
  },
  {
    name: 'Professional Plan (3 Months)',
    price: 7500,
    duration: 3,
    token_limit: 1500,
    features: planFeatures,
    billing_cycle: 'monthly',
    is_active: true,
    priority: 2,
  },
];

export default async function seedPlans() {
  try {
    // Check if plans already exist
    const existingPlans = await plansModel.find({});
    if (existingPlans.length > 0) {
      console.log('Plans already exist. Skipping.');
      return;
    }

    // Create plans
    await plansModel.insertMany(plans);
    console.log('✅ Plans seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding plans:', error);
    throw error;
  }
}
