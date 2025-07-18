import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  favorite: { type: Boolean, default: false },
  userId: { type: String }, // For bonus: user-specific notes
}, {
  timestamps: true // adds createdAt and updatedAt
});

export const Note = mongoose.model('Note', noteSchema);
