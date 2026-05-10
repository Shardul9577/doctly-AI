import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const doctorPatientRelationSchema = new Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'organization', // assuming you have an Organization model
      required: false,
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

export default model('doctor_patient_relation', doctorPatientRelationSchema);
