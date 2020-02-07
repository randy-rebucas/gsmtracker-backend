const mongoose = require('./../db/index');

const physicianSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Physicians' }
});

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    description: String,
    physicians: [physicianSchema]
});

module.exports = mongoose.model('Patients', schema);
