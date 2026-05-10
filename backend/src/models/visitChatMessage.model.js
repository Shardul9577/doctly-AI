import mongoose from 'mongoose';

const visitChatMessageSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visit',
      required: false,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      type: String,
      required: true,
      trim: true,
    },
    rawResponse: {
      type: String,
      required: false,
      trim: true,
    },
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    isDoctorRelated: {
      type: Boolean,
      default: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      model: {
        type: String,
        default: 'claude-3.5-sonnet',
      },
      tokens: {
        input: Number,
        output: Number,
      },
      processingTime: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
visitChatMessageSchema.index({ doctorId: 1, timestamp: -1 });
visitChatMessageSchema.index({ patientId: 1, timestamp: -1 });
visitChatMessageSchema.index({ visitId: 1, timestamp: -1 });
visitChatMessageSchema.index({ conversationId: 1, timestamp: 1 });
visitChatMessageSchema.index({ isDoctorRelated: 1 });

// Virtual for message length
visitChatMessageSchema.virtual('messageLength').get(function () {
  return this.message.length;
});

visitChatMessageSchema.virtual('responseLength').get(function () {
  return this.response.length;
});

// Ensure virtuals are serialized
visitChatMessageSchema.set('toJSON', { virtuals: true });
visitChatMessageSchema.set('toObject', { virtuals: true });

const VisitChatMessage = mongoose.model(
  'visit_chat_message',
  visitChatMessageSchema
);

export default VisitChatMessage;
