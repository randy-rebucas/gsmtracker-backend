const mongoose = require('./../db/index');

const labelSchema = mongoose.Schema({
    labelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labels' }
});

const schema = mongoose.Schema({
    owners: [{
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
    }],
    customer: {
        name: {
            firstname: { type: String, required: true },
            lastname: { type: String, required: true }
        },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    phoneInfo: {
        brand: { type: String, required: true },
        model: { type: String, required: true },
        serialNumber: { type: String, required: true },
        others: { type: String, default: null }
    },
    complaint: { type: String, required: true },
    actionTaken: { type: String, required: true },
    technician: { type: String },
    amountPaid: { type: Number, required: true },
    // technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    labels: [labelSchema],
    warranty: { type: String, default: 'no-warranty' },
    release: { type: Date, defaul: null },
    status: { type: String, default: 'pending' },
    deleted: { type: Number, default: 0 }
}, { timestamps: {} });

module.exports = mongoose.model('Repair', schema);
