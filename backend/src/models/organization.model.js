import mongoose from 'mongoose';

const { Schema } = mongoose; 

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[0-9+\-() ]{6,20}$/,
        'Phone number must be valid (landline or mobile)',
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Email format is invalid'],
    },
    organization_address: {
      type: String,
      trim: true,
    },
    doctor_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    is_individual: {
      type: Boolean,
      default: true,
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

const Organization =
  mongoose.models.organization ||
  mongoose.model('organization', organizationSchema);

export default Organization;
