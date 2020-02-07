const mongoose = require('./../db/index');

const schema = mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('Categories', schema);
