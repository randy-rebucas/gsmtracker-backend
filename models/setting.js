const mongoose = require('./../db/index');

const settingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String },
    shopOwner: { type: String },
    language: { type: String },
    updates: { type: Boolean }
});


module.exports = mongoose.model('Setting', settingSchema);