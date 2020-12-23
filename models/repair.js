const mongoose = require('./../db/index');

const labelSchema = mongoose.Schema({
    labelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labels' }
});

const ownerSchema = mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
});

const schema = mongoose.Schema({
    owners: [ownerSchema],
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    phoneInfo: {
        brand: { type: String, required: true },
        model: { type: String, required: true },
        serialNumber: { type: String, required: true },
        others: { type: String, default: null }
    },
    labels: [labelSchema],
    complaint: { type: String, required: true },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    actionTaken: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    warranty: { type: String, default: 'no-warranty' },
    release: { type: Date, defaul: null },
    status: { type: String, default: 'pending' },
    deleted: { type: Number, default: 0 }
}, { timestamps: {} });

module.exports = mongoose.model('Repair', schema);