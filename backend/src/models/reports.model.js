import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reportSchema = new Schema(
  {
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'visit',
      required: true,
    },
    diagnosis: { type: String, required: true },
    vitals: [
      {
        vital_sign: { type: String, required: true },
        reading: { type: String, required: true },
        normal_range: { type: String, required: true },
        status: {
          type: String,
          required: true,
        },
      },
    ],
    doctor_remarks: { type: String },
    ai_health_analysis: {
      current_health_summary: [{ type: String }],
      predicted_disease_probability: [
        {
          disease: { type: String, required: true },
          probability: { type: Number, required: true },
          risk_level: {
            type: String,
            required: true,
          },
          reason: { type: String, required: true },
        },
      ],
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

export default model('report', reportSchema);
