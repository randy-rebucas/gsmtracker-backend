const mongoose = require('./../db/index');

const physicianSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Physicians' }
});

const labelSchema = mongoose.Schema({
    labelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labels' }
});

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    description: String,
    physicians: [physicianSchema],
    deleted: { type: Number, default: 0 },
    labels: [labelSchema],
});

module.exports = mongoose.model('Patients', schema);
