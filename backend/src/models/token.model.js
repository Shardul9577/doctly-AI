import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const tokenSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    access_token_expires_at: {
      type: Date,
      required: true,
    },
    refresh_token_expires_at: {
      type: Date,
      required: true,
    },
    created_at: {
      type: Date,
      default: () => new Date(),
    },
    updated_at: {
      type: Date,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    timestamps: false, // manually managing timestamps
  }
);

export default model('token', tokenSchema);
