import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dm:   { type: String, required: true, trim: true },        // email of DM
    description: { type: String, trim: true },
    players: { type: [String], default: [] },                   // emails of players
    system:  { type: String, default: 'D&D 5e', trim: true },
    status:  { type: String, enum: ['active', 'paused', 'finished'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model('Campaign', campaignSchema);
