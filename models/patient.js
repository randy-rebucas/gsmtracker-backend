const mongoose = require('./../db/index');

const physicianSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Physicians' }
});

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    description: String,
    physicians: [physicianSchema],
    deleted: { type: Number, default: 0 }
});

module.exports = mongoose.model('Patients', schema);
