const mongoose = require('../db/index');

const schema = mongoose.Schema({
    genericName: { type: String, required: true },
    categories: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },
    strength: { type: String, required: true },
    dosage: { type: String, required: true },
    quantity: { type: String, default: 0 },
    brandName: { type: String, default: null },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer' },
});

module.exports = mongoose.model('Drugs', schema);
