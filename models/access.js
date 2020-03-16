const mongoose = require('./../db/index');

const blockchain = mongoose.Schema({
    blockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blockchain', required: true }
});

const accessSchema = mongoose.Schema({
    blocks: [blockchain],
    physicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patients', required: true },
    status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Access', accessSchema);
