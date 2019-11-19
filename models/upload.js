// const mongoose = require('mongoose');
const mongoose = require('./../db/index');

const documentsSchema = mongoose.Schema({
    src: { type: String },
    thumb: { type: String },
    name: { type: String },
    type: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
}, { timestamps: {} });

module.exports = mongoose.model('Documents', documentsSchema);