const mongoose = require('./../db/index');

const items = mongoose.Schema({
    drugId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drugs' },
    quantity: Number
});

const transactions = mongoose.Schema({
    amount: Number,
    description: String,
    itemList: [items]
});

const schema = mongoose.Schema({
    intent: { type: String, required: true }, // sales, replenish, return
    transactions: [transactions],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }
}, { timestamps: {} });

module.exports = mongoose.model('Inventories', schema);
