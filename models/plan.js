const mongoose = require('../db/index');

const planSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    price: { type: Number },
    packages: [{
        title: { type: String }
    }]
});

module.exports = mongoose.model('Plan', planSchema);
