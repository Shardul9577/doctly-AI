import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const docPersonalDetailSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    license_number: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    medical_school: {
      type: String,
      trim: true,
      required: false,
    },
    languages: {
      type: [String], // Example: ["English", "Hindi"]
      default: [],
      required: false,
    },
    clinic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: false,
    },
    hospital_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: false,
    },
    degree_url: {
      type: String,
      required: true,
      trim: true,
    },
    aadhaar_card_url: {
      type: String,
      required: true,
      trim: true,
    },
    pan_card_url: {
      type: String,
      required: true,
      trim: true,
    },
    verified_status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      required: true,
    },
    rejection_reason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model('personal_details', docPersonalDetailSchema);
