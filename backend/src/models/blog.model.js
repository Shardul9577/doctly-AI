import mongoose from 'mongoose';

const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    postTitle: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    sections: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'blogs',
  }
);

export default mongoose.model('Blog', blogSchema);
