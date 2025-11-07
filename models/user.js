// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true, unique: true, sparse: true },
    email: { type: String, index: true },
    name: String,
    picture: String,
    role: { type: String, enum: ['PLAYER', 'DM'], default: 'PLAYER' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
