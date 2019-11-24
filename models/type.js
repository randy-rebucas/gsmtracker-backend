const mongoose = require('./../db/index');

const typeSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    key: String,
    generated: { type: String, default: 'System' }
});

module.exports = mongoose.model('Type', typeSchema);
