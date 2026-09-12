import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  }
}, { timestamps: true });

// Ensure unique keys per user
StoreSchema.index({ userId: 1, key: 1 }, { unique: true });

const Store = mongoose.model('Store', StoreSchema);
export default Store;
