const mongoose = require('../db/index');

const paymentSchema = mongoose.Schema({
    paymentId: { type: String },
    transactionId: { type: String },
    payerId: { type: String },
    invoiceId: { type: String },
    amount: { type: Number },
    status: { type: Boolean, default: false }
}, { timestamps: {} });

module.exports = mongoose.model('Payment', paymentSchema);
