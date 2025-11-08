import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dm: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    system: { type: String, default: 'D&D 5e' },
    status: { type: String, enum: ['active', 'paused', 'finished'], default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.model('Campaign', campaignSchema, 'campaigns');
