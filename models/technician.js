const mongoose = require('../db/index');

const expertiseSchema = mongoose.Schema({
    expertise: { type: String, default: null },
    expertiseYearExperience: { type: Number, default: null }
});

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    expertise: [expertiseSchema],
    description: String,
    professionalFee: { type: String }
});

module.exports = mongoose.model('Technician', schema);