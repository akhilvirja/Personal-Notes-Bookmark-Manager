import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  tags: [{ type: String }],
  favorite: { type: Boolean, default: false },
  userId: { type: String }, // For bonus: user-specific bookmarks
}, {
  timestamps: true // adds createdAt and updatedAt
});

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
