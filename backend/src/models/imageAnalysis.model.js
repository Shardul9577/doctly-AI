import mongoose from 'mongoose';

const imageAnalysisSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true,
    },
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visit',
      required: true,
      index: true,
    },
    images: {
      type: Array,
      required: true,
      imagePath: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
      },
      analysis: {
        type: String,
        required: true,
      },
      confidence: {
        type: Number,
        required: true,
      },
      detectedConditions: {
        type: Array,
        required: true,
      },
      recommendations: {
        type: Array,
        required: true,
      },
    },
    overallAnalysis: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
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
      totalImages: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    error: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
imageAnalysisSchema.index({ doctorId: 1, timestamp: -1 });
imageAnalysisSchema.index({ patientId: 1, timestamp: -1 });
imageAnalysisSchema.index({ visitId: 1, timestamp: -1 });
imageAnalysisSchema.index({ status: 1 });
imageAnalysisSchema.index({ createdAt: -1 });

// Virtual for total images
imageAnalysisSchema.virtual('totalImages').get(function () {
  return this.images.length;
});

// Ensure virtuals are serialized
imageAnalysisSchema.set('toJSON', { virtuals: true });
imageAnalysisSchema.set('toObject', { virtuals: true });

const ImageAnalysis = mongoose.model('image_analysis', imageAnalysisSchema);

export default ImageAnalysis;
