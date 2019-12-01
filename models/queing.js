const mongoose = require('./../db/index');

const queingSchema = mongoose.Schema({
  created: { type: Date, default: Date.now },
  queNumber: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Queing', queingSchema);