import mongoose from 'mongoose';
import generateAbhaId from '../config/code.config.js';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema, model } = mongoose;

const socialLinksSchema = new Schema(
  {
    facebook: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Email format is invalid'],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?\d{10,15}$/, 'Phone number must be valid'],
    },
    age: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
    },
    gender: {
      type: String,
      required: false,
      enum: ['male', 'female', 'other'],
    },
    birth_date: {
      type: String,
      required: false,
    },
    blood_group: {
      type: String,
      required: false,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    marital_status: {
      type: String,
      required: false,
      enum: ['single', 'married', 'divorced', 'widowed'],
    },
    spouse_full_name: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile_picture: {
      type: String,
      trim: true,
    },
    abha_id: {
      type: String,
      unique: true,
    },
    verification_details_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user_verification',
    },
    personal_address: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    social_links: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    personal_details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'personal_details',
      required: false,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(mongoosePaginate);
userSchema.pre('save', async function (next) {
  if (!this.isNew || this.abha_id) return next();

  try {
    const abhaId = await generateAbhaId(this.role);
    this.abha_id = abhaId;
    next();
  } catch (err) {
    next(err);
  }
});

export default model('user', userSchema);
