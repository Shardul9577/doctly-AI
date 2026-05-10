import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  token_limit: { type: Number, default: 500 },
  features: [
    {
      key: { type: String, required: true },
      title: { type: String, required: true },
      star_feature: { type: Boolean, default: false },
      description: { type: String, required: true },
    },
  ],
  billing_cycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly',
  },
  priority: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('plans', planSchema);
