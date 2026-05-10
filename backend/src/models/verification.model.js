import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const verificationDetailSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
    is_phone_verified: {
      type: Boolean,
      default: false,
    },
    doc_personal_details_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocPersonalDetail',
      required: false,
    },
    verification_code: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
      trim: true,
    },
    sso_provider: {
      type: String,
      enum: ['google', 'apple', null],
      default: null,
    },
    sso_id: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('user_verification', verificationDetailSchema);
