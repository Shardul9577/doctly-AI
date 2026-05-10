import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const VisitDetailsSchema = Schema(
  {
    doctor_patient_relations_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'doctor_patient_relation',
    },
    report_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    visit_date: {
      type: String,
      required: true,
    },
    visit_time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    visit_type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'completed'],
      default: 'pending',
    },
    case_file_type: {
      type: String,
      enum: ['new', 'old'],
      required: true,
    },
    diagnosis: {
      type: [String],
    },
    symptoms: {
      type: [String],
    },
    notes: {
      type: String,
    },
    prescription: [
      {
        medicine_name: { type: String },
        dosage: { type: String },
        duration: { type: String },
        instructions: { type: String },
      },
    ],
    attachments: [{ type: String }],
    ai_summary: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model('visit', VisitDetailsSchema);
