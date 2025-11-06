// models/character.js
import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    race: { type: String, required: true },
    class: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 20 },
    alignment: { type: String, default: '' },
    background: { type: String, default: '' },
    hitPoints: { type: Number, required: true, min: 1 },

    strength: { type: Number, required: true, min: 1, max: 30 },
    dexterity: { type: Number, required: true, min: 1, max: 30 },
    constitution: { type: Number, required: true, min: 1, max: 30 },
    intelligence: { type: Number, required: true, min: 1, max: 30 },
    wisdom: { type: Number, required: true, min: 1, max: 30 },
    charisma: { type: Number, required: true, min: 1, max: 30 },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      default: null
    }
  },
  { timestamps: true }
);

// ✅ Model name "Character" → Collection name forced to "adventurers"
export default mongoose.model('Character', characterSchema, 'adventurers');
