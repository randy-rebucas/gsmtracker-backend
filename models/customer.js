const mongoose = require('./../db/index');

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    description: String,
});

module.exports = mongoose.model('Customer', schema);